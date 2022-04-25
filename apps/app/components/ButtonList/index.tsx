import { Button, Stack, Text, Link as ChakraLink } from '@chakra-ui/react'
import Link from 'next/link'

export interface ButtonListItemProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  href?: string
  icon: React.ReactNode
  label: string
  isExternal?: boolean
}

export const ButtonListItem: React.FC<ButtonListItemProps> = ({
  onClick,
  href,
  icon,
  label,
  isExternal,
}) => {
  const item = (
    <Button
      isFullWidth
      bg="transparent"
      justifyContent="flex-start"
      height="40px"
      onClick={onClick}
      _hover={{
        bg: '#E7E7E7',
      }}
      as={isExternal ? undefined : 'a'}
      cursor="pointer"
    >
      {icon}
      <Text ml="12px" fontWeight={500}>
        {label}
      </Text>
    </Button>
  )

  if (isExternal && href) {
    return (
      <ChakraLink
        isExternal
        href={href}
        _hover={{
          textDecoration: 'none',
        }}
      >
        {item}
      </ChakraLink>
    )
  }

  return href ? (
    <Link href={href} passHref>
      {item}
    </Link>
  ) : (
    item
  )
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
