import { Outlet } from 'react-router-dom'
import React from 'react'
import { Header } from '../Header'
import { useLayoutStatus } from '../../hooks/useLayoutStatus'
import { Sidebar } from '../Sidebar'
import { ConfirmDialog } from '../ConfirmDialog'
import { AuthDialog } from '../Auth'
import { ConnectedWalletButton } from '../ConnectedWalletButton'
import { ConnectWalletDialog } from '../ConnectWalletDialog'
import { useAuth } from '../../hooks/useLogin'

export const Layout: React.FC = () => {
  const { isHiddenHeader, isHiddenSidebar } = useLayoutStatus()
  useAuth()

  return (
    <>
      {isHiddenHeader ? null : (
        <Header>
          <ConnectedWalletButton ml="auto" my="auto" />
        </Header>
      )}
      {isHiddenSidebar ? null : <Sidebar />}
      <Outlet />
      <ConfirmDialog />
      <AuthDialog />
      <ConnectWalletDialog />
    </>
  )
}
