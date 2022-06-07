declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react'

  export const ReactComponent: React.SFC<SVGProps<SVGElement>>
  const content: (props: SVGProps<SVGElement>) => ReactElement
  export default content
}
