declare module '*.svg?url' {
  const path: string
  export default path
}
declare namespace JSX {
  type Mail3MeProps = React.HTMLAttributes<HTMLElement> & {
    css: string
    icon_style: string
    to: string
  }
  interface IntrinsicElements {
    'mail3-me': React.DetailedHTMLProps<Mail3MeProps, HTMLElement>
  }
}
