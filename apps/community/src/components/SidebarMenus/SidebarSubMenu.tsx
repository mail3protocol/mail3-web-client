import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Box, Icon } from '@chakra-ui/react'
import { SidebarMenuItem, SidebarMenuItemProps } from './index'
import { ReactComponent as SidebarMenuArrowSvg } from '../../assets/SidebarMenuArrow.svg'

export type SidebarSubMenuProps = Omit<
  SidebarMenuItemProps,
  'onClick' | 'href' | 'activeByPathname'
> & {
  name: ReactNode
  isFolded?: boolean
}

export const SidebarSubMenu: React.FC<SidebarSubMenuProps> = ({
  children,
  name,
  isFolded: propsIsFolded = true,
  ...props
}) => {
  const [isFolded, setIsFolded] = useState(propsIsFolded)
  const isActive = useMemo(
    () =>
      Array.isArray(children)
        ? children.find((item) => item.props.activeByPathname === item.props.to)
        : (children as any)?.props?.activeByPathname ===
          (children as any)?.props?.to,
    [children]
  )
  useEffect(() => {
    if (isActive) {
      setIsFolded(false)
    }
  }, [isActive])
  return (
    <Box
      w="full"
      rounded="8px"
      fontSize="14px"
      fontWeight="500"
      transition="200ms"
      position="relative"
      overflow="hidden"
    >
      <SidebarMenuItem
        {...props}
        onClick={() => setIsFolded((a) => !a)}
        position="relative"
        zIndex={1}
        color={isActive ? 'primary.900' : undefined}
      >
        {name}
        <Icon
          as={SidebarMenuArrowSvg}
          ml="auto"
          transition="200ms"
          position="absolute"
          top="16px"
          right="12px"
          pointerEvents="none"
          style={{ transform: isFolded ? `rotate(-90deg)` : undefined }}
        />
      </SidebarMenuItem>
      {!isFolded ? (
        <Box
          borderLeft="2px solid"
          borderColor="sidebarSubmenuBorder"
          ml="20px"
          pl="6px"
          my="6px"
        >
          <div>{children}</div>
        </Box>
      ) : null}
    </Box>
  )
}
