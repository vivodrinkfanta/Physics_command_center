import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'github-pages' ? '/Physics_command_center/' : '/',
  plugins: [react()],
}))
