import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import {
  Physics, RigidBody, BallCollider, CuboidCollider, useSphericalJoint, interactionGroups,
  type RapierRigidBody, type RigidBodyProps,
} from '@react-three/rapier'
import { profile } from '../data/profile.ts'

// 1 unit = Figma 100px, 원점 = 화면 중앙 (Figma 640, 416)
const CARD_SCALE = 0.8 // Figma 카드(324x435) 대비 크기
const CARD = { w: 3.24 * CARD_SCALE, h: 4.35 * CARD_SCALE, d: 0.06 }
const CARD_TOP = 0.86 // 카드 윗변 y (Figma y 330). 낮출수록 끈이 길어짐
const CARD_Y = CARD_TOP - CARD.h / 2 // 카드 중심
const SLOT = { w: 0.587, h: 0.153, y: CARD.h / 2 - 0.179 } // 카드 윗부분 끈 구멍 (Figma Exclude)
const ANCHOR = { x: 2.91, y: 6.96 } // 화면 위로 숨은 끈 고정점
const JOINT = 0.565 // 카드 윗변에서 끈이 모이는 금속 캡까지 높이 (Figma V 꼭짓점 y≈182)
// 끈 마디 수. 마디 길이는 고정(고정점~금속 캡 직선거리 ÷ 마디 수)이라 끈 전체 길이가 절대 안 변함
const SEGMENTS = 16 // 많을수록 천처럼 부드럽게 휨. 마디 사이가 넓으면 그 틈으로 끈이 카드를 뚫고 지나감
const STRAP_SAG = 0.25 // 처음 끈이 늘어진 정도(unit). 이만큼 여유 길이가 생겨 천처럼 늘어지고 흔들림
const STRAP_W = 0.2
const CAP_LEAD = 0.12 // 캡 위 이만큼은 끈이 곧게 들어감
const CAP_STRAIGHTEN = 0.35 // 들어가는 방향: 0이면 끈이 오던 방향 그대로(V자), 1이면 카드 위쪽으로 똑바로(꺾임)
const CAP_TUCK = 0.05 // 끈 끝을 캡 안으로 밀어 넣는 깊이 (단면 안 보이게)
const STRAP_T = 0.025 // 끈 두께
const STRAP_TEX_LEN = 0.4 // 끈 텍스처 한 장이 덮는 길이 (unit)
const RIBBON_STEPS = 48

// 손으로 만져보며 맞추는 값
const GRAVITY = -12 // 낮을수록 느릿느릿 흔들림 (주기 ∝ 1/√g)
const STRAP_DAMPING = 2.5 // 낮을수록 끈이 하늘하늘 따라 흔들림
const CARD_DAMPING = 2 // 카드 흔들림 감쇠. 올리면 빨리 멈춤
const CARD_ANGULAR_DAMPING = 3 // 카드가 빙글빙글 돌지 않게
const SEG_MASS = 0.03 // 마디 하나 무게. 카드와 차이가 너무 크면 joint가 고무줄처럼 늘어남
const SOLVER_ITERATIONS = 16 // 높을수록 끈이 덜 늘어남 (rapier 기본 4)
const INTRO_KICK = { x: 0.5, y: 0, z: 0 } // 처음 접속할 때 옆으로 살짝 밀기. y를 주면 끈이 튕김
// 잡은 지점을 커서로 당기는 스프링. 카드는 계속 물리 물체라 끈이 안 늘어나고, 놓아도 안 튐
const PULL_STIFFNESS = 150 // 높을수록 커서를 빨리 따라옴
const PULL_DAMPING = 22 // 높을수록 따라올 때 덜 출렁임 (임계 감쇠 ≈ 2√STIFFNESS)
const CLICK_SLOP = 5 // px, 이보다 덜 움직이면 클릭
const SEG_RADIUS = 0.11 // 끈 마디 충돌 반경. 카드에 부딪히는 두께
// 충돌 그룹: 끈 마디(0)는 카드(1)하고만 부딪힘. 끈끼리는 안 부딪혀야 엉키지 않음
const STRAP_GROUP = interactionGroups(0, [1])
const CARD_GROUP = interactionGroups(1, [0])

