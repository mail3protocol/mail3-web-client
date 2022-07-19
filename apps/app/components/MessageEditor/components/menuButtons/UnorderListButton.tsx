import { Icon } from '@chakra-ui/react'
import { useCommands } from '@remirror/react'
import { ReactComponent as UnorderListSvg } from 'assets/svg/editor/unorderList.svg'
import { ButtonBase } from './Base'

export const UnorderListButton: React.FC = () => {
  const { toggleBulletList, focus } = useCommands()
  return (
    <ButtonBase
      onClick={() => {
        toggleBulletList()
        focus()
      }}
      disabled={!toggleBulletList.enabled()}
    >
      <Icon as={UnorderListSvg} />
    </ButtonBase>
  )
}
