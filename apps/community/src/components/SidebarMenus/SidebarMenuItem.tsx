import { Box, Center, LinkProps, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MouseEventHandler, ReactNode, useMemo } from 'react'

export interface SidebarMenuItemProps extends LinkProps {
  icon?: ReactNode
  to?: string
  isActive?: boolean
  activeByPathname?: string
  onClick?: MouseEventHandler
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  to,
  onClick,
  isActive,
  activeByPathname,
  children,
  icon,
  ...props
}) => {
  const currentIsActive = useMemo(() => {
    if (isActive) return isActive
    return activeByPathname ? to === activeByPathname : false
  }, [isActive, activeByPathname])
  const activeStyle = {
    backgroundColor: 'var(--chakra-colors-primary-800)',
    color: 'var(--chakra-colors-sidebarMenuActiveText)',
    boxShadow: 'var(--chakra-shadows-md)',
  }
  const itemProps: LinkProps = {
    onClick,
    alignItems: 'center',
    py: '12px',
    px: '10px',
    w: 'full',
    rounded: '8px',
    textAlign: 'left',
    fontWeight: 500,
    userSelect: 'none',
    fontSize: '14px',
    display: 'flex',
    transition: '200ms',
    position: 'relative',
    _hover: { textDecoration: 'none', bg: 'sidebarMenuItemHoverBackground' },
    style: currentIsActive ? activeStyle : undefined,
    ...props,
  }
  const childrenElement = (
    <>
      <Center w="16px" h="16px" mx="4px">
        {icon}
      </Center>
      <Box ml="4px">{children}</Box>
    </>
  )
  if (to) {
    return (
      <Link as={RouterLink} to={to} {...itemProps}>
        {childrenElement}
      </Link>
    )
  }
  return <Link {...itemProps}>{childrenElement}</Link>
}
