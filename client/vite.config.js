import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const Port = 3000;
const HashLength = 17;

export default defineConfig({
  server: {
    port: Port
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const randomCode = [...Array(HashLength)].map(() => (Math.random() < 0.5 ? String.fromCharCode(Math.floor(Math.random() * 26) + 97) : String(Math.floor(Math.random() * 10)))).join('');
          const parts = assetInfo.name.split('.');
          if(parts.length > 1) {
            if (assetInfo.name.endsWith('.css')) {
              return `_extend/css/${randomCode}.css`;
            }
            return `_extend/static/${randomCode}.${parts.pop()}`;
          }
        },
        chunkFileNames: '_extend/chunks/[name].[hash].js',
        entryFileNames: '_extend/chunks/renderer.js',
      }
    },
  },
  plugins: [svelte()],
})