type BodyRef = RefObject<RapierRigidBody>

const segProps: RigidBodyProps = {
  type: 'dynamic', canSleep: false, colliders: false,
  angularDamping: STRAP_DAMPING, linearDamping: STRAP_DAMPING,
}

export default function Lanyard() {
  return (
    // fov 25에서 z=18.77이면 화면 높이가 8.32 unit = Figma 832px
    <Canvas
      shadows="variance"
      gl={{ toneMapping: THREE.NeutralToneMapping }} // 흰 카드가 회색으로 안 죽는 톤 매핑
      camera={{ position: [0, 0, 18.77], fov: 25 }}
      style={{ position: 'absolute', inset: 0, zIndex: 4 }} // 이름(3) 위, 외곽선 이름(5) 아래
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-3, 5, 10]} intensity={2.6} castShadow
        shadow-mapSize={[1024, 1024]} shadow-radius={12} shadow-blurSamples={16}
        shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10}
      />
      {/* 스튜디오 조명판. 카드 코팅·금속에 비치는 반사광이 여기서 나옴 (외부 HDR 없음) */}
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 6, 3]} rotation-x={Math.PI / 3} scale={[12, 2, 1]} />
        <Lightformer intensity={2} position={[-6, 1, 4]} rotation-y={Math.PI / 2.5} scale={[8, 8, 1]} />
        <Lightformer intensity={1.5} position={[6, -1, 4]} rotation-y={-Math.PI / 2.5} scale={[8, 3, 1]} />
      </Environment>
      {/* 투명 바닥. 그림자만 받아서 뒤의 이름 글자 위에 떨어짐 */}
      <mesh position={[0, 0, -0.5]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.25} />
      </mesh>
      <Physics gravity={[0, GRAVITY, 0]} timeStep={1 / 60} numSolverIterations={SOLVER_ITERATIONS}>
        <Badge />
      </Physics>
    </Canvas>
  )
}

type Grab = { local: THREE.Vector3; x: number; y: number; moved: boolean }

