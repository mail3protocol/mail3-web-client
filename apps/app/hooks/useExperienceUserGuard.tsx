import { useDisclosure } from '@chakra-ui/react'
import React, { useCallback, useMemo } from 'react'
import { useIsExperienceUser } from './useIsExperienceUser'
import {
  ExperienceUserGuideDialog,
  ExperienceUserGuideDialogProps,
} from '../components/ExperienceUserGuideDialog'

export function useExperienceUserGuard({
  action,
  guardDialogProps,
}: {
  action?: () => void
  guardDialogProps?: Partial<ExperienceUserGuideDialogProps>
} = {}) {
  const isExperienceUser = useIsExperienceUser()
  const {
    isOpen: isOpenExperienceUserGuideDialog,
    onOpen: onOpenExperienceUserGuideDialog,
    onClose: onCloseExperienceUserGuideDialog,
  } = useDisclosure()
  const guardDialogElement = useMemo(
    () => (
      <ExperienceUserGuideDialog
        isOpen={isOpenExperienceUserGuideDialog}
        onClose={onCloseExperienceUserGuideDialog}
        {...guardDialogProps}
      />
    ),
    [
      isOpenExperienceUserGuideDialog,
      onCloseExperienceUserGuideDialog,
      guardDialogProps,
    ]
  )
  const onAction = useCallback(() => {
    if (isExperienceUser) {
      onOpenExperienceUserGuideDialog()
      return false
    }
    action?.()
    return true
  }, [isExperienceUser, onOpenExperienceUserGuideDialog, action])

  return {
    guardDialogElement,
    onAction,
    isExperienceUser,
  }
}
