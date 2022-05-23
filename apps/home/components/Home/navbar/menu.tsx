import { Button } from 'ui'
import React from 'react'
import {
  Box,
  Button as RowButton,
  ButtonProps,
  Link,
  LinkProps,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import {
  APP_URL,
  LIGHT_PAPER_URL,
  WHITE_LIST_URL,
} from '../../../constants/env'

const buttonProps: ButtonProps = {
  variant: 'outline',
  px: '40px',
}

const linkProps: LinkProps = {
  px: '40px',
  lineHeight: '40px',
  fontSize: '16px',
  fontWeight: 'bold',
  _hover: {
    textDecoration: 'underline',
  },
}

const menuButtonProps: ButtonProps = {
  variant: 'unstyled',
  p: '20px',
  py: '24px',
  w: 'full',
  textAlign: 'left',
  h: 'auto',
  rounded: '0',
}

export const WhiteListButtons = () => (
  <>
    <NextLink href={LIGHT_PAPER_URL} passHref>
      <Link
        {...linkProps}
        px="20px"
        display={{
          base: 'none',
          md: 'inline-block',
        }}
      >
        Litepaper
      </Link>
    </NextLink>
    <NextLink href={WHITE_LIST_URL} passHref>
      <Link
        {...linkProps}
        _hover={{
          textDecoration: 'none',
        }}
        rounded="100px"
        position="relative"
        _after={{
          content: '" "',
          display: 'block',
          bg: 'linear-gradient(90deg, #FFB1B1 0.01%, #FFCD4B 50.26%, #916BFF 99.99%)',
          w: 'full',
          h: 'full',
          rounded: '100px',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        _before={{
          content: '" "',
          display: 'block',
          bg: '#fff',
          w: 'calc(100% - 2px)',
          h: 'calc(100% - 2px)',
          rounded: '100px',
          position: 'absolute',
          top: '1px',
          left: '1px',
          zIndex: 1,
        }}
      >
        <Box
          as="span"
          color="#FFB1B1"
          bg="linear-gradient(90deg, #FFB1B1 0.01%, #FFCD4B 50.26%, #916BFF 99.99%)"
          bgClip="text"
          textDecorationColor="#FFB1B1"
          rounded="100px"
          position="relative"
          zIndex={2}
        >
          Whitelist
        </Box>
      </Link>
    </NextLink>
    <NextLink href={APP_URL} passHref>
      <Button
        {...buttonProps}
        display={{
          base: 'none',
          md: 'inline-block',
        }}
      >
        Launch App
      </Button>
    </NextLink>
  </>
)

export const NormalButtons = () => (
  <>
    <NextLink href={LIGHT_PAPER_URL} passHref>
      <Link
        {...linkProps}
        display={{
          base: 'none',
          md: 'inline-block',
        }}
      >
        Litepaper
      </Link>
    </NextLink>
    <NextLink href={APP_URL} passHref>
      <Button {...buttonProps}>Launch App</Button>
    </NextLink>
  </>
)

export const NormalMenus = () => (
  <NextLink href={LIGHT_PAPER_URL} passHref>
    <RowButton {...menuButtonProps}>Litepaper</RowButton>
  </NextLink>
)

export const WhiteListMenus = () => (
  <>
    <NextLink href={APP_URL}>
      <RowButton {...menuButtonProps}>Launch App</RowButton>
    </NextLink>
    <NextLink href={LIGHT_PAPER_URL} passHref>
      <RowButton {...menuButtonProps}>Litepaper</RowButton>
    </NextLink>
  </>
)
