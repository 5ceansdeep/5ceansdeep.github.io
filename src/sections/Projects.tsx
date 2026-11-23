import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { projects, type Project } from '../data/projects.ts'
import s from './Projects.module.css'

const ALL = 'ALL'
// 필터: 주력 스택(PINNED)은 항상 + 2개 이상 프로젝트에서 쓴 스택은 많이 쓴 순
const PINNED = ['React Three Fiber', 'Next.js']
const counts = new Map<string, number>()
projects.forEach((p) => p.stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
const shared = [...counts].filter(([t, n]) => n > 1 && !PINNED.includes(t)).sort((a, b) => b[1] - a[1]).map(([t]) => t)
const stacks = [ALL, ...shared.slice(0, 2), ...PINNED, ...shared.slice(2)]
const CARD_STACKS = 4 // 카드에 보이는 스택 수, 나머지는 +N
const no = (i: number) => String(i + 1).padStart(2, '0')

export default function Projects() {
  const [filter, setFilter] = useState(ALL)
  const [open, setOpen] = useState<Project | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const [seen, setSeen] = useState(false)

  // 화면에 들어오면 카드가 차례로 올라옴 (한 번만)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, { threshold: 0.2 })
    io.observe(list.current!)
    return () => io.disconnect()
  }, [])
  const shown = projects.filter((p) => filter === ALL || p.stack.includes(filter))

  const showDetail = (p: Project) => {
    setOpen(p)
    dialog.current?.showModal()
  }

  return (
    <section id="projects" className={s.projects} aria-labelledby="projects-title">
      <header className={s.header}>
        <h2 id="projects-title" className={s.title}>Projects</h2>
        <div className={s.filters} role="group" aria-label="기술 스택 필터">
          {stacks.map((t) => (
            <button key={t} className={s.tag} aria-pressed={filter === t} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>
      </header>

      <ol ref={list} className={`${s.cards} ${seen ? s.seen : ''}`} style={{ '--steps': shown.length - 1 } as CSSProperties}>
        {shown.map((p, order) => {
          const i = projects.indexOf(p)
          return (
            <li key={p.name} className={s.card} style={{ '--i': order } as CSSProperties}>
              <span className={s.slot} aria-hidden />
              <div className={s.head}>
                <p className={s.no}>PROJECT No.{no(i)}</p>
                <div className={s.thumb}>
                  {p.thumbnail ? <img src={p.thumbnail} alt="" /> : 'thumbnail'}
                </div>
              </div>
              <h3 className={s.name}>{p.name}</h3>
              <p className={s.summary}>{p.summary}</p>
              <dl className={s.info}>
                <div><dt>PERIOD</dt><dd>{p.period}</dd></div>
                <div><dt>ROLE</dt><dd>{p.role}</dd></div>
                <div>
                  <dt>STACK</dt>
                  <dd className={s.stack}>
                    {p.stack.slice(0, CARD_STACKS).map((t) => <span key={t} className={s.chip}>{t}</span>)}
                    {p.stack.length > CARD_STACKS && <span className={`${s.chip} ${s.chipMore}`} title={p.stack.slice(CARD_STACKS).join(", ")}>+{p.stack.length - CARD_STACKS}</span>}
                  </dd>
                </div>
              </dl>
              <div className={s.footer}>
                <Links p={p} />
                <button className={s.more} aria-label={`${p.name} 상세 보기`} onClick={() => showDetail(p)}>→</button>
              </div>
            </li>
          )
        })}
      </ol>

      <dialog ref={dialog} className={s.dialog} onClose={() => setOpen(null)} closedby="any">
        {open && (
          <>
            <p className={s.no}>PROJECT No.{no(projects.indexOf(open))}</p>
            <h3 className={s.name}>{open.name}</h3>
            <p className={s.summary}>{open.summary}</p>
            <p className={s.meta}>{open.period} · {open.role}</p>
            <div className={s.stack}>{open.stack.map((t) => <span key={t} className={s.chip}>{t}</span>)}</div>
            {open.highlights.length > 0 && <ul className={s.details}>{open.highlights.map((d) => <li key={d}>{d}</li>)}</ul>}
            {open.cases.map((c) => (
              <section key={c.title} className={s.case}>
                <h4 className={s.caseTitle}>{c.title}</h4>
                <dl className={s.info}>
                  <div><dt>PROBLEM</dt><dd>{c.problem}</dd></div>
                  <div><dt>SOLUTION</dt><dd>{c.solution}</dd></div>
                  <div><dt>RESULT</dt><dd className={s.result}>{c.result}</dd></div>
                </dl>
              </section>
            ))}
            <div className={s.footer}>
              <Links p={open} />
              <form method="dialog"><button className={s.more}>닫기</button></form>
            </div>
          </>
        )}
      </dialog>
    </section>
  )
}

function Links({ p }: { p: Project }) {
  return (
    <div className={s.links}>
      {p.github
        ? <a className={s.btn} href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        : <span className={`${s.btn} ${s.off}`} aria-disabled="true">GitHub</span>}
      {p.live
        ? <a className={`${s.btn} ${s.primary}`} href={p.live} target="_blank" rel="noreferrer">Live ↗</a>
        : <span className={`${s.btn} ${s.off}`} aria-disabled="true">Live</span>}
    </div>
  )
}
