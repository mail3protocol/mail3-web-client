import { Button, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'

export interface ButtonListItemProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  href?: string
  icon: React.ReactNode
  label: string
}

export const ButtonListItem: React.FC<ButtonListItemProps> = ({
  onClick,
  href,
  icon,
  label,
}) => {
  const item = (
    <Button
      isFullWidth
      bg="transparent"
      justifyContent="flex-start"
      height="40px"
      onClick={onClick}
      _hover={{
        bg: 'rgba(78, 97, 245, 0.1)',
      }}
    >
      {icon}
      <Text ml="12px" fontWeight={500}>
        {label}
      </Text>
    </Button>
  )

  return href ? <Link href={href}>{item}</Link> : item
}

export interface ButtonListProps {
  items: ButtonListItemProps[]
}

export const ButtonList: React.FC<ButtonListProps> = ({ items }) => (
  <Stack flexDirection="column" spacing="4px">
    {items.map((item, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <ButtonListItem key={i} {...item} />
    ))}
  </Stack>
)
