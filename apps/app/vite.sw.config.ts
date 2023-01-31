import { defineConfig } from 'vite'

export default defineConfig(() => ({
  server: {
    https: false,
  },
  envPrefix: 'NEXT_',
  build: {
    emptyOutDir: false,
    outDir: 'public',
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
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}))
