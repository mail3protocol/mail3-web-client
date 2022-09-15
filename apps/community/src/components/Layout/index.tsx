import { Outlet } from 'react-router-dom'
import React from 'react'
import { Header } from '../Header'
import { useLayoutStatus } from '../../hooks/useLayoutStatus'
import { Sidebar } from '../Sidebar'

export const Layout: React.FC = () => {
  const { isHiddenHeader, isHiddenSidebar } = useLayoutStatus()
  return (
    <>
      {isHiddenHeader ? null : <Header />}
      {isHiddenSidebar ? null : <Sidebar />}
      <Outlet />
    </>
  )
}
