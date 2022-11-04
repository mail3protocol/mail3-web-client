/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { DetailedHTMLProps, HTMLAttributes } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mail3-me': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          to?: string
          lite?: boolean
          variant?: 'solid' | 'outline' | 'ghost'
          icon_type?: 'black' | 'white' | 'light' | 'solid'
          icon_style?: string
          css?: string
        },
        HTMLElement
      >
    }
  }
}
