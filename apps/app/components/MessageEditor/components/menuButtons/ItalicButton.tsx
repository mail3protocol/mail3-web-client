import { Icon } from '@chakra-ui/react'
import { useCommands } from '@remirror/react'
import { ReactComponent as ItalicSvg } from 'assets/svg/editor/italic.svg'
import { ButtonBase } from './Base'

export const ItalicButton: React.FC = () => {
  const { toggleItalic, focus } = useCommands()
  return (
    <ButtonBase
      variant="unstyled"
      onClick={() => {
        toggleItalic()
        focus()
      }}
      disabled={!toggleItalic.enabled()}
    >
      <Icon as={ItalicSvg} />
    </ButtonBase>
  )
}