function Badge() {
  const card = useRef<RapierRigidBody>(null) as BodyRef
  // 팔레트 버튼으로 <html data-palette>가 바뀌면 끈 텍스처를 새 --strap 색으로 다시 만듦
  const [palette, setPalette] = useState(document.documentElement.dataset.palette)
  useEffect(() => {
    const mo = new MutationObserver(() => setPalette(document.documentElement.dataset.palette))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-palette'] })
    return () => mo.disconnect()
  }, [])
  const strapTex = useMemo(strapTexture, [palette])
  useEffect(() => () => { strapTex.map.dispose(); strapTex.bump.dispose() }, [strapTex])
  const left = useStrap(-1, card, strapTex)
  const right = useStrap(1, card, strapTex)
  const geo = useMemo(() => ({ body: cardGeometry(), face: faceGeometry() }), [])
  const face = useFace()
  const grab = useRef<Grab | null>(null)
  const kicked = useRef(false)
  const tmp = useMemo(() => ({
    target: new THREE.Vector3(), pt: new THREE.Vector3(), f: new THREE.Vector3(), q: new THREE.Quaternion(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
  }), [])

  useFrame(({ pointer, camera, raycaster }, delta) => {
    const c = card.current
    if (!c) return
    if (!kicked.current) {
      kicked.current = true
      c.applyImpulse(INTRO_KICK, true)
    }
    tmp.q.copy(c.rotation() as THREE.Quaternion)
    const g = grab.current
    if (g) {
      // 커서가 가리키는 z=0 평면 위 점
      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.intersectPlane(tmp.plane, tmp.target)
      // 잡은 지점(월드) → 커서 쪽으로 스프링 힘. 잡은 지점에 걸어서 모서리 잡으면 카드가 돌아감
      tmp.pt.copy(g.local).applyQuaternion(tmp.q).add(c.translation() as THREE.Vector3)
      const v = c.linvel()
      const dt = Math.min(delta, 1 / 30)
      tmp.f.subVectors(tmp.target, tmp.pt).clampLength(0, 3).multiplyScalar(PULL_STIFFNESS)
      tmp.f.x -= v.x * PULL_DAMPING
      tmp.f.y -= v.y * PULL_DAMPING
      tmp.f.z -= v.z * PULL_DAMPING
      tmp.f.multiplyScalar(c.mass() * dt)
      c.applyImpulseAtPoint(tmp.f, tmp.pt, true)
    }
    // y축으로 너무 돌지 않게 정면 쪽으로 살짝 되돌림
    const ang = c.angvel(), rot = c.rotation()
    c.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)

    left.update(tmp.q)
    right.update(tmp.q)
  })

  const linkAt = (e: ThreeEvent<PointerEvent>) => (e.object.name === 'face' && e.uv ? face.hit(e.uv) : undefined)

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    document.documentElement.classList.add('rock')
    const c = card.current
    const local = e.point.clone().sub(c.translation() as THREE.Vector3)
      .applyQuaternion(tmp.q.copy(c.rotation() as THREE.Quaternion).invert())
    grab.current = { local, x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, moved: false }
  }
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const g = grab.current
    if (g) {
      if (Math.hypot(e.nativeEvent.clientX - g.x, e.nativeEvent.clientY - g.y) > CLICK_SLOP) g.moved = true
      return
    }
    document.body.style.cursor = linkAt(e) ? 'pointer' : 'grab'
  }
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as Element).releasePointerCapture(e.pointerId)
    document.documentElement.classList.remove('rock')
    const g = grab.current
    grab.current = null
    const href = g && !g.moved ? linkAt(e) : undefined
    if (href) window.open(href, '_blank', 'noopener')
  }

  const top = CARD.h / 2
  const clipZ = CARD.d / 2 + 0.02

  return (
    <>
      {left.bodies}
      {right.bodies}
      {left.mesh}
      {right.mesh}
      <RigidBody
        ref={card} {...segProps} position={[0, CARD_Y, 0]}
        linearDamping={CARD_DAMPING} angularDamping={CARD_ANGULAR_DAMPING}
      >
        <CuboidCollider args={[CARD.w / 2, CARD.h / 2, CARD.d / 2]} collisionGroups={CARD_GROUP} friction={0.2} />
        <group
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
          onPointerOut={() => { document.body.style.cursor = '' }}
        >
          {/* 카드 몸체: 둥근 모서리 + 끈 구멍 뚫린 PVC 판, 표면 코팅 광택 */}
          <mesh geometry={geo.body} castShadow receiveShadow>
            <meshPhysicalMaterial color="#fff" roughness={0.55} clearcoat={1} clearcoatRoughness={0.18} />
          </mesh>
          {/* 앞면 인쇄. 텍스처라서 조명·코팅 반사를 같이 받음 */}
          <mesh name="face" geometry={geo.face} position-z={CARD.d / 2 + 0.0008} receiveShadow>
            <meshPhysicalMaterial map={face.tex} roughness={0.6} clearcoat={0.5} clearcoatRoughness={0.15} />
          </mesh>

          {/* 플라스틱 클립 (Figma 618,211 44x49): 앞판·뒷판이 구멍을 통과해 이어짐 */}
          {[clipZ, -clipZ].map((z) => (
            <RoundedBox key={z} args={[0.44, 0.49, 0.03]} radius={0.012} position={[0, top + 0.065, z]} castShadow>
              <meshPhysicalMaterial color="#f4f4f4" roughness={0.3} clearcoat={0.6} />
            </RoundedBox>
          ))}
          <mesh position={[0, SLOT.y, 0]}>
            <boxGeometry args={[0.4, 0.09, CARD.d + 0.04]} />
            <meshPhysicalMaterial color="#e6e6e6" roughness={0.3} />
          </mesh>
          {/* 클립 똑딱이 */}
          <mesh position={[0, top + 0.08, clipZ + 0.02]} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.06, 0.065, 0.02, 24]} />
            <Metal />
          </mesh>
          {/* 클립과 끈을 잇는 금속 고리 */}
          <mesh position={[0, top + 0.37, 0]} rotation-y={1} castShadow>
            <torusGeometry args={[0.09, 0.018, 12, 32]} />
            <Metal />
          </mesh>
          {/* 두 끈 끝을 물고 있는 금속 캡 */}
          <RoundedBox args={[0.26, 0.14, 0.07]} radius={0.02} position={[0, top + JOINT - 0.035, 0]} castShadow>
            <Metal />
          </RoundedBox>
        </group>
      </RigidBody>
    </>
  )
}

