import { Box, Flex, Heading, VStack } from '@chakra-ui/react'
import { MouseEventHandler, ReactNode } from 'react'
import { useLocation, Link } from 'react-router-dom'

export interface MenuItem {
  label: ReactNode
  currentPathname?: string
  to: string
  key: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

export interface MenuSubItems {
  label: ReactNode
  children: MenuItem[]
  key: string
}

export interface SidebarMenusProps {
  menus: (MenuItem | MenuSubItems)[]
}

export const SidebarMenuItem: React.FC<MenuItem> = ({
  label,
  currentPathname,
  to,
  onClick,
}) => {
  const { pathname } = useLocation()
  const isActive = (currentPathname || to) === pathname
  return (
    <Flex
      as={Link}
      to={to}
      rounded="8px"
      w="full"
      px="12px"
      h="40px"
      textAlign="left"
      lineHeight="23px"
      fontSize="14px"
      fontWeight="600"
      transition="200ms"
      align="center"
      {...((currentPathname || to) === pathname
        ? { bg: 'containerBackground', color: 'primary.900' }
        : {})}
      _hover={{
        bg: 'containerBackground',
        color: isActive ? 'primary.900' : 'primaryTextColor',
      }}
      onClick={onClick}
    >
      {label}
    </Flex>
  )
}

export const SidebarMenus: React.FC<SidebarMenusProps> = ({ menus }) => (
  <VStack as="ul" spacing="10px" w="full">
    {menus.map((menu) => (
      <Box
        as="li"
        w="inherit"
        listStyleType="none"
        key={menu.key}
        color="secondaryTitleColor"
      >
        {'children' in menu ? (
          <Box w="inherit">
            <Heading
              fontSize="13px"
              textTransform="uppercase"
              lineHeight="23px"
              px="12px"
              color="primary.800"
              display="flex"
              alignItems="center"
            >
              {menu.label}
            </Heading>
            <VStack spacing="8px" w="inherit" mt="6px">
              {menu.children.map((item) => (
                <SidebarMenuItem {...item} key={`${menu.key} ${item.key}`} />
              ))}
            </VStack>
          </Box>
        ) : (
          <SidebarMenuItem {...menu} />
        )}
      </Box>
    ))}
  </VStack>
)
