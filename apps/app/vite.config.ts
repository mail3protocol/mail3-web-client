/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { nodeResolve } from '@rollup/plugin-node-resolve'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
// import nodePolyfills from 'rollup-plugin-polyfill-node'
import { visualizer } from 'rollup-plugin-visualizer'
// import radar from 'vite-plugin-radar'
import inject from '@rollup/plugin-inject'
import ssr from 'vite-plugin-ssr/plugin'

// https://vitejs.dev/config/
export default defineConfig(() =>
  // const env = loadEnv(c.mode, process.cwd(), '')
  ({
    server: {
      https: false,
    },
    envPrefix: 'NEXT_',
    optimizeDeps: {
      // esbuildOptions: {
      //   // Enable esbuild polyfill plugins
      //   plugins: [
      //     NodeGlobalsPolyfillPlugin({
      //       buffer: true,
      //     }),
      //   ],
      // },
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
      pluginRewriteAll(),
      // radar({
      //   enableDev: true,
      //   analytics: {
      //     id: env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-WH0BKBPFWP',
      //   },
      // }),
      nodeResolve(),
      react(),
      ssr({
        prerender: false,
      }),
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
  })
)
