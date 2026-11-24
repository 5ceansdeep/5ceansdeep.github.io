import { useEffect, useRef, useState } from 'react'
import { projects, type Project } from '../data/projects.ts'
import s from './Projects.module.css'

const no = (i: number) => String(i + 1).padStart(2, '0')

export default function Projects() {
  const list = useRef<HTMLOListElement>(null)
  const [seen, setSeen] = useState(false)

  // 화면에 들어오면 카드가 올라옴 (한 번만)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, { threshold: 0.15 })
    io.observe(list.current!)
    return () => io.disconnect()
  }, [])

  return (
    <section id="projects" className={`paper ${s.projects}`} aria-labelledby="projects-title">
      <header className={s.header}>
        <p className="eyebrow">01 — Selected Work</p>
        <h2 id="projects-title" className="display">Projects.</h2>
      </header>
      <ol ref={list} className={`${s.list} ${seen ? s.seen : ''}`}>
        {projects.map((p, i) => <Entry key={p.name} p={p} i={i} />)}
      </ol>
    </section>
  )
}

function Entry({ p, i }: { p: Project; i: number }) {
  // 기술 태그를 누르면 그 기술을 쓴 구현 줄만 형광펜. 한 번 더 누르면 해제
  const [pick, setPick] = useState<string | null>(null)
  const used = new Set(p.highlights.flatMap((h) => h.uses))
  const tags = p.stack.filter((t) => used.has(t))
  const rest = p.stack.filter((t) => !used.has(t))

  return (
    <li className={s.entry}>
      {/* 사원증 모양 카드: 이름·기간·역할·링크 */}
      <article className={s.badge}>
        <span className={s.slot} aria-hidden />
        <p className={s.no}>PROJECT No.{no(i)}</p>
        {p.thumbnail && <div className={s.thumb}><img src={p.thumbnail} alt="" /></div>}
        <h3 className={s.name}>{p.name}</h3>
        <p className={s.summary}>{p.summary}</p>
        <dl className={s.info}>
          <div><dt>PERIOD</dt><dd>{p.period}</dd></div>
          <div><dt>ROLE</dt><dd>{p.role}</dd></div>
        </dl>
        <div className={s.links}>
          {p.github && <a className={s.btn} href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
          {p.live && <a className={`${s.btn} ${s.primary}`} href={p.live} target="_blank" rel="noreferrer">Live ↗</a>}
        </div>
      </article>

      <div className={s.detail}>
        <div className={s.tagsHead}>
          <p className={s.label}>STACK</p>
          <p className={s.hint}>{pick ? `${pick}를 쓴 곳` : '눌러서 어디에 썼는지 보기'}</p>
        </div>
        <div className={s.tags} role="group" aria-label="기술 스택: 누르면 쓰인 곳 강조">
          {tags.map((t) => (
            <button key={t} className={s.tag} aria-pressed={pick === t} onClick={() => setPick(pick === t ? null : t)}>{t}</button>
          ))}
          {rest.map((t) => <span key={t} className={`${s.tag} ${s.plain}`}>{t}</span>)}
        </div>

        <ul className={`${s.highlights} ${pick ? s.picking : ''}`}>
          {p.highlights.map((h) => (
            <li key={h.text} className={pick && h.uses.includes(pick) ? s.on : undefined}><span>{h.text}</span></li>
          ))}
        </ul>

        {p.cases.map((c) => (
          <section key={c.title} className={s.case}>
            <h4 className={s.caseTitle}>{c.title}</h4>
            <dl className={s.caseBody}>
              <div><dt>PROBLEM</dt><dd>{c.problem}</dd></div>
              <div><dt>SOLUTION</dt><dd>{c.solution}</dd></div>
              <div><dt>RESULT</dt><dd className={s.result}>{c.result}</dd></div>
            </dl>
          </section>
        ))}
      </div>
    </li>
  )
}
