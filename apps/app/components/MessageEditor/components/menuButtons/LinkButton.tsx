import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Input,
  Stack,
  Box,
} from '@chakra-ui/react'
import { useActive, useCommands, useCurrentSelection } from '@remirror/react'
import { useMemo, useState } from 'react'
import { ReactComponent as LinkSvg } from 'assets/svg/editor/link.svg'
import { Button } from 'ui'
import { useTranslation } from 'react-i18next'
import { ButtonBase } from './Base'
import { isHttpUriReg } from '../../../../utils'

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
  const { t } = useTranslation('edit-message')
  const linkError = useMemo(
    () => LinkVerifyRules.find((rule) => rule.match(linkValue))?.error,
    [linkValue]
  )
  const errorTextMap: { [key in LinkErrorType]?: string } = {
    [LinkErrorType.Invalid]: t('invalid_url'),
    [LinkErrorType.NotHttps]: t('only_supported_https'),
  }

  return (
    <>
      <ButtonBase
        variant="unstyled"
        onClick={() => {
          if (empty) return
          if (active.link()) {
            removeLink()
          } else {
            onOpen()
          }
        }}
      >
        <LinkSvg />
      </ButtonBase>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent rounded="24px" maxW="305px">
          <ModalHeader fontSize="14px" textAlign="center" pt="40px">
            {t('add_link')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              colorScheme="blackAlpha"
              focusBorderColor="brand.500"
              value={linkValue}
              placeholder="Link URL"
              onChange={(e) => setLinkValue(e.target.value)}
            />
            <Box fontSize="14px" color="red.500" mt="6px" minH="21px">
              {linkError ? errorTextMap[linkError] : null}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Stack direction="row" spacing="10px" w="full">
              <Button onClick={onClose} variant="outline" w="50%">
                {t('cancel')}
              </Button>
              <Button
                w="50%"
                onClick={() => {
                  updateLink({ href: linkValue, target: '_blank' })
                  setLinkValue('')
                  onClose()
                }}
                isDisabled={Boolean(linkError)}
              >
                {t('ok')}
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
