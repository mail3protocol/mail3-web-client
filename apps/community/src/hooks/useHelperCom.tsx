import {
  Heading,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react'

export const useHelperComponent = () => ({
  h3: <Heading as="h3" fontSize="18px" mt="32px" mb="12px" fontWeight="700" />,
  ul: <UnorderedList />,
  ol: <OrderedList />,
  li: <ListItem fontSize="14px" fontWeight="400" />,
  p: <Text fontSize="14px" fontWeight="400" />,
})
