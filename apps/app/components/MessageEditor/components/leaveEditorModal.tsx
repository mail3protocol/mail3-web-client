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
import { useTranslation } from 'react-i18next'

export const LeaveEditorModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onClickSaveButton: () => void
  onClickDoNotSaveButton: () => void
  doNotSaveButtonLoading?: boolean
  saveButtonLoading?: boolean
}> = ({
  isOpen,
  onClose,
  onClickDoNotSaveButton,
  onClickSaveButton,
  doNotSaveButtonLoading,
  saveButtonLoading,
}) => {
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
          <Stack direction="column" spacing="10px" w="full">
            <Button
              onClick={onClickDoNotSaveButton}
              variant="outline"
              w="full"
              fontSize="14px"
              isLoading={doNotSaveButtonLoading}
            >
              {t("don't_save_and_exit")}
            </Button>
            <Button
              w="full"
              onClick={onClickSaveButton}
              fontSize="14px"
              isLoading={saveButtonLoading}
            >
              {t('save_and_quit')}
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
