import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vite.dev/config/
export default defineConfig({
  server: {},
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    tsconfigPaths(),
    vueDevTools(),
    quasar({
      autoImportComponentCase: 'pascal',
      sassVariables: fileURLToPath(new URL('./src/quasar-variables.scss', import.meta.url)),
    }),

    Components({
      dirs: './src',
      dts: true,
      resolvers: [IconsResolver()],
    }),
    Icons({}),
  ],
})
