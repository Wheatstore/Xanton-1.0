// client/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      // Convert Vite's environment variables to `process.env` format
      'process.env': {
        ...process.env,
        ...Object.keys(env).reduce((acc, key) => {
          acc[key] = JSON.stringify(env[key]);
          return acc;
        }, {})
      }
    },
    plugins: [react()],
    build: {
      outDir: 'public', // specify the output directory here
    }
  };
});
