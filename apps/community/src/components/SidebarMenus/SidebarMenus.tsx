import { Box, Flex, Heading, VStack } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useLocation, Link } from 'react-router-dom'

interface MenuItem {
  label: ReactNode
  currentPathname?: string
  to: string
  key: string
}

interface MenuSubItems {
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
      py="4px"
      textAlign="left"
      lineHeight="23px"
      fontSize="14px"
      fontWeight="600"
      transition="200ms"
      {...((currentPathname || to) === pathname ? { bg: 'primary.100' } : {})}
      _hover={{
        textDecoration: isActive ? undefined : 'underline',
      }}
    >
      {label}
    </Flex>
  )
}

export const SidebarMenus: React.FC<SidebarMenusProps> = ({ menus }) => (
  <VStack as="ul" spacing="32px" w="full">
    {menus.map((menu) => (
      <Box as="li" w="inherit" listStyleType="none" key={menu.key}>
        {'children' in menu ? (
          <Box w="inherit">
            <Heading
              fontSize="13px"
              textTransform="uppercase"
              lineHeight="23px"
              px="12px"
              color="primary.800"
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
