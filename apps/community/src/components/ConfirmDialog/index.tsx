import React from 'react'
import { noop, useCloseOnChangePathname, useConfirmDialogModel } from 'hooks'
import {
  Button,
  Heading,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  HStack,
  Icon,
  ButtonProps,
} from '@chakra-ui/react'
import { ReactComponent as DialogCloseButtonSvg } from '../../assets/DialogCloseButton.svg'

export const CloseButton: React.FC<ButtonProps> = ({ ...props }) => (
  <Button
    w="24px"
    h="24px"
    variant="unstyled"
    position="absolute"
    top="24px"
    right="20px"
    minW="unset"
    {...props}
  >
    <Icon as={DialogCloseButtonSvg} width="24px" height="24px" rounded="full" />
  </Button>
)

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
      closeOnEsc={showCloseButton}
      closeOnOverlayClick={showCloseButton}
      autoFocus={false}
      {...modalProps}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="20px"
        w="450px"
        maxW="450px"
        {...modalContentProps}
      >
        {showCloseButton ? <CloseButton onClick={onClose} /> : null}
        <ModalBody py="24px" px="20px" {...modalBodyProps}>
          {content ?? (
            <>
              <Heading as="h3" fontSize="18px" mb="24px">
                {title}
              </Heading>
              <Text fontSize="16px" fontWeight="500">
                {description}
              </Text>
            </>
          )}
        </ModalBody>

        <ModalFooter pb="4px" pt="0">
          <HStack spacing={2} w="full" justify="flex-end">
            {okText && onConfirm !== noop ? (
              <Button
                variant="solid-rounded"
                colorScheme="primaryButton"
                mb="16px"
                isLoading={isLoading}
                onClick={onConfirm}
                fontWeight="500"
                px="32px"
                {...okButtonProps}
              >
                {okText}
              </Button>
            ) : null}

            {onCancel !== noop && cancelText ? (
              <Button
                variant="outline-rounded"
                colorScheme="blackAlpha"
                mb="16px"
                onClick={onCancel}
                borderRadius="40px"
                fontWeight="500"
                borderColor="black"
                px="32px"
                isLoading={isCancelLoading}
              >
                {cancelText}
              </Button>
            ) : null}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
