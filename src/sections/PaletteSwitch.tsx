import { useState } from 'react'
import { PALETTES, applyPalette } from '../palette.ts'
import s from './PaletteSwitch.module.css'

// 화면 오른쪽 아래 고정. 각 버튼은 자기 팔레트 색으로 칠해짐 (data-palette로 CSS 변수 범위 지정)
export default function PaletteSwitch() {
  const [current, setCurrent] = useState(document.documentElement.dataset.palette)
  return (
    <div className={s.switch} role="group" aria-label="사이트 색 바꾸기">
      <span className={s.label}>Color</span>
      {PALETTES.map((p) => (
        <button
          key={p.id}
          data-palette={p.id}
          className={s.swatch}
          aria-pressed={current === p.id}
          aria-label={p.label}
          title={p.label}
          onClick={() => { applyPalette(p.id); setCurrent(p.id) }}
        />
      ))}
    </div>
  )
}
