import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageContainer } from 'ui'
import { RoutePath } from '../../route/path'
import { Navbar } from '../Navbar'

const hideNavbarPaths: Set<string> = new Set([
  RoutePath.Unread,
  RoutePath.Testing,
  RoutePath.Subscribe,
])

export const Layout: React.FC = () => {
  const location = useLocation()
  const [, pathname] = location.pathname.split('/')

  // useEffect(() => {
  //   gtag('event', 'page_view')
  // }, [location.pathname])
  return (
    <>
      {hideNavbarPaths.has(`/${pathname}`) ? null : (
        <PageContainer>
          <Navbar />
        </PageContainer>
      )}
      <Outlet />
    </>
  )
}
