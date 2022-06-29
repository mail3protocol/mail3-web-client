import React, { useEffect, useMemo } from 'react'
import {
  BoldExtension,
  ImageExtension,
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
import { Stack, Button, Flex, Grid } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { TrackEvent, useToast, useTrackClick } from 'hooks'
import { useRouter } from 'next/router'
import { fromEvent } from 'rxjs'
import { Menu } from '../menus'
import { Attach } from '../attach'
import { SelectCardSignature } from '../selectCardSignature'
import { useSubmitMessage } from '../../hooks/useSubmitMessage'
import { useSaveMessage } from '../../hooks/useSaveMessage'
import { useSubject } from '../../hooks/useSubject'

const RemirrorTheme = styled(Flex)`
  ul,
  ol {
    padding-left: 20px;
  }

  a {
    text-decoration: underline;
    color: #3182ce;
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
      pt="15px"
      pb={{ base: '20px', md: 0 }}
      fontSize="14px"
      flex={0}
      px={{ base: '20px', md: 0 }}
      {...getRootProps()}
    />
  )
}

const Footer = () => {
  const { isDisabledSendButton, isLoading, onSubmit } = useSubmitMessage()
  const { subject, toAddresses, ccAddresses, bccAddresses } = useSubject()
  const { getHTML } = useHelpers()
  const { onSave } = useSaveMessage()
  const { t } = useTranslation('edit-message')
  const trackClickSave = useTrackClick(TrackEvent.AppEditMessageClickSave)
  const trackClickSend = useTrackClick(TrackEvent.AppEditMessageClickSend)
  const toast = useToast()
  const router = useRouter()
  const initialHtml = useMemo(() => getHTML(), []) // initial content
  useEffect(() => {
    const onSaveWithCondition = async () => {
      const html = getHTML()
      if (
        !subject &&
        toAddresses.length <= 0 &&
        ccAddresses.length <= 0 &&
        bccAddresses.length <= 0 &&
        initialHtml === getHTML()
      ) {
        return
      }
      await onSave(html)
    }
    const handleRouteChange = (url?: string) => {
      onSaveWithCondition()
      return url
    }
    const beforeunloadSubscriber = fromEvent(window, 'beforeunload').subscribe(
      (e) => {
        e.preventDefault()
        // @ts-ignore
        e.returnValue = ''
      }
    )
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      beforeunloadSubscriber.unsubscribe()
    }
  }, [subject, toAddresses, ccAddresses, bccAddresses])

  return (
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
        disabled={isDisabledSendButton}
        isLoading={isLoading}
        onClick={() => {
          trackClickSend()
          onSubmit()
        }}
      >
        {t('send')}
      </Button>
    </Stack>
  )
}

export interface EditorProps {
  content?: string
}

export const Editor: React.FC<EditorProps> = ({ content = '<p></p>' }) => {
  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ImageExtension({
        enableResizing: true,
        createPlaceholder: () => document.createElement('span'),
      }),
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
          templateRows={{ base: 'auto 188px', md: '100%' }}
        >
          <TextEditor />
          <SelectCardSignature />
        </Grid>
        <Footer />
      </Remirror>
    </RemirrorTheme>
  )
}
