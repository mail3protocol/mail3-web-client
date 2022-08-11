import { Button } from 'ui'
import React from 'react'
import {
  Box,
  Button as RowButton,
  ButtonProps,
  Icon,
  Link,
  LinkProps,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { LitepaperLanguage, TrackEvent, TrackKey, useTrackClick } from 'hooks'
import styled from '@emotion/styled'
import {
  LAUNCH_URL as launchURL,
  LIGHT_PAPER_JP_URL,
  LIGHT_PAPER_URL,
  WHITE_LIST_URL,
} from '../../../constants/env'
import { ReactComponent as PdfIcon } from '../../../assets/svg/pdf-icon.svg'

const LAUNCH_URL = `${launchURL}/?utm_source=offical_click_launchapp`

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
    <Box
      position="relative"
      css={`
        .popover-dialog {
          pointer-events: none;
          opacity: 0;
          transform: scale(0.9);
        }
        :hover .popover-dialog {
          opacity: 1;
          pointer-events: unset;
          transform: scale(1);
        }
      `}
    >
      <Link
        {...linkProps}
        display={{
          base: 'none',
          md: 'inline-block',
        }}
        _hover={{
          textDecoration: 'none',
        }}
        target="_blank"
      >
        Litepaper
      </Link>
      <Box
        className="popover-dialog"
        top="100%"
        left="-30px"
        position="absolute"
        w="220px"
        display={{ base: 'none', md: 'block' }}
        border="none"
        py="20px"
        px="16px"
        shadow="0px 0px 16px 12px rgba(192, 192, 192, 0.25)"
        _focus={{
          shadow: '0px 0px 16px 12px rgba(192, 192, 192, 0.25)',
          outline: 'none',
        }}
        transition="100ms"
        rounded="20px"
        bg="#fff"
        _before={{
          content: '" "',
          position: 'absolute',
          bg: '#fff',
          transform: 'rotate(45deg)',
          w: '12px',
          h: '12px',
          top: '-5px',
          left: '105px',
        }}
      >
        <List
          css={`
            li a {
              border-radius: 4px;
              display: block;
              width: 100%;
              height: 100%;
              font-weight: 500;
              padding: 10px 15px;
            }
            li a:hover {
              text-decoration: none;
              background-color: #e7e7e7;
            }
          `}
        >
          <ListItem>
            <Link
              href={LIGHT_PAPER_URL}
              target="_blank"
              onClick={() =>
                trackWhitePaper({
                  [TrackKey.LitepaperLanguage]: LitepaperLanguage.English,
                })
              }
            >
              <ListIcon as={PdfIcon} w="20px" h="20px" mr="10px" />
              English
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href={LIGHT_PAPER_JP_URL}
              target="_blank"
              onClick={() =>
                trackWhitePaper({
                  [TrackKey.LitepaperLanguage]: LitepaperLanguage.Japanese,
                })
              }
            >
              <ListIcon as={PdfIcon} w="20px" h="20px" mr="10px" />
              にほんご
            </Link>
          </ListItem>
        </List>
      </Box>
    </Box>
  )
  const launchAppButton = (
    <Link href={LAUNCH_URL}>
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
    </Link>
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
    <Link href={LAUNCH_URL}>
      <MenuItem variant="unstyled" onClick={() => trackLaunchApp()}>
        Launch App
      </MenuItem>
    </Link>
  )
  const litepaperButton = (
    <>
      <Link w="full" href={LIGHT_PAPER_URL} target="_blank">
        <MenuItem
          variant="unstyled"
          onClick={() =>
            trackWhitePaper({
              [TrackKey.LitepaperLanguage]: LitepaperLanguage.English,
            })
          }
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Icon as={PdfIcon} w="20px" h="20px" mr="8px" />
          Litepaper
        </MenuItem>
      </Link>
      <Link w="full" href={LIGHT_PAPER_JP_URL} target="_blank">
        <MenuItem
          variant="unstyled"
          onClick={() =>
            trackWhitePaper({
              [TrackKey.LitepaperLanguage]: LitepaperLanguage.Japanese,
            })
          }
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Icon as={PdfIcon} w="20px" h="20px" mr="8px" />
          ライトペーパー
        </MenuItem>
      </Link>
    </>
  )
  return isWhiteList ? (
    <>
      {launchAppButton}
      {litepaperButton}
    </>
  ) : (
    litepaperButton
  )
}
