import {
  Box,
  Center,
  Flex,
  Image,
  Text,
  Collapse,
  useDisclosure,
  Button as RawButton,
  Tabs,
  TabList,
  HStack,
  Tab,
  TabPanels,
  TabPanel,
  Spacer,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useMemo } from 'react'
import { Avatar, Button, SubscribeButton } from 'ui'
import defaultBannerPng from '../../assets/png/subscribe/bg.png'
import { APP_URL } from '../../constants/env'

const CONTAINER_MAX_WIDTH = 1220

enum TabItemType {
  Updates,
  Items,
}

const tabsConfig: Record<
  TabItemType,
  {
    name: string
  }
> = {
  [TabItemType.Updates]: {
    name: 'Updates',
  },
  [TabItemType.Items]: {
    name: 'Items',
  },
}

interface SubscribePageProps {
  mailAddress: string
  address: string
  uuid: string
  priAddress: string
}

const PageContainer = styled(Box)`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.25);
  border-radius: 24px;
  min-height: 800px;

  @media (max-width: 600px) {
    border: none;
    width: 100%;
    height: auto;
    padding: 0;
    box-shadow: none;
    margin: 0;
  }
`

const Card: React.FC<{
  date?: string
  title?: string
  content?: string
}> = ({ date, title, content }) => {
  console.log(title, content, date)

  const isBigTitle = !content

  return (
    <LinkBox
      as="article"
      border="1px solid #EAEAEA"
      borderRadius="16px"
      p="16px"
      mb={{ base: '13px', md: 0 }}
    >
      <LinkOverlay href="#">
        <Flex
          fontWeight="400"
          fontSize="12px"
          lineHeight="26px"
          color="#6F6F6F"
          mb="6px"
        >
          <Box>9:07 am · 27 Aug</Box>
          <Spacer />
          <Box>2022</Box>
        </Flex>
        {!isBigTitle ? (
          <Box>
            <Text
              noOfLines={2}
              fontWeight="700"
              fontSize="16px"
              lineHeight="1.4"
            >
              The More Important the Work, the More Important the RestThe More
              Important the Work, the More Important the RestThe More Important
              the Work, the More Important the Rest
            </Text>
            <Text
              noOfLines={3}
              fontWeight="400"
              fontSize="12px"
              lineHeight="18px"
              mt="16px"
            >
              Things you can do on a contact’s page Decide if their email should
              go to The Imbox, The Feed, or The Paper Trail. Just click the
              “Delivering to, The Feed, or The Paper Trail. Just click the
              “Delivering to The Feed, or The Paper Trail. Just click the
              “Delivering to
            </Text>
          </Box>
        ) : (
          <Text noOfLines={3} fontWeight="700" fontSize="24px" lineHeight="1.5">
            The More Important the Work, the More Important the RestThe More
            Important the Work, the More Important the RestThe More Important
            the Work, the More Important the Rest
          </Text>
        )}
      </LinkOverlay>
    </LinkBox>
  )
}

