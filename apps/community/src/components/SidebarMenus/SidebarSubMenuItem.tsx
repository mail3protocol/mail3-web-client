import { Box, Icon, LinkProps, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MouseEventHandler, useMemo } from 'react'
import { ReactComponent as SidebarMenuArrowSvg } from '../../assets/SidebarMenuArrow.svg'

export interface SidebarSubMenuItemProps {
  to: string
  isActive?: boolean
  onClick?: MouseEventHandler
  hasArrow?: boolean
  activeByPathname?: string
}

export const SidebarSubMenuItem: React.FC<SidebarSubMenuItemProps> = ({
  to,
  onClick,
  isActive,
  activeByPathname,
  children,
  hasArrow,
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
    px: '16px',
    w: 'full',
    rounded: '8px',
    textAlign: 'left',
    fontWeight: 500,
    userSelect: 'none',
    fontSize: '14px',
    display: 'flex',
    transition: '200ms',
    _hover: { textDecoration: 'none', bg: 'sidebarMenuItemHoverBackground' },
    style: currentIsActive ? activeStyle : undefined,
  }

  return (
    <Link as={RouterLink} to={to} {...itemProps}>
      <Box {...(hasArrow ? { mr: '4px' } : {})}>{children}</Box>
      {hasArrow ? (
        <Icon
          as={SidebarMenuArrowSvg}
          ml="auto"
          transition="200ms"
          style={{ transform: currentIsActive ? undefined : `rotate(-90deg)` }}
        />
      ) : null}
    </Link>
  )
}