const Metal = () => <meshStandardMaterial color="#d4d4d8" metalness={1} roughness={0.25} />

const BEVEL = 0.008

function cardShape() {
  const { w, h } = CARD
  const r = 0.07
  const x = w / 2 - BEVEL, y = h / 2 - BEVEL
  const shape = new THREE.Shape()
  shape.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false)
  shape.absarc(x - r, y - r, r, 0, Math.PI / 2, false)
  shape.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false)
  shape.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false)
  const slot = new THREE.Path()
  const sr = SLOT.h / 2 + BEVEL, sx = SLOT.w / 2 - SLOT.h / 2
  slot.absarc(sx, SLOT.y, sr, -Math.PI / 2, Math.PI / 2, false)
  slot.absarc(-sx, SLOT.y, sr, Math.PI / 2, Math.PI * 1.5, false)
  shape.holes.push(slot)
  return shape
}

function cardGeometry() {
  const depth = CARD.d - BEVEL * 2
  const geo = new THREE.ExtrudeGeometry(cardShape(), {
    depth, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: BEVEL, bevelSegments: 3, curveSegments: 10,
  })
  geo.translate(0, 0, -depth / 2)
  return geo
}

// 앞면 인쇄용 판. 같은 모양(구멍 포함)에 UV를 카드 전체 0~1로
function faceGeometry() {
  const geo = new THREE.ShapeGeometry(cardShape(), 10)
  const pos = geo.attributes.position, uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / CARD.w + 0.5, pos.getY(i) / CARD.h + 0.5)
  return geo
}

