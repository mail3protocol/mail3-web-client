/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    https: false,
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [
    nodeResolve(),
    react(),
    svgrPlugin({
      svgrOptions: {
        // native: true,
        // icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    VitePluginHtmlEnv({
      compiler: true,
    }),
  ].concat([process.env.REPORT ? visualizer() : undefined]),
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}))
