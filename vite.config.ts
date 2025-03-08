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
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MarkdownParseVue',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        const formatMap = {
          es: 'mjs',
          cjs: 'cjs',
          umd: 'umd.js'
        }
        return `${format === 'es' ? 'index' : `markdown-parse-vue.${format}`}.${formatMap[format]}`
      }
    },
    rollupOptions: {
      external: ['vue', 'markdown-it', 'mermaid', 'echarts', 'html-to-image', 'panzoom'],
      output: {
        dir: 'dist',
        globals: {
          vue: 'Vue',
          'markdown-it': 'MarkdownIt',
          mermaid: 'mermaid',
          echarts: 'echarts',
          'html-to-image': 'htmlToImage',
          panzoom: 'panzoom'
        },
        exports: 'named',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1);
          if (extType === 'css') {
            return 'style.css';
          }
          return `assets/[name][extname]`;
        }
      }
    },
    minify: false,
    sourcemap: true,
    cssCodeSplit: false
  }
})
