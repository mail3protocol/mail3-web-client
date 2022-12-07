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
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Avatar, Button } from 'ui'
import defaultBannerPng from '../../assets/png/subscribe/bg.png'

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
  }
`

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

  return (
    <PageContainer>
      <Center h={{ base: '100px', md: '200px' }}>
        <Image src={defaultBannerPng.src} objectFit="cover" alt="" />
      </Center>
      <Box p={{ base: '48px 20px', md: '70px 60px' }} position="relative">
        <Box
          w={{ base: '60px', md: '120px' }}
          h={{ base: '60px', md: '120px' }}
          left={{ base: '20px', md: '60px' }}
          top={{ base: '-10px', md: '-60px' }}
          position="absolute"
          boxShadow="0px 0px 8px rgba(0, 0, 0, 0.25)"
          bgColor="#fff"
          borderRadius="50%"
          overflow="hidden"
        >
          <Avatar address={priAddress} w="100%" h="100%" />
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

        <Tabs position="relative" mt="30px">
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
                          base: '0px !important',
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

          <Flex justifyContent="center" pt="8px" minH="200px">
            <TabPanels>
              <TabPanel>Updates</TabPanel>
              <TabPanel>Items</TabPanel>
            </TabPanels>
          </Flex>
        </Tabs>
      </Box>
    </PageContainer>
  )
}
