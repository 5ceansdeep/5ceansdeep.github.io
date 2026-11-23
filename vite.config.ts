import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 5ceansdeep.github.io = 유저 페이지라 base는 '/'
export default defineConfig({ plugins: [react()] })
