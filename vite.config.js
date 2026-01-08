import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import fs from 'fs'

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const version = packageJson.version

// Get git commit hash
let gitHash = 'dev'
try {
  gitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch {
  console.warn('Could not get git hash')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ssh_client/',
  define: {
    __APP_VERSION__: JSON.stringify(`${version}+${gitHash}`)
  }
})
