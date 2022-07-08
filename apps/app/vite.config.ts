/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import VitePluginHtmlEnv from 'vite-plugin-html-env'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    https: false,
  },
  plugins: [
    nodeResolve(),
    react(),
    svgrPlugin({
      svgrOptions: {
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    VitePluginHtmlEnv({
      compiler: true,
    }),
  ],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}))