// 카드 앞면을 캔버스에 그려 텍스처로. 좌표는 Figma 카드 px (324x435)
function useFace() {
  return useMemo(() => {
    const W = 324, H = 435, S = 4
    const c = document.createElement('canvas')
    c.width = W * S
    c.height = H * S
    const g = c.getContext('2d')!
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    const links: { x: number; y: number; w: number; h: number; href: string }[] = []
    let photo: HTMLImageElement | undefined
    const serif = (px: number) => `${px}px "Instrument Serif", serif`

    const draw = () => {
      g.setTransform(S, 0, 0, S, 0, 0)
      g.fillStyle = '#fff'
      g.fillRect(0, 0, W, H)
      g.fillStyle = '#000'
      g.textBaseline = 'top'
      g.strokeStyle = '#000'
      g.lineWidth = 0.5
      // 가는 세리프가 작은 카드에서 흐려지지 않게 획을 살짝 두껍게
      const text = (t: string, x: number, y: number) => { g.strokeStyle = g.fillStyle; g.fillText(t, x, y); g.strokeText(t, x, y) }
      g.font = serif(30)
      profile.role.forEach((r, i) => text(r, 34, 59 + i * 36))

      const px = W - 34 - 104, py = 59
      if (photo) {
        const k = Math.max(104 / photo.width, 130 / photo.height)
        g.save()
        g.beginPath()
        g.rect(px, py, 104, 130)
        g.clip()
        g.drawImage(photo, px + (104 - photo.width * k) / 2, py + (130 - photo.height * k) / 2, photo.width * k, photo.height * k)
        g.restore()
      } else {
        g.fillStyle = '#fafafa'
        g.fillRect(px, py, 104, 130)
        g.fillStyle = '#999'
        g.font = serif(16)
        g.textAlign = 'center'
        g.fillText('photo', px + 52, py + 57)
        g.textAlign = 'left'
      }
      g.strokeStyle = '#e5e5e5'
      g.lineWidth = 1
      g.strokeRect(px + 0.5, py + 0.5, 103, 129)

      g.fillStyle = '#ccc'
      g.fillRect(34, 313, W - 68, 1)
      g.fillStyle = '#000'
      g.font = serif(40)
      text(`${profile.firstName} ${profile.lastName}`, 34, 329)

      g.font = serif(20)
      links.length = 0
      let x = 34
      for (const { label, href } of profile.links) {
        const t = `${label} ↗`
        const w = g.measureText(t).width
        text(t, x, 378)
        links.push({ x: x - 4, y: 372, w: w + 8, h: 30, href })
        x += w + 20
      }
      tex.needsUpdate = true
    }

    draw()
    document.fonts.load(serif(30)).then(draw) // 웹폰트 늦게 오면 다시 그림
    if (profile.photo) {
      const img = new Image()
      img.onload = () => { photo = img; draw() }
      img.src = profile.photo
    }
    const hit = (uv: THREE.Vector2) => {
      const x = uv.x * W, y = (1 - uv.y) * H
      return links.find((l) => x >= l.x && x <= l.x + l.w && y >= l.y && y <= l.y + l.h)?.href
    }
    return { tex, hit }
  }, [])
}

// 끈 텍스처: 폴리에스터 2/1 능직. 세로실(끈 길이 방향)·가로실이 엇갈려 사선 결이 생김.
// 실 하나하나를 둥글게 음영 주고, 같은 높이값으로 요철(bump) 맵도 만듦
function strapTexture() {
  const W = 64, H = 128 // 0.2 x STRAP_TEX_LEN unit
  const WARP = 4, WEFT = 3 // 세로실·가로실 굵기(px)
  const EDGE = 5 // 양쪽 테두리(셀비지) 폭
  // 끈 색은 CSS 토큰 --strap (src/index.css). 조명·반사로 밝아지는 만큼 60%로 어둡게
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--strap').trim() || '#172463'
  const base = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) * 0.6)
  const color = new ImageData(W, H), height = new ImageData(W, H)
  const hash = (n: number) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s) }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const edge = x < EDGE || x >= W - EDGE
      const cx = Math.floor(x / WARP), cy = Math.floor(y / WEFT)
      // 테두리는 세로실만 촘촘히, 몸통은 2/1 능직 (세 칸 중 두 칸 세로실이 위)
      const warpUp = edge || (cx + cy) % 3 !== 0
      const across = warpUp ? ((x % WARP) + 0.5) / WARP : ((y % WEFT) + 0.5) / WEFT
      const round = Math.sin(Math.PI * across) // 실 단면: 가운데 볼록
      const tone = warpUp ? 1 + (hash(cx) - 0.5) * 0.12 : 0.82 + (hash(cy + 999) - 0.5) * 0.1
      const fiber = 1 + (Math.random() - 0.5) * 0.08
      const k = (0.5 + 0.6 * round) * tone * fiber * (edge ? 0.8 : 1)
      const h = Math.round(255 * (warpUp ? 0.35 + 0.65 * round : 0.15 + 0.5 * round))
      const i = (y * W + x) * 4
      for (let ch = 0; ch < 3; ch++) color.data[i + ch] = Math.min(255, base[ch] * k)
      height.data[i] = height.data[i + 1] = height.data[i + 2] = h
      color.data[i + 3] = height.data[i + 3] = 255
    }
  }

  const make = (img: ImageData, srgb: boolean) => {
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    c.getContext('2d')!.putImageData(img, 0, 0)
    const tex = new THREE.CanvasTexture(c)
    if (srgb) tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.anisotropy = 8
    return tex
  }
  return { map: make(color, true), bump: make(height, false) }
}

