import { DetailedHTMLProps, HTMLAttributes } from 'react'

declare module '*.svg?url' {
  const path: string
  export default path
}

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
