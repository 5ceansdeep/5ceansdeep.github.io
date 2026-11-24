# OH SOOHYUN — Frontend Portfolio

**▶ https://5ceansdeep.github.io**

프론트엔드 개발자 오수현의 포트폴리오 사이트입니다. 흩어져 있던 프로젝트, GitHub 활동, 이력을 한 페이지에 모았습니다.

## 이런 사이트예요

- **3D 사원증 랜딩**: 목에 거는 사원증을 커서로 잡아당기고 흔들 수 있습니다. 끈은 길이가 고정된 10마디 링크, 카드는 잡은 지점을 스프링으로 당기는 물리 물체라 놓아도 튀지 않습니다.
- **Projects**: 사원증 모양 카드가 화면에 들어오면 계단식으로 올라옵니다. 기술 스택 필터, 상세 보기(주요 구현 · 문제 → 해결 → 결과).
- **GitHub**: 최근 1년 기여 그래프, 대표 레포. 데이터를 못 불러오면 대체 화면과 프로필 링크를 보여 줍니다.
- **History**: 굵직한 경험 4개와 학력 · 자격.
- **Color**: 오른쪽 아래 버튼으로 사이트 색을 바꿀 수 있습니다(Oxblood / Acid / Aubergine). 3D 끈 색까지 같이 바뀝니다.

## 기술 스택

| 분야 | 사용 |
|---|---|
| UI | React 19, TypeScript, CSS Modules |
| 3D · 물리 | three.js, React Three Fiber, drei, @react-three/rapier |
| 빌드 · 배포 | Vite, GitHub Actions → GitHub Pages |
| 데이터 | 정적 TS 파일(`src/data`), GitHub REST API, GitHub 기여 그래프 API |

백엔드와 DB 없이 동작하는 정적 사이트입니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 타입 체크 + dist/ 빌드
```

## 구조

```
src/
  App.tsx                 섹션 순서
  index.css               색 토큰(팔레트) · 공통 스타일
  palette.ts              팔레트 목록 · 선택 저장
  data/                   profile · projects · timeline (내용은 여기만 고치면 됨)
  sections/
    Landing.tsx           이름 + 3D 사원증
    Lanyard.tsx           3D 씬: 끈 · 카드 물리, 끈 직조 텍스처, 카드 앞면 텍스처
    Projects.tsx          프로젝트 카드 · 필터 · 상세 팝업
    Github.tsx            GitHub 활동 패널
    Timeline.tsx          History
    PaletteSwitch.tsx     색 바꾸기 버튼
docs/
  PRD.md                  요구사항 문서
  conventions/            커밋 컨벤션
```

## 고치는 법

- **내용**: `src/data/*.ts`만 고치면 카드 · 필터 · 타임라인에 반영됩니다.
- **색**: 기본 팔레트는 `index.html`의 `data-palette`. 새 팔레트는 `src/index.css`에 블록 하나, `src/palette.ts`에 한 줄 추가. 주소 뒤에 `?palette=acid`를 붙이면 미리 볼 수 있습니다.
- **사원증 손맛**: `src/sections/Lanyard.tsx` 위쪽 상수(카드 크기, 끈 처짐, 흔들림 감쇠, 당기는 힘).

## 배포

`main`에 push하면 GitHub Actions가 빌드해서 GitHub Pages에 올립니다(`.github/workflows/deploy.yml`).

## 커밋 컨벤션

`[FEAT] 제목` 형식. 자세한 규칙은 [docs/conventions/COMMIT_CONVENTION.md](docs/conventions/COMMIT_CONVENTION.md).
