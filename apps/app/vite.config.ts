/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import nodePolyfills from 'rollup-plugin-polyfill-node'
import { visualizer } from 'rollup-plugin-visualizer'
import radar from 'vite-plugin-radar'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig((c) => {
  const env = loadEnv(c.mode, process.cwd(), '')
  return {
    server: {
      https: false,
    },
    define: {
      global: 'globalThis',
    },
    envPrefix: 'NEXT_',
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
        plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    plugins: [
      radar({
        enableDev: true,
        analytics: {
          id: env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-WH0BKBPFWP',
        },
      }),
      nodeResolve(),
      react(),
      svgrPlugin({
        svgrOptions: {
          // native: true,
          // icon: true,
          // ...svgr options (https://react-svgr.com/docs/options/)
        },
      }),
    ].concat([process.env.REPORT ? visualizer() : undefined]),
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
  }
})
