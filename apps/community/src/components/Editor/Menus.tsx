import { Button, ButtonProps, HStack } from '@chakra-ui/react'
import {
  BoldIcon,
  LinkIcon,
  ItalicIcon,
  OrderListIcon,
  UnderlineIcon,
  UnOrderListIcon,
  StrikeIcon,
} from 'ui'
import { useCommands } from '@remirror/react'
import { useCallback } from 'react'

export const MenuButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <Button
    variant="unstyled"
    w="18px"
    h="18px"
    minW="unset"
    display="inline-flex"
    justifyContent="center"
    alignItems="center"
    css="svg { width: 18px; height: 18px }"
    {...props}
  >
    {children}
  </Button>
)

// TODO: Add Link
export const Menus: React.FC = () => {
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleOrderedList,
    toggleBulletList,
    toggleStrike,
    focus,
  } = useCommands()
  const onToggleFunction = useCallback(
    (fn: () => void) => () => {
      fn()
      focus()
    },
    [focus]
  )
  return (
    <HStack
      rounded="12px"
      bgColor="cardBackground"
      h="40px"
      px="24px"
      spacing="12px"
    >
      <MenuButton onClick={onToggleFunction(toggleBold)}>
        <BoldIcon />
      </MenuButton>
      <MenuButton onClick={onToggleFunction(toggleItalic)}>
        <ItalicIcon />
      </MenuButton>
      <MenuButton onClick={onToggleFunction(toggleStrike)}>
        <StrikeIcon />
      </MenuButton>
      <MenuButton onClick={onToggleFunction(toggleUnderline)}>
        <UnderlineIcon />
      </MenuButton>
      <MenuButton>
        <LinkIcon />
      </MenuButton>
      <MenuButton onClick={onToggleFunction(toggleOrderedList)}>
        <OrderListIcon />
      </MenuButton>
      <MenuButton onClick={onToggleFunction(toggleBulletList)}>
        <UnOrderListIcon />
      </MenuButton>
    </HStack>
  )
}
