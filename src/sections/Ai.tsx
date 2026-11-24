import { aiCases, aiLede } from '../data/ai.ts'
import s from './Ai.module.css'

export default function Ai() {
  return (
    <section id="ai" className={`paper ${s.ai}`} aria-labelledby="ai-title">
      <div className={s.head}>
        <p className="eyebrow">02 — With AI</p>
        <h2 id="ai-title" className="display">With AI.</h2>
        <p className={s.lede}>{aiLede}</p>
      </div>
      <ol className={s.list}>
        {aiCases.map((c) => (
          <li key={c.title} className={s.item}>
            <p className={s.where}>{c.where}</p>
            <div>
              <h3 className={s.title}>{c.title}</h3>
              <ul className={s.points}>{c.points.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className={s.tools}>{c.tools.map((t) => <span key={t}>{t}</span>)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
