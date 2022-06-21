import {
  Box,
  Center,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Avatar, Button, ProfileCard } from 'ui'
import { useMemo, useRef } from 'react'
import { useScreenshot, useToast } from 'hooks'
import { useAtomValue } from 'jotai'
import { verifyEmail, shareToTwitter } from 'shared'

import SvgMailme from 'assets/profile/mail-me.svg'
import SvgCopy from 'assets/profile/copy.svg'
import SvgShare from 'assets/profile/share.svg'
import SvgTwitter from 'assets/profile/twitter.svg'
import SvgMore from 'assets/profile/more.svg'

import SvgEtherscan from 'assets/profile/business/etherscan.svg'
import SvgArrow from 'assets/profile/business/arrow.svg'
import { userPropertiesAtom } from '../../hooks/useLogin'
import { copyText, removeMailSuffix } from '../../utils'
import { useEmailAddress } from '../../hooks/useEmailAddress'
import { MAIL_SERVER_URL } from '../../constants'

enum ButtonType {
  Copy,
  Share,
  Twitter,
}

const Container = styled(Box)`
  position: relative;
  max-width: 475px;
  margin: 120px auto;
  padding: 60px 20px 55px 20px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;

  .avatar {
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    border: 4px solid #fff;
    border-radius: 50%;
  }

  .button-list {
    top: 5px;
    right: 15px;
    position: absolute;

    .button-wrap-mobile {
      display: none;
    }
  }

  .address {
    background: #f3f3f3;
    border-radius: 16px;
    padding: 13px;
    text-align: center;

    .p {
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
    }
  }

  @media (max-width: 600px) {
    .button-list {
      .button-wrap-mobile {
        display: block;
      }
      .button-wrap-pc {
        display: none;
      }
    }
  }
`

export const ProfileComponent: React.FC = () => {
  const [t] = useTranslation('settings')
  const [t2] = useTranslation('common')
  const router = useRouter()
  const queryAddress = router.query.address as undefined | Array<string>

  const userProps = useAtomValue(userPropertiesAtom)
  const emailAddress = useEmailAddress()
  const toast = useToast()
  const { downloadScreenshot } = useScreenshot()

  const popoverRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const buttonConfig: Record<
    ButtonType,
    {
      Icon: any
      label: string
    }
  > = {
    [ButtonType.Share]: {
      Icon: SvgShare,
      label: t('profile.share'),
    },
    [ButtonType.Copy]: {
      Icon: SvgCopy,
      label: t('profile.copy'),
    },
    [ButtonType.Twitter]: {
      Icon: SvgTwitter,
      label: t('profile.twitter'),
    },
  }

  const address = useMemo(() => {
    if (queryAddress?.length) return queryAddress[0]
    return userProps?.defaultAddress || emailAddress
  }, [queryAddress, userProps, emailAddress])

  const mailAddress = verifyEmail(address)
    ? address
    : `${address}@${MAIL_SERVER_URL}`

  const actionMap = useMemo(
    () => ({
      [ButtonType.Copy]: async () => {
        await copyText(mailAddress)
        toast(t2('navbar.copied'))
        popoverRef?.current?.blur()
      },
      [ButtonType.Twitter]: () => {
        shareToTwitter({
          text: 'Hey, contact me using my Mail3 email address.',
          url: 'https://mail3.me/mai3dao.eth@mail3.me',
          hashtags: ['mail3', 'mail3dao'],
        })
      },
      [ButtonType.Share]: async () => {
        if (!cardRef?.current) return
        try {
          downloadScreenshot(cardRef.current, 'share.png')
        } catch (error) {
          toast('Download screenshot Error!')
        }

        popoverRef?.current?.blur()
      },
    }),
    [mailAddress]
  )

  return (
    <>
      <Container>
        <Box className="avatar">
          <Avatar address={removeMailSuffix(mailAddress)} w="72px" h="72px" />
        </Box>
        <Box className="button-list">
          <Box className="button-wrap-mobile">
            <Popover offset={[0, 10]} arrowSize={18} autoFocus>
              <PopoverTrigger>
                <Box p="10px">
                  <SvgMore />
                </Box>
              </PopoverTrigger>
              <PopoverContent
                width="auto"
                _focus={{
                  boxShadow: '0px 0px 16px 12px rgba(192, 192, 192, 0.25)',
                  outline: 'none',
                }}
                borderRadius="20px"
                ref={popoverRef}
              >
                <PopoverArrow />
                <PopoverBody>
                  <Wrap p="14px" direction="column">
                    {[
                      ButtonType.Twitter,
                      ButtonType.Copy,
                      ButtonType.Share,
                    ].map((type: ButtonType) => {
                      const { Icon, label } = buttonConfig[type]
                      const onClick = actionMap[type]

                      return (
                        <WrapItem
                          key={type}
                          p="5px"
                          borderRadius="10px"
                          _hover={{
                            bg: '#E7E7E7',
                          }}
                        >
                          <Center as="button" onClick={onClick}>
                            <Box>
                              <Icon />
                            </Box>
                            <Text pl="10px">{label}</Text>
                          </Center>
                        </WrapItem>
                      )
                    })}
                  </Wrap>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
          <HStack className="button-wrap-pc">
            {[ButtonType.Twitter, ButtonType.Copy, ButtonType.Share].map(
              (type: ButtonType) => {
                const { Icon, label } = buttonConfig[type]
                const onClick = actionMap[type]
                return (
                  <Popover
                    arrowSize={8}
                    key={type}
                    trigger="hover"
                    placement="top-end"
                    size="md"
                  >
                    <PopoverTrigger>
                      <Box as="button" p="10px" onClick={onClick}>
                        <Icon />
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent width="auto">
                      <PopoverArrow />
                      <PopoverBody
                        whiteSpace="nowrap"
                        fontSize="14px"
                        justifyContent="center"
                      >
                        {label}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )
              }
            )}
          </HStack>
        </Box>
        <Box className="address">
          <Text className="p">{mailAddress}</Text>
        </Box>
        <Center mt="25px">
          <HStack spacing="24px">
            {[SvgArrow, SvgEtherscan].map((Item, index) => (
              <Box
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                w={{ base: '24px', md: '36px' }}
                h={{ base: '24px', md: '36px' }}
              >
                <Item />
              </Box>
            ))}
          </HStack>
        </Center>
      </Container>

      <Center>
        <Button w="250px">
          <SvgMailme /> <Box pl="10px">Mail me</Box>
        </Button>
      </Center>

      <ProfileCard ref={cardRef} mailAddress={mailAddress} />
    </>
  )
}
