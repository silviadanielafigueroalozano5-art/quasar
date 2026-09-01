import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { join } from 'node:path'
import sass from 'sass'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  css: {
    preprocessorOptions: {
      sass: {
        api: 'legacy',
        implementation: sass
      }
    }
  },

  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      sassVariables: join(import.meta.dirname, 'src/quasar-variables.sass')
    })
  ]
})