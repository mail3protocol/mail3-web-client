import { Icon } from '@chakra-ui/react'
import { useCommands } from '@remirror/react'
import { ReactComponent as BoldSvg } from 'assets/svg/editor/bold.svg'
import { ButtonBase } from './Base'

export const BoldButton: React.FC = () => {
  const { toggleBold, focus } = useCommands()
  return (
    <ButtonBase
      onClick={() => {
        toggleBold()
        focus()
      }}
      disabled={!toggleBold.enabled()}
    >
      <Icon as={BoldSvg} />
    </ButtonBase>
  )
}
