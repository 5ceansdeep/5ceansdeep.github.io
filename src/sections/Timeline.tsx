import { timeline } from '../data/timeline.ts'
import s from './Timeline.module.css'

export default function Timeline() {
  return (
    <section className={`paper ${s.timeline}`} aria-labelledby="timeline-title">
      <div className={s.head}>
        <p className="eyebrow">03 — History</p>
        <h2 id="timeline-title" className="display">History.</h2>
      </div>
      <ol className={s.list}>
        {timeline.filter((e) => e.date).map((e) => (
          <li key={e.date + e.title} className={s.item}>
            <time className={s.date}>{e.date}</time>
            <div>
              <p className={s.name}>{e.title}</p>
              {e.desc && <p className={s.desc}>{e.desc}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
