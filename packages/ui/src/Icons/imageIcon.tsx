import { Icon, IconProps } from '@chakra-ui/react'

export const ImageIcon: React.FC<IconProps> = ({ ...props }) => (
  <Icon viewBox="0 0 18 18" {...props}>
    <path
      d="M15 4.5H9.75L8.25 3H3C2.175 3 1.5 3.675 1.5 4.5V13.5C1.5 14.325 2.175 15 3 15H15C15.825 15 16.5 14.325 16.5 13.5V6C16.5 5.175 15.825 4.5 15 4.5ZM15 13.5H3V4.5H7.65L9.15 6H15V13.5ZM13.5 12L10.65 8.25H10.5L8.325 11.1L6.75 9.075L4.5 12H13.5ZM7.5 7.125C7.5 6.525 6.975 6 6.375 6C5.775 6 5.25 6.525 5.25 7.125C5.25 7.725 5.775 8.25 6.375 8.25C6.975 8.25 7.5 7.725 7.5 7.125Z"
      fill="currentColor"
    />
  </Icon>
)
