import { profile } from '../data/profile.ts'
import Lanyard from './Lanyard.tsx'
import s from './Landing.module.css'

export default function Landing() {
  return (
    <section className={`paper ${s.landing}`}>
      <h1 className={s.name}>
        <span>{profile.firstName}</span> <span>{profile.lastName}</span>
      </h1>

      {/* 사원증 앞면은 3D 텍스처라 스크린리더·키보드용으로 같은 내용을 숨겨 둠 */}
      <div className={s.srOnly}>
        <p>{profile.role.join(' ')}</p>
        <nav>
          {profile.links.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
          ))}
        </nav>
      </div>

      <Lanyard />

      {/* 같은 이름을 외곽선만 사원증 앞에 한 번 더 → 카드 위로 글자 윤곽이 비침 */}
      <p className={`${s.name} ${s.outline}`} aria-hidden>
        <span>{profile.firstName}</span> <span>{profile.lastName}</span>
      </p>

      <p className={`${s.label} ${s.tl}`}>Built By</p>
      <p className={`${s.label} ${s.tr}`}>“5ceansdeep”</p>
      <p className={`${s.label} ${s.hint}`}>drag me ↙</p>
      <p className={`${s.label} ${s.br}`}>2026 Frontend Works</p>
    </section>
  )
}
