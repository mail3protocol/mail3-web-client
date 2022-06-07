import React from 'react'
import { Stack } from '@chakra-ui/react'
import { LinkButton } from '../menuButtons/LinkButton'
import { BoldButton } from '../menuButtons/BoldButton'
import { ItalicButton } from '../menuButtons/ItalicButton'
import { UnderlineButton } from '../menuButtons/UnderlineButton'
import { OrderListButton } from '../menuButtons/OrderListButton'
import { UnorderListButton } from '../menuButtons/UnorderListButton'
import { StrikeButton } from '../menuButtons/StrikeButton'

export const Menu: React.FC = () => (
  <Stack
    direction="row"
    spacing="10px"
    h="45px"
    alignItems="center"
    px={{
      base: '20px',
      md: '0',
    }}
    overflowY="hidden"
    overflowX="auto"
    position="sticky"
    top="0"
    bg="#fff"
  >
    <BoldButton />
    <ItalicButton />
    <UnderlineButton />
    <StrikeButton />
    <LinkButton />
    <OrderListButton />
    <UnorderListButton />
  </Stack>
)
