import React, { useCallback } from 'react'
import { useDialog } from 'hooks'
import { useAtomValue } from 'jotai'
import {
  ExperienceUserGuideContent,
  ExperienceUserGuideFooter,
} from '../components/ExperienceUserGuideDialog'
import { UserRole } from '../api'
import { userPropertiesAtom } from './useLogin'

export function useExperienceUserGuard({
  action,
  guardDialogProps,
}: {
  action?: () => void
  guardDialogProps?: {
    pageGuard?: boolean
    onCloseComplete?: () => void
  }
} = {}) {
  const userProperties = useAtomValue(userPropertiesAtom)
  const isExperienceUser = userProperties?.user_role === UserRole.Experience
  const dialog = useDialog()

  const onAction = useCallback(() => {
    if (isExperienceUser) {
      dialog({
        content: <ExperienceUserGuideContent />,
        modalProps: {
          closeOnEsc: !guardDialogProps?.pageGuard,
          onCloseComplete: guardDialogProps?.onCloseComplete,
        },
        modalContentProps: {
          maxW: '520px',
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
