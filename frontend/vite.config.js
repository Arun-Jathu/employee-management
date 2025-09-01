import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      include: /\.[jt]sx?$/, // ✅ allow JSX in .js and .jsx files
    }),
  ],
  esbuild: {
    loader: {
      '.js': 'jsx', // ✅ treat .js files as JSX
      '.jsx': 'jsx',
    },
    include: /src\/.*\.[jt]sx?$/, // ✅ apply to all .js/.jsx files in src
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
