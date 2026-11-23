// 팔레트 목록·저장. 색 값 자체는 src/index.css의 [data-palette='…'] 블록
export const PALETTES = [
  { id: 'oxblood', label: 'Oxblood' },
  { id: 'acid', label: 'Acid' },
  { id: 'aubergine', label: 'Aubergine' },
] as const

const KEY = 'palette'

export function applyPalette(id: string) {
  document.documentElement.dataset.palette = id
  try { localStorage.setItem(KEY, id) } catch { /* 저장 안 되는 환경이면 이번 방문만 */ }
}

// 첫 로드: ?palette=… > 지난번 고른 값 > index.html 기본값
export function initPalette() {
  let saved: string | null = null
  try { saved = localStorage.getItem(KEY) } catch { /* 무시 */ }
  const id = new URLSearchParams(location.search).get('palette') ?? saved
  if (id) document.documentElement.dataset.palette = id
}
