import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ?palette=acid 처럼 붙이면 그 팔레트로 미리보기 (3D 끈 색이 렌더 전에 읽히도록 여기서)
const palette = new URLSearchParams(location.search).get('palette')
if (palette) document.documentElement.dataset.palette = palette

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