export const SubscribePage: React.FC<SubscribePageProps> = ({
  mailAddress,
  address,
  uuid,
  priAddress,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  console.log(mailAddress)
  console.log(address)
  console.log(uuid)
  console.log(priAddress)

  const tabItemTypes = [TabItemType.Updates, TabItemType.Items]

  const mock = {
    list: [
      {
        date: '',
        title: '',
        content: '123',
      },
      {
        date: '',
        title: '',
        content: '',
      },
      {
        date: '',
        title: '',
        content: '123',
      },
      {
        date: '',
        title: '',
        content: '',
      },
    ],
    nft: [
      {
        name: 'Super Connection',
        img: 'https://img2.flowingcloud.cn/rankback/j1rl85hmixpmimje5jtt.*, video',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GC3DEUt34w',
      },
      {
        name: 'Mail³  Notification',
        img: 'https://img2.flowingcloud.cn/rankback/a315x2ohwzvowfw2rlf9.*, video',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCD1yUtjD4',
      },
      {
        name: 'Subscribe Mirror via Mail3',
        img: 'https://img2.flowingcloud.cn/rankback/8r6oji0pm1yi3vbkwlym.*, video',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCmb8Utwk9',
      },
      {
        name: 'Mail³ ✖️ RoaoGame Partnership OAT Giveaway',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1663299572281590951.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCk7uUtGee',
      },
      {
        name: 'Ethereum Merge  Commemorative Stamps',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1663226563298228030.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCyZuUtXgK',
      },
      {
        name: '"Galxe Passport" Souvenir Stamps',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1662968646319465618.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCicRUtqb6',
      },
      {
        name: 'Mail³  Grant Donors for GR14',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1662542511968737738.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCSjDUtdKH',
      },
      {
        name: 'Subscribe Mirror',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1662254725951904392.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GC1Q7UtNs8',
      },
      {
        name: 'Mail³ ✖️ CCTIP Partnership',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1662529284427033926.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCmZeUtZt8',
      },
      {
        name: 'Mail³ ✖️ Mojor Partnership',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1661768348506253194.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCHHWUte4B',
      },
      {
        name: 'Mail Handler',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1665926900481398785.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCb8MUtEkp',
      },
      {
        name: 'Mail³ ✖️ UD Partnership',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1665398877811359646.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCvHGUt6sF',
      },
      {
        name: '[MDP-01] Whether to use the GR14/15 fund to promote future marketing？',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1664581703237395297.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCqzLUt2JA',
      },
      {
        name: 'Mailer of the Month',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1665905365369089610.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCoKsUtGGa',
      },
      {
        name: 'Rookie Mailer of the Month',
        img: 'https://d257b89266utxb.cloudfront.net/galaxy/images/mail3/1665905310408600671.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCoJsUtG7C',
      },
      {
        name: 'Mail3 Gitcoin Funding Governance',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1664176355567457846.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCg79UtgNR',
      },
      {
        name: 'Mail³ ✖️ Cluster3 Partnership OAT Giveaway',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1663572317896162757.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCsDHUt9nT',
      },
      {
        name: 'Mail³ Halloween Carnival',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1666923477707362851.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GC1LGUtdef',
      },
      {
        name: 'MDP-02: Airdrop of $100 worth of domain name every month',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1667288068989041767.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCmPdUwZnn',
      },
      {
        name: 'Web3 Subscription',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1667800054707738503.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCAyvUwE2i',
      },
      {
        name: 'VOTER OF Mail³',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1668679064484170864.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCcb1UwjkD',
      },
      {
        name: 'Sticker Contest Winner',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1669032161179357695.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GC8uYUwsKD',
      },
      {
        name: 'MDP-0201: Which supported domain name will be airdropped for December 2022?',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1669239679838899602.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCYQQUwC2b',
      },
      {
        name: ' AZADI-TOWER',
        img: 'https://cdn-2.galxe.com/galaxy/images/mail3/1669339235815482737.png',
        hadGot: false,
        poapPlatform: 'https://galxe.com/mail3/campaign/GCuNWUwZuP',
      },
    ],
  }

  const bgImage = useMemo(() => defaultBannerPng.src, [])

  return (
    <PageContainer>
      <Box
        h={{ base: '100px', md: '200px' }}
        bgImage={bgImage}
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        bgPosition="center"
      />

      <Box p={{ base: '48px 20px', md: '70px 60px 0' }} position="relative">
        <Box
          w={{ base: '60px', md: '120px' }}
          h={{ base: '60px', md: '120px' }}
          left={{ base: '20px', md: '60px' }}
          top={{ base: '-30px', md: '-60px' }}
          position="absolute"
          boxShadow="0px 0px 8px rgba(0, 0, 0, 0.25)"
          bgColor="#fff"
          borderRadius="50%"
          overflow="hidden"
        >
          <Avatar address={priAddress} w="100%" h="100%" />
        </Box>
        <Box
          position="absolute"
          top={{ base: 'auto', md: '26px' }}
          right={{ base: '50%', md: '54px' }}
          bottom={{ base: '0px', md: 'auto' }}
          transform={{ base: 'translateX(50%)', md: 'none' }}
        >
          <SubscribeButton
            uuid={uuid}
            host={APP_URL}
            utmSource=""
            utmCampaign={address}
            iframeHeight="46px"
            w="150px"
            h="28px"
            variant="unstyled"
            border="1px solid #000000"
            fontSize="14px"
            bg="#fff"
            color="#000"
            borderRadius="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            earnIconStyle={{
              type: 'blue',
              left: '62px',
              top: '-18px',
            }}
          />
        </Box>
        <Text fontWeight="700" fontSize="18px" lineHeight="20px">
          mail3
        </Text>
        <Flex mt={{ base: '4px', md: '8px' }}>
          <Box
            display="inline-block"
            p="4px 4px 4px 8px"
            background="#F0F0F0"
            borderRadius="100px"
            overflow="hidden"
          >
            <Text fontWeight="400" fontSize="16px" lineHeight="24px">
              mail3.eth@mail3.me
              <Button />
            </Text>
          </Box>
        </Flex>
        <Box mt="8px" w={{ base: '100%', md: '560px' }}>
          <Collapse startingHeight={20} in={isOpen}>
            <Text fontWeight="400" fontSize="12px" lineHeight="20px">
              Anim pariatur cliche reprehenderit, enim eiusmod high life
              accusamus terry richardson ad squid. Nihil anim keffiyeh
              helvetica, craft beer labore wes anderson cred nesciunt sapiente
              ea proident.
            </Text>
          </Collapse>
          <RawButton
            size="xs"
            onClick={() => {
              if (isOpen) {
                onClose()
              } else {
                onOpen()
              }
            }}
            variant="link"
          >
            Show {isOpen ? 'Less' : 'More'}
          </RawButton>
        </Box>
      </Box>
      <Tabs position="relative" mt="30px" p={{ base: '0', md: '0px 58px' }}>
        <TabList
          className="tablist"
          w={{ base: '100%', md: 'auto' }}
          overflowX="scroll"
          overflowY="hidden"
          justifyContent="flex-start"
          border="none"
          position="relative"
        >
          <Box
            w="100%"
            bottom="0"
            position="absolute"
            zIndex="1"
            bg="#F3F3F3"
            h="1px"
          />
          <HStack
            spacing={{ base: '20px', md: '50px' }}
            position="relative"
            zIndex="2"
          >
            {tabItemTypes.map((type) => {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              const { name } = tabsConfig[type]
              return (
                <Tab
                  key={type}
                  _selected={{
                    fontWeight: 600,
                    _before: {
                      content: '""',
                      position: 'absolute',
                      w: '50px',
                      h: '4px',
                      bottom: '-1px',
                      bg: '#000',
                      borderRadius: '4px',
                    },
                  }}
                  position="relative"
                  p={{ base: '5px', md: 'auto' }}
                >
                  <HStack>
                    <Box
                      whiteSpace="nowrap"
                      fontSize={{ base: '14px', md: '18px' }}
                      marginInlineStart={{
                        base: '5px !important',
                        md: '0px !important',
                      }}
                    >
                      {name}
                    </Box>
                  </HStack>
                </Tab>
              )
            })}
          </HStack>
        </TabList>

        <Flex
          justifyContent="center"
          p={{ base: '20px', md: '20px 58px' }}
          minH="200px"
        >
          <TabPanels>
            <TabPanel p="0">
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={{ base: '0', md: '20px' }}
              >
                {mock.list.map((item, index) => {
                  console.log(item)
                  const { title, content, date } = item
                  return (
                    <Card
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      title={title}
                      content={content}
                      date={date}
                    />
                  )
                })}
              </SimpleGrid>
            </TabPanel>
            <TabPanel p="0">
              <Wrap spacing={{ base: '15px', md: '26px' }}>
                {mock.nft.map((item) => {
                  const { name, img, poapPlatform } = item
                  return (
                    <WrapItem
                      key={item.name}
                      w="160px"
                      cursor="pointer"
                      as="a"
                      href={poapPlatform}
                      target="_blank"
                      border="1px solid #E1E1E1"
                      borderRadius="8px"
                    >
                      <Center flexDirection="column" w="100%">
                        <Center w="100%" position="relative" overflow="hidden">
                          <Box
                            position="absolute"
                            filter="blur(50px)"
                            top="0"
                            left="0"
                            w="100%"
                            h="100%"
                            zIndex="1"
                          >
                            <Image
                              src={img}
                              objectFit="cover"
                              transform="scale(1.1)"
                            />
                          </Box>
                          <Flex
                            m="8px 0 10px 0"
                            w="79px"
                            h="114px"
                            overflow="hidden"
                            alignItems="center"
                            position="relative"
                            zIndex="2"
                          >
                            <Image src={img} w="100%" />
                          </Flex>
                        </Center>
                        <Box p="10px 10px 20px 10px">
                          <Text
                            w="100%"
                            fontSize="12px"
                            textAlign="center"
                            lineHeight="16px"
                            noOfLines={2}
                            color="#000"
                            fontWeight="500"
                          >
                            {name}
                          </Text>
                        </Box>
                      </Center>
                    </WrapItem>
                  )
                })}
              </Wrap>
            </TabPanel>
          </TabPanels>
        </Flex>
      </Tabs>
    </PageContainer>
  )
}
