declare module '*.svg?url' {
  const path: string
  export default path
}

declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react'

  export const ReactComponent: React.SFC<SVGProps<SVGElement>>
  const content: (props: SVGProps<SVGElement>) => ReactElement
  export default content
}

declare module '*.png' {
  const path: any
  export default path
}

declare module '*.gif' {
  const path: any
  export default path
}
