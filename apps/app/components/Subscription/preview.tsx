import {
  Avatar,
  Box,
  Center,
  CloseButton,
  Divider,
  Flex,
  Link,
  Spacer,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Subscription } from 'models'
import React, { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { RenderHTML } from '../Preview/parser'
import { ReactComponent as UnsubscribeSvg } from '../../assets/subscription/unsubscribe.svg'
// import { ReactComponent as SubscribeSvg } from '../../assets/subscription/subscribe.svg'

export const SubPreviewIdAtom = atom<string>('')
export const SubPreviewIsOpenAtom = atom<boolean>(true)

const Mask = styled(Box)`
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  position: fixed;
  display: none;
  background-color: rgba(0, 0, 0, 0.5);
  @media (max-width: 768px) {
    display: block;
  }
`

const Container = styled(Box)`
  flex: 16;
  height: 100%;
  padding: 32px;
  overflow: hidden;
  overflow-y: scroll;
  position: relative;

  .info {
    margin-top: 18px;
    display: none;
  }

  .mobile-button {
    display: none;
  }

  .mobile-header {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 0;
    top: 143px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    background-color: #fff;
    position: fixed;

    border-radius: 22px 22px 0px 0px;

    padding: 30px 30px 200px;

    .header {
      display: none;
    }

    .info {
      display: flex;
    }

    .mobile-button {
      display: flex;
    }

    .mobile-header {
      display: flex;
    }
  }
`

const Wrap: React.FC = ({ children }) => {
  const [isMaxWdith600] = useMediaQuery(`(max-width: 768px)`)
  const [isOpen, setIsOpen] = useAtom(SubPreviewIsOpenAtom)
  const isMobileOpen = isMaxWdith600 && isOpen

  return (
    <>
      {isMobileOpen ? <Mask /> : null}
      <Container
        transform={
          !isMaxWdith600 || isMobileOpen ? 'translateY(0)' : 'translateY(100%)'
        }
      >
        {isMaxWdith600 ? (
          <Box position="absolute" top="20px" right="20px">
            <CloseButton
              onClick={() => {
                setIsOpen(false)
              }}
            />
          </Box>
        ) : null}
        {children}
      </Container>
    </>
  )
}

export const SubPreview: React.FC = () => {
  const id = useAtomValue(SubPreviewIdAtom)
  const { data, isLoading } = useQuery<Subscription.MessageDetailResp>(
    ['subscriptionDetail', id],
    () =>
      new Promise((r) => {
        setTimeout(() => {
          const mock = {
            uuid: 'string',
            subject: 'The More Important the Work, the More Important the Rest',
            writer_name: 'string',
            writer_uuid: 'string',
            content: `
        Things you can do on a contact’s page
    Decide if their email should go to The Imbox, The Feed, or The Paper Trail. Just click the “Delivering to...” button under their name. If you change the destination, all existing and future email will be moved automatically.

    Automatically label their email. Always want someone’s emails to go into a specific label? Easy, just click the “Autofile...” button and pick the label.

    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.
    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.
    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.
    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.
    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.
    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.
    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.
    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.

        `,
            created_at: 'Aug 27 9:07 am',
          }
          r(mock)
        }, 1000)
      }),
    {}
  )

  useEffect(() => {
    console.log('preview', id)
  }, [id])

  const detail = useMemo(() => data, [data])

  // loading
  if (isLoading) {
    return <Wrap>Detail Loading</Wrap>
  }

  // empty
  if (!detail) {
    return <Wrap>Empty</Wrap>
  }

  return (
    <Wrap>
      <Box className="header">
        <Flex alignItems="center">
          <Avatar w="32px" h="32px" />
          <Box ml="6px" fontWeight={600} fontSize="14px" lineHeight="26px">
            {detail?.writer_name}
          </Box>
          <Spacer />
          <Link
            fontWeight="400"
            fontSize="12px"
            lineHeight="18px"
            display="flex"
          >
            <UnsubscribeSvg /> Unsubscribe
          </Link>
        </Flex>
        <Box fontWeight={500} fontSize="12px" color="#6F6F6F" mt="4px">
          {detail?.created_at}
        </Box>
        <Divider orientation="horizontal" mt="16px" />
      </Box>
      <Center className="mobile-header">
        <Avatar w="14px" h="14px" />
        <Box
          ml="6px"
          fontWeight={400}
          fontSize="12px"
          lineHeight="26px"
          color="#818181"
        >
          {detail?.writer_name}
        </Box>
      </Center>
      <Text
        fontWeight={700}
        fontSize={{ base: '16px', md: '28px' }}
        textAlign="center"
        pt={{ base: '15px', md: '20px' }}
      >
        {detail?.subject || 'no subject'}
      </Text>
      <Flex align="center" className="info">
        <Divider orientation="horizontal" />
        <Box
          p="0px 50px"
          fontSize="12px"
          lineHeight="26px"
          whiteSpace="nowrap"
          color="#818181"
        >
          Aug 27 / 9:07
        </Box>
        <Divider orientation="horizontal" />
      </Flex>
      <Box pt={{ base: '16px', md: '30px' }}>
        <RenderHTML
          html={detail?.content}
          attachments={[]}
          messageId=""
          from={{ name: '', address: '' }}
        />
      </Box>
      <Center className="mobile-button" w="100%" mt="20px">
        <Link fontWeight="400" fontSize="12px" lineHeight="18px" display="flex">
          <UnsubscribeSvg /> Unsubscribe
        </Link>
      </Center>
    </Wrap>
  )
}
