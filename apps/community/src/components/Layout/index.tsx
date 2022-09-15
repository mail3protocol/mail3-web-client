import { Outlet } from 'react-router-dom'
import React from 'react'
import { Header } from '../Header'
import { useLayoutStatus } from '../../hooks/useLayoutStatus'

export const Layout: React.FC = () => {
  const { isHiddenHeader } = useLayoutStatus()
  return (
    <>
      {isHiddenHeader ? null : <Header />}
      <Outlet />
    </>
  )
}
