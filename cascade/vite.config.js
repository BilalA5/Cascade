import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
  ],
  define: {
    'process.env.VITE_AWS_REGION': JSON.stringify(process.env.VITE_AWS_REGION ?? ''),
    'process.env.VITE_AWS_ACCESS_KEY_ID': JSON.stringify(process.env.VITE_AWS_ACCESS_KEY_ID ?? ''),
    'process.env.VITE_AWS_SECRET_ACCESS_KEY': JSON.stringify(process.env.VITE_AWS_SECRET_ACCESS_KEY ?? ''),
  },
  server: {
    port: 3003,
  },
})
