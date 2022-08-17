import { defineConfig } from 'vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'

export default defineConfig(() => ({
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
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'firebase-messaging-sw': 'service-worker/firebase-messaging-sw.ts',
      },
      output: {
        entryFileNames: ({ name }) =>
          ({
            'firebase-messaging-sw': 'firebase-messaging-sw.js',
          }[name] || '[name]-[hash].js'),
      },
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [nodeResolve(), react()],
}))
