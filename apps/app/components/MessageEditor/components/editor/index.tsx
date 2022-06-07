import React, { useEffect, useState } from 'react'
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
  FontFamilyExtension,
  FontSizeExtension,
  TextHighlightExtension,
  TextColorExtension,
  TextCaseExtension,
  CalloutExtension,
  HeadingExtension,
  ParagraphExtension,
  TableExtension,
} from 'remirror/extensions'
import {
  Remirror,
  useHelpers,
  useRemirror,
  useRemirrorContext,
} from '@remirror/react'
import { Stack, Button, Flex, Grid } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { htmlToProsemirrorNode } from 'remirror'
import { useTranslation } from 'next-i18next'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { Menu } from '../menus'
import { Attach } from '../attach'
import { SelectCardSignature } from '../selectCardSignature'
import { useSubmitMessage } from '../../hooks/useSubmitMessage'
import { useSaveMessage } from '../../hooks/useSaveMessage'

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
  return (
    <Flex
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
  const { getHTML } = useHelpers()
  const { onSave } = useSaveMessage()
  const { t } = useTranslation('edit-message')
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
        onClick={() => onSave(getHTML())}
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
        onClick={onSubmit}
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
    extraAttributes: [
      {
        identifiers: 'all',
        attributes: {
          style: {
            default: null,
            parseDOM: 'style',
          },
        },
      },
    ],
    extensions: () => [
      new BoldExtension(),
      new ImageExtension({ enableResizing: true }),
      new ItalicExtension(),
      new UnderlineExtension(),
      new BulletListExtension(),
      new OrderedListExtension(),
      new LinkExtension(),
      new StrikeExtension(),
      new BlockquoteExtension(),
      new HardBreakExtension(),
      new HorizontalRuleExtension(),
      new TableExtension(),
      new FontFamilyExtension(),
      new FontSizeExtension(),
      new TextHighlightExtension(),
      new TextColorExtension(),
      new TextCaseExtension(),
      new CalloutExtension(),
      new HeadingExtension(),
      new ParagraphExtension(),
    ],
    content,
    selection: 'start',
    stringHandler: htmlToProsemirrorNode,
  })
  const { onSave } = useSaveMessage()
  const [saveSubject, setSaveSubject] = useState<Subject<() => void> | null>(
    null
  )
  useEffect(() => {
    const s = new Subject<() => void>()
    s.pipe(debounceTime(5000)).subscribe((fn) => {
      fn()
    })
    setSaveSubject(s)
    return () => {
      s.unsubscribe()
    }
  }, [])

  return (
    <RemirrorTheme className="remirror-theme" direction="column" flex={1}>
      <Remirror
        manager={manager}
        initialContent={state}
        onChange={(e) => saveSubject?.next(() => onSave(e.helpers.getHTML()))}
      >
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