function useStrap(side: -1 | 1, card: BodyRef, tex: ReturnType<typeof strapTexture>) {
  const end = CARD_Y + CARD.h / 2 + JOINT
  // 처음 놓이는 모양: 고정점 → 캡을 잇는 직선에서 아래쪽으로 STRAP_SAG만큼 늘어진 곡선(2차 베지어).
  // 마디 사이 거리를 이 곡선에서 재서 고정하니까, 여유 길이가 생기고 시작할 때 튀지 않음
  const ax = side * ANCHOR.x, dx = -ax, dy = end - ANCHOR.y
  const nl = Math.hypot(dx, dy)
  let nx = -dy / nl, ny = dx / nl
  if (ny > 0) { nx = -nx; ny = -ny } // 아래쪽으로 처지게
  const cx = ax + dx / 2 + nx * STRAP_SAG * 2, cy = ANCHOR.y + dy / 2 + ny * STRAP_SAG * 2
  const at = (t: number): [number, number, number] => {
    const u = 1 - t
    return [u * u * ax + 2 * u * t * cx, u * u * ANCHOR.y + 2 * u * t * cy + t * t * end, 0]
  }

  // 마디끼리 길이 고정 링크로 연결: 다음 마디 기준으로 이전 마디가 처음 놓인 방향·거리에 붙어 있음.
  // 각도는 자유롭게 꺾이지만 거리는 안 변함 (SEGMENTS는 상수라 반복문 안 훅 호출 순서가 항상 같음)
  const refs = Array.from({ length: SEGMENTS + 1 }, () => useRef<RapierRigidBody>(null)) as BodyRef[]
  for (let i = 0; i < SEGMENTS; i++) {
    const a = at(i / SEGMENTS), b = at((i + 1) / SEGMENTS)
    useSphericalJoint(refs[i], refs[i + 1], [[0, 0, 0], [a[0] - b[0], a[1] - b[1], 0]])
  }
  useSphericalJoint(refs[SEGMENTS], card, [[0, 0, 0], [0, CARD.h / 2 + JOINT, 0]])

  // 끈 단면 = 납작한 직사각형. 앞·옆·뒤·옆 4면, 면마다 정점 따로 둬서 모서리가 각지게
  const FACES = 4, VPS = FACES * 2
  const r = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(RIBBON_STEPS * VPS * 3), 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(RIBBON_STEPS * VPS * 2), 2))
    const idx: number[] = []
    for (let i = 0; i < RIBBON_STEPS - 1; i++) {
      for (let f = 0; f < FACES; f++) {
        const a = i * VPS + f * 2, b = a + 1, c = a + VPS, d = c + 1
        idx.push(a, b, c, b, d, c)
      }
    }
    geo.setIndex(idx)
    return {
      geo,
      // 마디 위치 + 캡 바로 위 보조점 1개: 끈이 캡에 사선으로 꽂히지 않고 똑바로 들어가게
      curve: new THREE.CatmullRomCurve3([...refs, null].map(() => new THREE.Vector3()), false, 'chordal'),
      up: new THREE.Vector3(), lead: new THREE.Vector3(),
      p: new THREE.Vector3(), tan: new THREE.Vector3(), side: new THREE.Vector3(), n: new THREE.Vector3(),
      cardX: new THREE.Vector3(), corners: [0, 1, 2, 3].map(() => new THREE.Vector3()),
    }
  }, [])

  // 위쪽은 화면을 향하고, 카드 쪽으로 갈수록 카드 가로축에 맞춰 꼬임
  const update = (cardRot: THREE.Quaternion) => {
    if (refs.some((b) => !b.current)) return
    const pts = r.curve.points
    refs.forEach((b, i) => pts[i].copy(b.current.translation() as THREE.Vector3))
    // 마지막 마디(=캡 위치)를 보조점으로 옮기고, 끝점은 캡 안쪽으로 살짝 밀어 넣음.
    // 보조점 방향은 끈이 오던 방향과 카드 위쪽 사이 → 캡 바로 위에서 갑자기 꺾이지 않음
    r.up.set(0, 1, 0).applyQuaternion(cardRot)
    r.lead.subVectors(pts[SEGMENTS - 1], pts[SEGMENTS]).normalize().lerp(r.up, CAP_STRAIGHTEN).normalize()
    pts[SEGMENTS + 1].copy(pts[SEGMENTS]).addScaledVector(r.up, -CAP_TUCK)
    pts[SEGMENTS].addScaledVector(r.lead, CAP_LEAD)
    r.curve.updateArcLengths()
    const len = r.curve.getLength()
    r.cardX.set(1, 0, 0).applyQuaternion(cardRot)
    const pos = r.geo.attributes.position as THREE.BufferAttribute
    const uv = r.geo.attributes.uv as THREE.BufferAttribute
    const [c0, c1, c2, c3] = r.corners
    for (let i = 0; i < RIBBON_STEPS; i++) {
      const t = i / (RIBBON_STEPS - 1)
      r.curve.getPointAt(t, r.p)
      r.curve.getTangentAt(t, r.tan)
      r.side.set(0, 0, 1).cross(r.tan)
      if (r.side.dot(r.cardX) < 0) r.side.negate()
      r.side.lerp(r.cardX, t * t)
      r.side.addScaledVector(r.tan, -r.side.dot(r.tan)).normalize()
      r.n.crossVectors(r.side, r.tan).normalize().multiplyScalar(STRAP_T / 2)
      r.side.multiplyScalar(STRAP_W / 2)
      c0.copy(r.p).add(r.side).add(r.n)
      c1.copy(r.p).sub(r.side).add(r.n)
      c2.copy(r.p).sub(r.side).sub(r.n)
      c3.copy(r.p).add(r.side).sub(r.n)
      const v = ((t - 1) * len) / STRAP_TEX_LEN // 결 기준점 = 금속 캡 쪽 끝 → 캡 근처 결이 미끄러지지 않음
      const faces = [[c0, c1], [c1, c2], [c2, c3], [c3, c0]]
      faces.forEach(([a, b], f) => {
        const k = i * VPS + f * 2
        pos.setXYZ(k, a.x, a.y, a.z)
        pos.setXYZ(k + 1, b.x, b.y, b.z)
        uv.setXY(k, side < 0 ? 1 : 0, v) // 양쪽 끈 글자 방향 맞춤
        uv.setXY(k + 1, side < 0 ? 0 : 1, v)
      })
    }
    pos.needsUpdate = true
    uv.needsUpdate = true
    r.geo.computeVertexNormals()
    r.geo.computeBoundingSphere()
  }

  // ponytail: 끈 마디가 떨리면 Vercel 랜야드처럼 마디 위치를 lerp로 부드럽게
  const bodies = refs.map((ref, i) =>
    i === 0
      ? <RigidBody key={i} ref={ref} type="fixed" position={at(0)} />
      : (
        <RigidBody key={i} ref={ref} {...segProps} position={at(i / SEGMENTS)}>
          <BallCollider args={[SEG_RADIUS]} mass={SEG_MASS} collisionGroups={STRAP_GROUP} friction={0.2} />
        </RigidBody>
      ),
  )

  const mesh = (
    <mesh geometry={r.geo} castShadow frustumCulled={false}>
      {/* 폴리에스터 끈: 거친 면 + 은은한 광택(sheen) */}
      <meshPhysicalMaterial
        map={tex.map} bumpMap={tex.bump} bumpScale={2} roughness={0.75}
        sheen={1} sheenRoughness={0.4} sheenColor="#8a9bff" side={THREE.DoubleSide}
      />
    </mesh>
  )

  return { bodies, mesh, update }
}
