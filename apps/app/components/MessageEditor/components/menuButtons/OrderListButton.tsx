import { Icon } from '@chakra-ui/react'
import { useCommands } from '@remirror/react'
import OrderListSvg from 'assets/svg/editor/orderList.svg'
import { ButtonBase } from './Base'

export const OrderListButton: React.FC = () => {
  const { toggleOrderedList, focus } = useCommands()
  return (
    <ButtonBase
      onClick={() => {
        toggleOrderedList()
        focus()
      }}
      disabled={!toggleOrderedList.enabled()}
    >
      <Icon as={OrderListSvg} />
    </ButtonBase>
  )
}
