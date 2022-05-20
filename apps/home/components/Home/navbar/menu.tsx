import { Button } from 'ui'
import React from 'react'
import {
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
    <NextLink href={WHITE_LIST_URL} passHref>
      <Link
        {...linkProps}
        color="#FFB1B1"
        bg="linear-gradient(90deg, #FFB1B1 0.01%, #FFCD4B 50.26%, #916BFF 99.99%)"
        bgClip="text"
        textDecorationColor="#FFB1B1"
      >
        Whitelist
      </Link>
    </NextLink>
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
    <NextLink href={LIGHT_PAPER_URL} passHref>
      <RowButton {...menuButtonProps}>Litepaper</RowButton>
    </NextLink>
    <NextLink href={APP_URL}>
      <RowButton {...menuButtonProps}>Launch App</RowButton>
    </NextLink>
  </>
)
