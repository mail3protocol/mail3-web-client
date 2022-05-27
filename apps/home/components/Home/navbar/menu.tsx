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
import { TrackEvent, useTrackClick } from 'hooks'
import styled from '@emotion/styled'
import {
  LAUNCH_URL,
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

const MenuItem = styled(RowButton)`
  padding: 24px 20px;
  width: 100%;
  text-align: left;
  height: auto;
  border-radius: 0;
  border-bottom: 1px solid #e7e7e7;
`

export const Buttons: React.FC<{
  isWhiteList?: boolean
}> = ({ isWhiteList }) => {
  const trackLaunchApp = useTrackClick(TrackEvent.HomeLaunchApp)
  const trackWhiteList = useTrackClick(TrackEvent.HomeClickWhiteList)
  const trackWhitePaper = useTrackClick(TrackEvent.HomeClickWhitePaper)
  const litepaperButton = (
    <NextLink href={LIGHT_PAPER_URL} passHref>
      <Link
        {...linkProps}
        display={{
          base: 'none',
          md: 'inline-block',
        }}
        onClick={() => trackWhitePaper()}
        target="_blank"
      >
        Litepaper
      </Link>
    </NextLink>
  )
  const launchAppButton = (
    <NextLink href={LAUNCH_URL} passHref>
      <Button
        {...buttonProps}
        onClick={() => trackLaunchApp()}
        display={
          isWhiteList
            ? {
                base: 'none',
                md: 'inline-block',
              }
            : undefined
        }
      >
        Launch App
      </Button>
    </NextLink>
  )
  const whilelistButton = (
    <NextLink href={WHITE_LIST_URL} passHref>
      <Link
        {...linkProps}
        _hover={{
          textDecoration: {
            base: 'none',
            md: 'underline',
          },
        }}
        textDecorationColor="#FFCD4B"
        color="#FFCD4B"
        rounded="100px"
        position="relative"
        _after={{
          content: {
            base: '" "',
            md: 'none',
          },
          display: 'block',
          bg: 'linear-gradient(90deg, #FFB1B1 0.01%, #FFCD4B 50.26%, #916BFF 99.99%)',
          w: 'full',
          h: 'full',
          rounded: '100px',
          position: 'absolute',
          bottom: 0,
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
        onClick={() => trackWhiteList()}
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
  )
  return isWhiteList ? (
    <>
      {litepaperButton}
      {whilelistButton}
      {launchAppButton}
    </>
  ) : (
    <>
      {litepaperButton}
      {launchAppButton}
    </>
  )
}

export const Menus: React.FC<{
  isWhiteList?: boolean
}> = ({ isWhiteList }) => {
  const trackLaunchApp = useTrackClick(TrackEvent.HomeLaunchApp)
  const trackWhitePaper = useTrackClick(TrackEvent.HomeClickWhitePaper)
  const launchAppButton = (
    <NextLink href={LAUNCH_URL}>
      <MenuItem variant="unstyled" onClick={() => trackLaunchApp()}>
        Launch App
      </MenuItem>
    </NextLink>
  )
  const litepaperButton = (
    <NextLink href={LIGHT_PAPER_URL} passHref>
      <Link target="_blank" w="full">
        <MenuItem variant="unstyled" onClick={() => trackWhitePaper()}>
          Litepaper
        </MenuItem>
      </Link>
    </NextLink>
  )
  return isWhiteList ? (
    <>
      {launchAppButton}
      {litepaperButton}
    </>
  ) : (
    launchAppButton
  )
}
