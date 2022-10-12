import { Box, Grid } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import dayjs, { Dayjs } from 'dayjs'
import { ReactNode } from 'react'

export const SentRecordItem: React.FC<{
  time: string | Dayjs
  subject: ReactNode
  viewCount: number
}> = ({ time, subject, viewCount }) => (
  <Grid
    as="a"
    h="inherit"
    gridTemplateColumns="120px 1fr 80px"
    alignItems="center"
    whiteSpace="nowrap"
    px="16px"
    rounded="8px"
    transition="200ms"
    cursor="pointer"
    _hover={{ shadow: 'listHover', transform: 'scale(1.01)' }}
  >
    <Box fontSize="12px" color="secondaryTitleColor" fontWeight="500">
      {dayjs(time).format('YYYY-MM-DD')}
    </Box>
    <Box
      fontSize="16px"
      overflow="hidden"
      noOfLines={1}
      textOverflow="ellipsis"
      display="block"
      fontWeight="600"
    >
      {subject}
    </Box>
    <Box
      fontSize="12px"
      textAlign="right"
      verticalAlign="middle"
      fontWeight="400"
    >
      <ViewIcon w="16px" h="16px" mr="4px" mb="2px" />
      {viewCount.toLocaleString('en-US')}
    </Box>
  </Grid>
)
