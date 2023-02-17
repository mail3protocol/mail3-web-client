import { useActive, useCommands, useCurrentSelection } from '@remirror/react'
import {
  Box,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
  Button,
  Heading,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isHttpUriReg } from 'shared'
import { LinkIcon } from 'ui'
import { MenuButton } from '../Menus'
import { CloseButton } from '../../ConfirmDialog'

export enum LinkErrorType {
  Invalid = 'invalid',
  Empty = 'empty',
  NotHttps = 'not_http',
}

const LinkVerifyRules = [
  {
    match: (value: string) => value !== '' && !isHttpUriReg.test(value),
    error: LinkErrorType.Invalid,
  },
  {
    match: (value: string) => value && !value.startsWith('https://'),
    error: LinkErrorType.NotHttps,
  },
  {
    match: (value: string) => !value,
    error: LinkErrorType.Empty,
  },
]

export const LinkButton: React.FC = () => {
  const { updateLink, removeLink } = useCommands()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [linkValue, setLinkValue] = useState('')
  const active = useActive()
  const { empty } = useCurrentSelection()
  const { t } = useTranslation('components')
  const linkError = useMemo(
    () => LinkVerifyRules.find((rule) => rule.match(linkValue))?.error,
    [linkValue]
  )
  const errorTextMap: { [key in LinkErrorType]?: string } = {
    [LinkErrorType.Invalid]: t('editor_menus.link_button.invalid_url'),
    [LinkErrorType.NotHttps]: t(
      'editor_menus.link_button.only_supported_https'
    ),
  }

  return (
    <>
      <MenuButton
        onClick={() => {
          if (empty) return
          if (active.link()) {
            removeLink()
          } else {
            onOpen()
          }
        }}
      >
        <LinkIcon />
      </MenuButton>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <CloseButton onClick={onClose} />
          <ModalBody>
            <Heading fontSize="18px">
              {t('editor_menus.link_button.add_link')}
            </Heading>
            <Input
              mt="24px"
              value={linkValue}
              placeholder={t(
                'editor_menus.link_button.add_link_input_placeholder'
              )}
              onChange={(e) => setLinkValue(e.target.value)}
            />
            <Box
              fontSize="14px"
              color="editorAddLinkDialogErrorColor"
              mt="6px"
              minH="21px"
            >
              {linkError ? errorTextMap[linkError] : null}
            </Box>
            <Stack direction="row" spacing="10px" w="full" justify="flex-end">
              <Button
                variant="solid-rounded"
                colorScheme="blackButton"
                onClick={() => {
                  updateLink({ href: linkValue, target: '_blank' })
                  setLinkValue('')
                  onClose()
                }}
                isDisabled={Boolean(linkError)}
                w="138px"
              >
                {t('editor_menus.link_button.ok')}
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
