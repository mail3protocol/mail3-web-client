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
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import LogoSvg from 'assets/svg/logo.svg'
import LogoWithoutFontSvg from 'assets/svg/logo-without-font.svg'
import HomeNavbarSvg from '../../../assets/svg/home-navbar-menu.svg'
import { isWhiteListStage } from '../../../utils'
import { Buttons, Menus } from './menu'
import { RainbowBar } from '../rainbowBar'

export const HEADER_BAR_HEIGHT = 60 + (isWhiteListStage() ? 44 : 0)

export const Navbar: React.FC = () => {
  const isShowWhiteListStage = isWhiteListStage()
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
      {isShowWhiteListStage ? <RainbowBar /> : null}
      <Center bg="#fff" px="20px" h="60px">
        <Flex
          w="full"
          maxW={`${CONTAINER_MAX_WIDTH}px`}
          justify="space-between"
          align="center"
        >
          <Icon
            as={LogoSvg}
            w="112px"
            h="auto"
            display={{ base: 'none', md: 'inline-block' }}
          />
          <Icon
            as={LogoWithoutFontSvg}
            w="36px"
            h="auto"
            display={{ base: 'inline-block', md: 'none' }}
          />
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
              <Icon as={LogoSvg} w="100px" h="auto" />
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
