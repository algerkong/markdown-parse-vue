import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      optimize: true,
      transformOn: true,
      enableObjectSlots: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MarkdownParseVue',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['vue', 'markdown-it', 'mermaid', 'echarts', 'html-to-image', 'panzoom'],
      output: {
        globals: {
          vue: 'Vue',
          'markdown-it': 'MarkdownIt',
          mermaid: 'mermaid',
          echarts: 'echarts',
          'html-to-image': 'htmlToImage',
          panzoom: 'panzoom'
        }
      }
    }
  }
})
