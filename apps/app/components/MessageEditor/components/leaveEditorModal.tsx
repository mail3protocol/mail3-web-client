import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import { Button } from 'ui'
import React from 'react'
import { useTranslation } from 'next-i18next'

export const LeaveEditorModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onClickSaveButton: () => void
  isSaving?: boolean
}> = ({ isOpen, onClose, onClickSaveButton, isSaving }) => {
  const { t } = useTranslation('edit-message')
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="24px" maxW="305px">
        <ModalHeader fontSize="14px" textAlign="center" pt="40px">
          {t('leave_modal_title')}
        </ModalHeader>
        <ModalCloseButton />

        <ModalFooter>
          <Stack direction="row" spacing="10px" w="full">
            <Button onClick={onClose} variant="outline" w="50%" fontSize="14px">
              {t('cancel')}
            </Button>
            <Button
              w="50%"
              onClick={onClickSaveButton}
              fontSize="14px"
              isLoading={isSaving}
            >
              {t('save_and_quit')}
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
