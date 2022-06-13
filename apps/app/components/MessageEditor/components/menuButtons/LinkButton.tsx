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
} from '@chakra-ui/react'
import { useActive, useCommands, useCurrentSelection } from '@remirror/react'
import { useState } from 'react'
import LinkSvg from 'assets/svg/editor/link.svg'
import { Button } from 'ui'
import { useTranslation } from 'next-i18next'
import { ButtonBase } from './Base'

export const LinkButton: React.FC = () => {
  const { updateLink, removeLink } = useCommands()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [linkValue, setLinkValue] = useState('')
  const active = useActive()
  const { empty } = useCurrentSelection()
  const { t } = useTranslation('edit-message')

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
