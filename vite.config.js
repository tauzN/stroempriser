import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [vue()],
    server: {
      host: process.env.VITE_LOCAL_HOST,
      https: {
        key: fs.readFileSync("../" + process.env.VITE_LOCAL_HOST + "-key.pem"),
        cert: fs.readFileSync("../" + process.env.VITE_LOCAL_HOST + ".pem")
      }
    }
  })
}