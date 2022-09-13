import React, { useCallback } from 'react'
import { useDialog } from 'hooks'
import { useIsExperienceUser } from './useIsExperienceUser'
import {
  ExperienceUserGuideContent,
  ExperienceUserGuideDialogProps,
  ExperienceUserGuideFooter,
} from '../components/ExperienceUserGuideDialog'

export function useExperienceUserGuard({
  action,
}: {
  action?: () => void
  guardDialogProps?: Partial<ExperienceUserGuideDialogProps>
} = {}) {
  const isExperienceUser = useIsExperienceUser()
  const dialog = useDialog()

  const onAction = useCallback(() => {
    if (isExperienceUser) {
      dialog({
        content: <ExperienceUserGuideContent />,
        modalContentProps: {
          maxW: '340px',
          rounded: '24px',
          pb: '8px',
          w: 'calc(100% - 40px)',
        },
        modalBodyProps: {
          p: 0,
          m: 0,
        },
        modalCloseButtonProps: {
          top: '20px',
          right: '20px',
        },
        footer: <ExperienceUserGuideFooter />,
        modalFooterProps: {
          p: 0,
          display: 'flex',
          justifyContent: 'center',
        },
      })
      return false
    }
    action?.()
    return true
  }, [isExperienceUser, action])

  return {
    onAction,
    isExperienceUser,
  }
}
