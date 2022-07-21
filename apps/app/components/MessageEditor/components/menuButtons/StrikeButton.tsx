import { Icon } from '@chakra-ui/react'
import { useCommands } from '@remirror/react'
import { ReactComponent as StrikeSvg } from 'assets/svg/editor/strike.svg'
import { ButtonBase } from './Base'

export const StrikeButton: React.FC = () => {
  const { toggleStrike, focus } = useCommands()
  return (
    <ButtonBase
      variant="unstyled"
      onClick={() => {
        toggleStrike()
        focus()
      }}
      disabled={!toggleStrike.enabled()}
    >
      <Icon as={StrikeSvg} />
    </ButtonBase>
  )
}
