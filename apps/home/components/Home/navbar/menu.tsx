import { Button } from 'ui'
import React from 'react'
import { Button as RowButton, ButtonProps } from '@chakra-ui/react'

const buttonProps: ButtonProps = {
  variant: 'outline',
  px: '40px',
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
    <Button px="40px">Whitelist</Button>
    <Button
      {...buttonProps}
      display={{
        base: 'none',
        md: 'inline-block',
      }}
    >
      Lightpaper
    </Button>
    <Button
      {...buttonProps}
      display={{
        base: 'none',
        md: 'inline-block',
      }}
    >
      Launch App
    </Button>
  </>
)

export const NormalButtons = () => (
  <>
    <Button
      {...buttonProps}
      display={{
        base: 'none',
        md: 'inline-block',
      }}
    >
      Lightpaper
    </Button>
    <Button {...buttonProps}>Launch App</Button>
  </>
)

export const NormalMenus = () => (
  <RowButton {...menuButtonProps}>Lightpaper</RowButton>
)

export const WhiteListMenus = () => (
  <>
    <RowButton {...menuButtonProps}>Lightpaper</RowButton>
    <RowButton {...menuButtonProps}>Launch App</RowButton>
  </>
)
