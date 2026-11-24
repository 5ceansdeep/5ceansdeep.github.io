import { aiCases } from '../data/ai.ts'
import s from './Ai.module.css'

export default function Ai() {
  return (
    <section id="ai" className={`paper ${s.ai}`} aria-labelledby="ai-title">
      <div className={s.head}>
        <p className="eyebrow">02 — With AI</p>
        <h2 id="ai-title" className="display">With AI.</h2>
        <p className={s.lede}>AI에게 일을 맡기는 것보다, AI가 일관되게 일하도록 맥락과 규칙을 설계하고 결과를 숫자와 테스트로 확인하는 데 시간을 씁니다.</p>
      </div>
      <ol className={s.list}>
        {aiCases.map((c) => (
          <li key={c.title} className={s.item}>
            <p className={s.where}>{c.where}</p>
            <h3 className={s.title}>{c.title}</h3>
            <dl className={s.body}>
              <div><dt>PROBLEM</dt><dd>{c.problem}</dd></div>
              <div><dt>HOW</dt><dd>{c.approach}</dd></div>
            </dl>
            <p className={s.tools}>{c.tools.map((t) => <span key={t}>{t}</span>)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
