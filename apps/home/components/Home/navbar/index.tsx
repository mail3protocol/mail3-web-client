import {
  Center,
  Flex,
  Icon,
  Stack,
  Button as RowButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { Logo, CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import { ReactComponent as HomeNavbarSvg } from '../../../assets/svg/home-navbar-menu.svg'
import { Buttons, Menus } from './menu'

const isShowWhiteListStage = false
export const HEADER_BAR_HEIGHT = 60

export const Navbar: React.FC = () => {
  const {
    isOpen: isOpenMenuDrawer,
    onClose: onCloseMenuDrawer,
    onOpen: onOpenMenuDrawer,
  } = useDisclosure()

  return (
    <Flex
      h={`${HEADER_BAR_HEIGHT}px`}
      w="full"
      position="sticky"
      top="0"
      zIndex={99}
      direction="column"
    >
      <Center bg="#fff" px="20px" h="60px">
        <Flex
          w="full"
          maxW={`${CONTAINER_MAX_WIDTH}px`}
          justify="space-between"
          align="center"
        >
          <Logo w="112px" />
          <Flex align="center">
            <Stack direction="row" spacing="8px">
              <Buttons isWhiteList={isShowWhiteListStage} />
            </Stack>
            <RowButton
              variant="unstyled"
              minW="unset"
              ml="24px"
              w="35px"
              h="35px"
              p="5px"
              display={{
                base: 'inline-block',
                md: 'none',
              }}
              onClick={onOpenMenuDrawer}
            >
              <Icon as={HomeNavbarSvg} w="full" h="full" />
            </RowButton>
          </Flex>
        </Flex>
      </Center>
      <Drawer
        isOpen={isOpenMenuDrawer}
        placement="right"
        onClose={onCloseMenuDrawer}
        autoFocus={false}
        returnFocusOnClose={false}
      >
        <DrawerOverlay
          backdropFilter="blur(10px)"
          bg="rgba(153, 153, 153, 0.5)"
          transform="translate3d(0, 0, 0)"
        />
        <DrawerContent>
          <DrawerCloseButton top="30px" />
          <DrawerHeader p="0">
            <Flex
              align="center"
              h="90px"
              borderBottom="1px solid #E7E7E7"
              px="16px"
            >
              <Logo />
            </Flex>
          </DrawerHeader>
          <DrawerBody p="0">
            <VStack>
              <Menus isWhiteList={isShowWhiteListStage} />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}
