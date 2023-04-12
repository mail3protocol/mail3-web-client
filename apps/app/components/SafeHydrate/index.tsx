import { PropsWithChildren } from 'react'

export const SafeHydrate: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div suppressHydrationWarning>
    {typeof window === 'undefined' ? null : children}
  </div>
)
