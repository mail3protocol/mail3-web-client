import React, { useEffect, useMemo, useState } from 'react'
import {
  BoldExtension,
  ItalicExtension,
  UnderlineExtension,
  BulletListExtension,
  OrderedListExtension,
  LinkExtension,
  StrikeExtension,
  BlockquoteExtension,
  HardBreakExtension,
  HorizontalRuleExtension,
  CalloutExtension,
  HeadingExtension,
  ParagraphExtension,
  TableExtension,
  IframeExtension,
} from 'remirror/extensions'
import {
  Remirror,
  useHelpers,
  useRemirror,
  useRemirrorContext,
} from '@remirror/react'
import { IpfsModal } from 'ui'
import { useNavigate } from 'react-router-dom'
import { Stack, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { TrackEvent, useToast, useTrackClick } from 'hooks'
import { useQuery } from 'react-query'
import { Menu } from '../menus'
import { Attach } from '../attach'
import { SelectCardSignature } from '../selectCardSignature'
import { useSubmitMessage } from '../../hooks/useSubmitMessage'
import { useSaveMessage } from '../../hooks/useSaveMessage'
import { Query } from '../../../../api/query'
import { useAPI } from '../../../../hooks/useAPI'
import { useSubject } from '../../hooks/useSubject'
import { LeaveEditorModal } from '../leaveEditorModal'
import { useBlocker } from '../../../../hooks/useBlocker'
import { AttachmentImageExtensionExtension } from './extensions/AttachmentImageExtension'
import { useExperienceUserGuard } from '../../../../hooks/useExperienceUserGuard'
import { useBack } from '../../../../hooks/useBack'
import { RoutePath } from '../../../../route/path'

const RemirrorTheme = styled(Flex)`
  ul,
  ol {
    padding-inline-start: revert;
    list-style-position: revert;
  }
  p {
    margin-top: revert;
    margin-bottom: revert;
  }
  a {
    text-decoration: revert;
    color: #4d51f3;
  }
  img {
    display: revert;
  }
  .ProseMirror {
    box-shadow: none;
    height: 100%;
    flex: 1;
  }
  .ProseMirror.ProseMirror-focused {
    outline: none;
  }
  .ProseMirror ::selection {
    background: rgba(0, 0, 0, 0.3);
  }
`

const TextEditor = () => {
  const { getRootProps } = useRemirrorContext({ autoUpdate: true })
  const CONTAINER_ID = 'EDIT_MESSAGE_TEXT_CONTAINER_ID'
  useEffect(() => {
    const el = document.querySelector(`#${CONTAINER_ID} div`)
    if (!el) return () => {}
    const fn = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }
    el.addEventListener('drop', fn)
    return () => {
      el.removeEventListener('drop', fn)
    }
  }, [])
  return (
    <Flex
      id={CONTAINER_ID}
      direction="column"
      pt="0"
      pb={{ base: '20px', md: 0 }}
      fontSize="14px"
      flex={0}
      px={{ base: '20px', md: 0 }}
      {...getRootProps()}
    />
  )
}

