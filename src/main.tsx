import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initPalette } from './palette.ts'

initPalette() // 3D 끈 색이 렌더 전에 읽히도록 여기서

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
