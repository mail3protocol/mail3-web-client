declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react'

  export const ReactComponent: React.SFC<SVGProps<SVGElement>>
  const content: (props: SVGProps<SVGElement>) => ReactElement
  export default content
}

declare module '*.png' {
  const value: any
  export = value
}

declare module '*.gif' {
  const value: any
  export = value
}
