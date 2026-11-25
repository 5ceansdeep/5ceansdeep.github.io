import { useEffect, useState } from 'react'
import { profile } from '../data/profile.ts'
import s from './Github.module.css'

// 기여 데이터: GitHub 공식 API엔 없어서 공개 기여 그래프를 JSON으로 주는 오픈소스 API 사용 (토큰 불필요, CORS 허용)
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${profile.github}?y=last`
const USER_API = `https://api.github.com/users/${profile.github}`
const REPOS_API = `https://api.github.com/users/${profile.github}/repos?sort=pushed&per_page=20`
const PROFILE_URL = `https://github.com/${profile.github}`
const SHOW_REPOS = ['cabinet', 'DRIFT', 'saymary_frontend'] // 보여줄 레포를 직접 고름 (순서대로)

type Day = { date: string; count: number; level: number }
type Repo = { name: string; description: string | null; language: string | null; html_url: string; pushed_at: string; fork: boolean }
type User = { avatar_url: string; public_repos: number; followers: number; created_at: string }
type Data = { total: number; days: Day[]; user?: User; repos: Repo[] }

const getJson = async (url: string, signal: AbortSignal) => {
  const r = await fetch(url, { signal })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

export default function Github() {
  const [data, setData] = useState<Data | 'loading' | 'error'>('loading')

  useEffect(() => {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), 8000) // 느리면 대체 화면으로
    // 그래프가 핵심이라 그래프 실패 = 대체 화면. 프로필·레포는 실패해도 그래프는 보여줌
    Promise.allSettled([getJson(CONTRIB_API, ac.signal), getJson(USER_API, ac.signal), getJson(REPOS_API, ac.signal)])
      .then(([contrib, user, repos]) => {
        if (contrib.status === 'rejected') return setData('error')
        setData({
          total: contrib.value.total.lastYear,
          days: contrib.value.contributions,
          user: user.status === 'fulfilled' ? user.value : undefined,
          repos: repos.status === 'fulfilled'
            ? SHOW_REPOS.flatMap((n) => (repos.value as Repo[]).filter((r) => r.name === n))
            : [],
        })
      })
      .finally(() => clearTimeout(timer))
    return () => { clearTimeout(timer); ac.abort() }
  }, [])

  return (
    <section id="github" className={`paper ${s.github}`} aria-labelledby="github-title">
      <div className={s.inner}>
        <p className="eyebrow">03 — Activity</p>
        <div className={s.head}>
          <h2 id="github-title" className="display">GitHub.</h2>
          <div className={s.actions}>
            <a className={s.btn} href={PROFILE_URL} target="_blank" rel="noreferrer">GitHub 프로필 ↗</a>
            {profile.links.filter((l) => l.label !== 'GitHub').map((l) => (
              <a key={l.label} className={`${s.btn} ${s.ghost}`} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
            ))}
          </div>
        </div>

        {data === 'loading' && <div className={s.placeholder} aria-busy="true">GitHub 활동을 불러오는 중…</div>}

        {data === 'error' && (
          <div className={s.placeholder} role="status">
            <p className={s.fallbackTitle}>GitHub 활동을 지금 불러오지 못했어요.</p>
            <p>잠시 뒤 새로고침하거나, 프로필에서 바로 확인해 주세요.</p>
            <a className={s.btn} href={PROFILE_URL} target="_blank" rel="noreferrer">@{profile.github} 보러 가기 ↗</a>
          </div>
        )}

        {typeof data === 'object' && (
          <>
            <div className={s.stats}>
              <Stat n={data.total} label="contributions · 최근 1년" big />
              {data.user && <Stat n={data.user.public_repos} label="public repos" />}
              {data.user && <Stat n={new Date(data.user.created_at).getFullYear()} label="joined" />}
            </div>
            <Graph days={data.days} />
            {data.repos.length > 0 && (
              <ul className={s.repos}>
                {data.repos.map((r) => (
                  <li key={r.name}>
                    <a className={s.repo} href={r.html_url} target="_blank" rel="noreferrer">
                      <span className={s.repoName}>{r.name} ↗</span>
                      {r.description && <span className={s.repoDesc}>{r.description}</span>}
                      <span className={s.repoMeta}>{r.language ?? '—'} · {r.pushed_at.slice(0, 10)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function Stat({ n, label, big }: { n: number; label: string; big?: boolean }) {
  return (
    <p className={`${s.stat} ${big ? s.big : ''}`}>
      <span className={s.n}>{n}</span>
      <span className={s.statLabel}>{label}</span>
    </p>
  )
}

// 잔디 그래프: 열 = 주, 행 = 요일(일~토). 색 단계는 --accent 농도
function Graph({ days }: { days: Day[] }) {
  const lead = new Date(days[0].date).getDay() // 첫 주 앞 빈칸
  const months = days.flatMap((d, i) => {
    const date = new Date(d.date)
    return date.getDate() === 1 ? [{ col: Math.floor((i + lead) / 7), label: `${date.getMonth() + 1}월` }] : []
  })
  return (
    <figure className={s.graph}>
      <div className={s.scroll} ref={(el) => { if (el) el.scrollLeft = el.scrollWidth }}>
        <div className={s.months} aria-hidden>
          {months.map((m) => <span key={m.col} style={{ gridColumn: m.col + 1 }}>{m.label}</span>)}
        </div>
        <div className={s.cells} role="img" aria-label={`최근 1년 GitHub 기여 ${days.reduce((a, d) => a + d.count, 0)}회`}>
          {Array.from({ length: lead }, (_, i) => <span key={`pad${i}`} />)}
          {days.map((d) => (
            <span key={d.date} className={s.cell} data-level={d.level} title={`${d.date} · ${d.count}`} />
          ))}
        </div>
      </div>
      <figcaption className={s.legend}>
        적음 {[0, 1, 2, 3, 4].map((l) => <span key={l} className={s.cell} data-level={l} />)} 많음
      </figcaption>
    </figure>
  )
}
