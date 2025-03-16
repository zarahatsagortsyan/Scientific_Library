import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // ✅ Increases warning limit from 500 KB to 1000 KB
    outDir: "dist", // ✅ This must be "dist" (default for Vite)

  },
});