const Footer = () => {
  const api = useAPI()
  const { isDisabledSendButton, isLoading, isSubmitted, onSubmit } =
    useSubmitMessage()
  const { subject, toAddresses, ccAddresses, bccAddresses } = useSubject()
  const { getHTML } = useHelpers()
  const { onSave, isSaving } = useSaveMessage()
  const { t } = useTranslation('edit-message')
  const trackClickSave = useTrackClick(TrackEvent.AppEditMessageClickSave)
  const trackClickSend = useTrackClick(TrackEvent.AppEditMessageClickSend)
  const toast = useToast()
  const initialHtml = useMemo(() => getHTML(), []) // initial content
  const {
    isOpen: isOpenLeaveEditorModal,
    onOpen: onOpenLeaveEditorModal,
    onClose: onCloseLeaveEditorModal,
  } = useDisclosure()
  const navi = useNavigate()
  const [leavingUrl, setLeavingUrl] = useState('')
  const [isAllowLeave, setIsAllowLeave] = useState(false)
  const [isLeavingWithSave, setIsLeavingWithSave] = useState(false)
  const [isLeavingWithoutSave, setIsLeavingWithoutSave] = useState(false)
  const isChangeContent = () =>
    !(
      !subject &&
      toAddresses.length <= 0 &&
      ccAddresses.length <= 0 &&
      bccAddresses.length <= 0 &&
      initialHtml === getHTML()
    )
  const onBack = useBack()
  const { onAction, isExperienceUser } = useExperienceUserGuard({
    guardDialogProps: {
      pageGuard: true,
      onCloseComplete: () => {
        if (window.location.pathname === RoutePath.NewMessage) {
          onBack()
        }
      },
    },
  })
  useEffect(() => {
    if (isExperienceUser) {
      onAction()
    }
  }, [isExperienceUser])
  const blockerWhen =
    isChangeContent() &&
    !isSubmitted &&
    !isAllowLeave &&
    !isSaving &&
    !isLeavingWithSave &&
    !isLeavingWithoutSave &&
    !isExperienceUser
  useBlocker((tx) => {
    setLeavingUrl(tx.location.pathname)
    onOpenLeaveEditorModal()
  }, blockerWhen)
  useEffect(() => {
    if (!blockerWhen) return () => {}
    const handleBeforeunload = (e: Event) => {
      e.preventDefault()
      // @ts-ignore
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeunload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload)
    }
  }, [blockerWhen])

  const {
    isOpen: isOpenIpfsModal,
    onOpen: onOpenIpfsModal,
    onClose: onCloseIpfsModal,
  } = useDisclosure()
  const {
    data: isUploadedIpfsKey,
    isLoading: isLoadingIsUploadedIpfsKeyState,
  } = useQuery([Query.GetMessageEncryptionKeyState], () =>
    api.getMessageEncryptionKeyState().then((res) => res.data.state === 'set')
  )

  return (
    <>
      {!isLoadingIsUploadedIpfsKeyState ? (
        <IpfsModal
          isOpen={isOpenIpfsModal}
          onClose={onCloseIpfsModal}
          isForceConnectWallet={!isUploadedIpfsKey}
          onAfterSignature={async (_, key) => {
            await api.updateMessageEncryptionKey(key)
            onCloseIpfsModal()
            await onSubmit()
          }}
        />
      ) : null}
      <LeaveEditorModal
        isOpen={isOpenLeaveEditorModal}
        onClose={onCloseLeaveEditorModal}
        onClickDoNotSaveButton={async () => {
          await setIsLeavingWithoutSave(true)
          await new Promise((r) => {
            setTimeout(r, 200)
          })
          navi(leavingUrl, { replace: true })
          await setIsLeavingWithoutSave(false)
        }}
        doNotSaveButtonLoading={isLeavingWithoutSave}
        saveButtonLoading={isLeavingWithSave}
        onClickSaveButton={async () => {
          await setIsLeavingWithSave(true)
          try {
            await setIsAllowLeave(true)
            await onSave(getHTML())
            navi(leavingUrl, { replace: true })
            onCloseLeaveEditorModal()
          } catch (err) {
            toast(t('draft.failed'))
            console.error(err)
          } finally {
            await setIsLeavingWithSave(false)
          }
        }}
      />
      <Stack
        direction="row"
        spacing="16px"
        justify="center"
        px="20px"
        position="sticky"
        pt="20px"
        pb={{
          base: '20px',
          md: '40px',
        }}
        bottom="0"
        left="0"
        w="full"
        mt="auto"
        alignItems="center"
        bg="#fff"
      >
        <Attach />
        <Button
          w="138px"
          lineHeight="40px"
          rounded="100px"
          variant="outline"
          colorScheme="BlackAlpha"
          fontSize="14px"
          isLoading={isSaving}
          onClick={() => {
            trackClickSave()
            onSave(getHTML())
              .then(() => {
                toast(t('draft.saved'))
              })
              .catch((err) => {
                toast(t('draft.failed'))
                console.error(err)
              })
          }}
        >
          {t('save')}
        </Button>
        <Button
          w="138px"
          lineHeight="40px"
          rounded="100px"
          variant="solid"
          bg="brand.500"
          color="white"
          borderRadius="40px"
          _hover={{
            bg: 'brand.100',
          }}
          _active={{
            bg: 'brand.500',
          }}
          fontSize="14px"
          disabled={isDisabledSendButton || isExperienceUser}
          isLoading={isLoading}
          onClick={() => {
            trackClickSend()
            if (isUploadedIpfsKey) {
              onSubmit()
            } else {
              onOpenIpfsModal()
            }
          }}
        >
          {t('send')}
        </Button>
      </Stack>
    </>
  )
}

export interface EditorProps {
  content?: string
}

const Editor: React.FC<EditorProps> = ({ content = '<p></p>' }) => {
  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new AttachmentImageExtensionExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new BulletListExtension(),
      new OrderedListExtension(),
      new LinkExtension(),
      new StrikeExtension(),
      new BlockquoteExtension({
        extraAttributes: {
          style: {
            default: null,
            parseDOM: (dom) => dom.getAttribute('style'),
          },
        },
      }),
      new HardBreakExtension(),
      new HorizontalRuleExtension(),
      new TableExtension(),
      new CalloutExtension(),
      new HeadingExtension(),
      new ParagraphExtension(),
      new IframeExtension({ enableResizing: true }),
    ],
    content,
    selection: 'start',
    stringHandler: 'html',
  })

  return (
    <RemirrorTheme className="remirror-theme" direction="column" flex={1}>
      <Remirror manager={manager} initialContent={state}>
        <Menu />
        <Grid
          pb="20px"
          flex={1}
          templateColumns={{ base: '100%', md: 'calc(100% - 200px) 200px' }}
          templateRows={{ base: 'calc(100% - 188px) 188px', md: '100%' }}
        >
          <TextEditor />
          <SelectCardSignature />
        </Grid>
        <Footer />
      </Remirror>
    </RemirrorTheme>
  )
}

export default Editor
