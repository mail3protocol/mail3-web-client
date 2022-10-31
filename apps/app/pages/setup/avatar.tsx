import React from 'react'
import { PageContainer } from 'ui'
import { SettingAvatar } from '../../components/Settings/SettingAvatar'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { useRedirectHome } from '../../hooks/useRedirectHome'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export const SetupAddressPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Setup Address')
  if (!isAuth) {
    return redirectHome()
  }

  return (
    <PageContainer>
      <SettingContainer>
        <SettingAvatar />
      </SettingContainer>
    </PageContainer>
  )
}
