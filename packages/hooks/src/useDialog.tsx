/* eslint-disable @typescript-eslint/indent */
import type {
  ModalProps,
  ModalBodyProps,
  ButtonProps,
  ModalContentProps,
  AlertStatus,
} from '@chakra-ui/react'
import { atom } from 'jotai'
import { selectAtom, useAtomValue, useUpdateAtom } from 'jotai/utils'
import React, { useCallback } from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Button,
} from '@chakra-ui/react'
import { useCloseOnChangePathname } from './useCloseOnChangePathname'

export const noop: (...args: any) => any = () => {}

export type PromiseFunc = () => Promise<void> | void

export interface PromiseObj {
  fn: PromiseFunc
}

export interface ConfirmDialogOptions {
  type?: AlertStatus | 'text'
  title?: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  okText?: React.ReactNode
  cancelText?: React.ReactNode
  modalProps?: ModalProps
  modalContentProps?: ModalContentProps
  modalBodyProps?: ModalBodyProps
  showCloseButton?: boolean
  okButtonProps?: ButtonProps
  isCloseOnChangePathname?: boolean // default is true
  showClose?: boolean
}

export interface ConfirmDialogProps extends ConfirmDialogOptions {
  onConfirm?: PromiseFunc
  onCancel?: PromiseFunc
  onClose?: PromiseFunc
}

const optionsAtom = atom<ConfirmDialogOptions>({})
const openAtom = atom(false)
const loadingAtom = atom(false)
const onCloseObjAtom = atom<PromiseObj>({ fn: noop })
const onConfirmObjAtom = atom<PromiseObj>({ fn: noop })
const onCancelObjlAtom = atom<PromiseObj>({ fn: noop })
const fnSelector = (a: PromiseObj) => a.fn
const onCloseAtom = selectAtom(onCloseObjAtom, fnSelector)
const onConfirmAtom = selectAtom(onConfirmObjAtom, fnSelector)
const onCancelAtom = selectAtom(onCancelObjlAtom, fnSelector)
const cancelLoadingAtom = atom(false)

export const useConfirmDialogModel = () => {
  const isOpen = useAtomValue(openAtom)
  const options = useAtomValue(optionsAtom)
  const isLoading = useAtomValue(loadingAtom)
  const onClose = useAtomValue(onCloseAtom)
  const onConfirm = useAtomValue(onConfirmAtom)
  const onCancel = useAtomValue(onCancelAtom)
  const isCancelLoading = useAtomValue(cancelLoadingAtom)

  return {
    isOpen,
    isLoading,
    onClose,
    onConfirm,
    onCancel,
    options,
    isCancelLoading,
  }
}

export interface Warning {
  content: React.ReactNode
  onConfirm?: PromiseFunc
  onClose?: PromiseFunc
}

export const useDialog = () => {
  const setOptions = useUpdateAtom(optionsAtom)
  const setIsOpen = useUpdateAtom(openAtom)
  const setIsLoading = useUpdateAtom(loadingAtom)
  const setOnClose = useUpdateAtom(onCloseObjAtom)
  const setOnConfirm = useUpdateAtom(onConfirmObjAtom)
  const setOnCancel = useUpdateAtom(onCancelObjlAtom)
  const setCancelLoading = useUpdateAtom(cancelLoadingAtom)
  const confirm = useCallback(
    async ({
      onCancel,
      onClose,
      onConfirm,
      ...options
    }: ConfirmDialogProps) => {
      setOptions(options)
      setIsOpen(true)
      return new Promise<void>((resolve) => {
        setOnClose({
          fn: async () => {
            setIsOpen(false)
            await onClose?.()
            setIsLoading(false)
            resolve()
          },
        })
        setOnConfirm({
          fn: async () => {
            setIsLoading(true)
            await onConfirm?.()
            setIsLoading(false)
            setIsOpen(false)
            resolve()
          },
        })
        setOnCancel({
          fn: onCancel
            ? async () => {
                setCancelLoading(true)
                await onCancel?.()
                setCancelLoading(false)
                setIsOpen(false)
                resolve()
              }
            : noop,
        })
      })
    },
    [
      setOptions,
      setIsOpen,
      setIsLoading,
      setOnClose,
      setOnConfirm,
      setOnCancel,
      setCancelLoading,
    ]
  )

  return confirm
}

export const useCloseDialog = () => {
  const setIsOpen = useUpdateAtom(openAtom)
  const onClose = useCallback(() => setIsOpen(false), [setIsOpen])
  return onClose
}

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
