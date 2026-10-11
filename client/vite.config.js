import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite exposes only VITE_* browser configuration via import.meta.env.
// Never serialize the build machine's process.env into the browser bundle.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist' },
});
