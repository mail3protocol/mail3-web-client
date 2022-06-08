import { Icon } from '@chakra-ui/react'
import { useCommands } from '@remirror/react'
import UnderlineSvg from 'assets/svg/editor/underline.svg'
import { ButtonBase } from './Base'

export const UnderlineButton: React.FC = () => {
  const { toggleUnderline, focus } = useCommands()
  return (
    <ButtonBase
      variant="unstyled"
      onClick={() => {
        toggleUnderline()
        focus()
      }}
      disabled={!toggleUnderline.enabled()}
    >
      <Icon as={UnderlineSvg} />
    </ButtonBase>
  )
}
