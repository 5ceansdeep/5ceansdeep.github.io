import { credentials, timeline } from '../data/timeline.ts'
import { profile } from '../data/profile.ts'
import s from './Timeline.module.css'

export default function Timeline() {
  return (
    <section className={`paper ${s.timeline}`} aria-labelledby="timeline-title">
      <div className={s.head}>
        <p className="eyebrow">04 — History</p>
        <h2 id="timeline-title" className="display">History.</h2>
      </div>
      <ol className={s.list}>
        {timeline.map((e) => (
          <li key={e.date + e.title} className={s.item}>
            <time className={s.date}>{e.date}</time>
            <div>
              <p className={s.title}>{e.title}</p>
              <p className={s.org}>{e.org}</p>
              <p className={s.desc}>{e.desc}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className={s.credentials}>
        {credentials.map((c) => <span key={c}>{c}</span>)}
      </p>
      <p className={s.contact}>
        <span>CONTACT</span>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
    </section>
  )
}
