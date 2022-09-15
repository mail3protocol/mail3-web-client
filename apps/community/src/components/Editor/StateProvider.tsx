import { Remirror, useRemirror } from '@remirror/react'
import {
  BoldExtension,
  ItalicExtension,
  PlaceholderExtension,
  UnderlineExtension,
  OrderedListExtension,
  BulletListExtension,
  StrikeExtension,
} from 'remirror/extensions'
import { Box, BoxProps } from '@chakra-ui/react'
import { useCallback } from 'react'

export interface StateProviderProps extends BoxProps {
  content?: string
  placeholder?: string
}

export const StateProvider: React.FC<StateProviderProps> = ({
  children,
  content = '',
  placeholder,
  ...props
}) => {
  const extensions = useCallback(
    () => [
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new OrderedListExtension(),
      new BulletListExtension(),
      new StrikeExtension(),
      new PlaceholderExtension({ placeholder }),
    ],
    [placeholder]
  )
  const { manager, state } = useRemirror({
    extensions,
    content,
    selection: 'start',
    stringHandler: 'html',
  })
  return (
    <Remirror manager={manager} initialContent={state}>
      <Box {...props}>{children}</Box>
    </Remirror>
  )
}
