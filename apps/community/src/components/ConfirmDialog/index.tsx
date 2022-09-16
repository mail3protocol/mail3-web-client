import React from 'react'
import { noop, useCloseOnChangePathname, useConfirmDialogModel } from 'hooks'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'

export const ConfirmDialog: React.FC = () => {
  const {
    options,
    isOpen,
    isLoading,
    onClose,
    onConfirm,
    onCancel,
    isCancelLoading,
  } = useConfirmDialogModel()
  const {
    type = 'success',
    title,
    description,
    content,
    cancelText,
    okText,
    modalBodyProps,
    modalContentProps,
    modalProps,
    showCloseButton = options?.showClose || type !== 'text',
    okButtonProps,
    isCloseOnChangePathname,
  } = options

  useCloseOnChangePathname(onClose, isCloseOnChangePathname)

  return (
    <Modal
      size="xs"
      closeOnEsc={showCloseButton}
      closeOnOverlayClick={showCloseButton}
      autoFocus={false}
      {...modalProps}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius="24px" {...modalContentProps}>
        {showCloseButton ? <ModalCloseButton /> : null}
        <ModalBody mt="35px" {...modalBodyProps}>
          {content ?? (
            <Alert
              status={type === 'text' ? undefined : type}
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              bg="white"
            >
              {type !== 'text' ? (
                <AlertIcon boxSize="20px" mr={0} mb="10px" color="black" />
              ) : null}
              <AlertTitle mb="16px" mx={0} fontSize="18px" fontWeight="600">
                {title}
              </AlertTitle>
              <AlertDescription
                maxWidth="sm"
                fontSize="14px"
                color="black"
                whiteSpace="pre-wrap"
              >
                {description}
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Stack
            spacing={2}
            w="full"
            direction={type === 'text' ? 'row-reverse' : 'column'}
          >
            {okText && onConfirm !== noop ? (
              <Button
                isFullWidth
                variant="primary"
                bg="brand.500"
                mb="16px"
                color="white"
                borderRadius="40px"
                _hover={{
                  bg: 'brand.50',
                }}
                isLoading={isLoading}
                onClick={onConfirm}
                fontWeight="normal"
                {...okButtonProps}
              >
                {okText}
              </Button>
            ) : null}

            {onCancel !== noop && cancelText ? (
              <Button
                variant="outline"
                isFullWidth
                color="black"
                mb="16px"
                onClick={onCancel}
                borderRadius="40px"
                fontWeight="normal"
                borderColor="black"
                isLoading={isCancelLoading}
              >
                {cancelText}
              </Button>
            ) : null}
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
