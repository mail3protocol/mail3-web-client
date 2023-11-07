/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { visualizer } from 'rollup-plugin-visualizer'
import radar from 'vite-plugin-radar'
import inject from '@rollup/plugin-inject'
import vitePluginRequire from 'vite-plugin-require'

// https://vitejs.dev/config/
export default defineConfig((c) => {
  const env = loadEnv(c.mode, process.cwd(), '')
  return {
    server: {
      https: false,
    },
    envPrefix: 'NEXT_',
    optimizeDeps: {
      esbuildOptions: {
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
          id: env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
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
      vitePluginRequire(),
      ...(process.env.REPORT ? [visualizer()] : []),
    ],
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
  } as UserConfig
})
