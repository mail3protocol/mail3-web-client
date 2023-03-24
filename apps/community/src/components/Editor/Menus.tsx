import { Button, ButtonProps, HStack, StackProps } from '@chakra-ui/react'
import {
  BoldIcon,
  ItalicIcon,
  OrderListIcon,
  UnderlineIcon,
  UnOrderListIcon,
  StrikeIcon,
} from 'ui'
import { useCommands } from '@remirror/react'
import { useCallback } from 'react'
import { LinkButton } from './MenuFcuntionButtons/LinkButton'
import {
  ImageButton,
  ImageButtonProps,
} from './MenuFcuntionButtons/ImageButton'

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

export const Menus: React.FC<
  StackProps & {
    imageButtonProps?: ImageButtonProps
  }
> = ({ imageButtonProps, ...props }) => {
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
      zIndex={1}
      position="sticky"
      top="60px"
      bgColor="cardBackground"
      h="40px"
      spacing="12px"
      {...props}
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
      <LinkButton />
      <MenuButton onClick={onToggleFunction(toggleOrderedList)}>
        <OrderListIcon />
      </MenuButton>
      <MenuButton onClick={onToggleFunction(toggleBulletList)}>
        <UnOrderListIcon />
      </MenuButton>
      <ImageButton {...imageButtonProps} />
    </HStack>
  )
}
