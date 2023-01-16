import {
  Box,
  Center,
  Grid,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import dayjs, { Dayjs } from 'dayjs'
import { ReactNode } from 'react'
import { copyText } from 'shared'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SvgCopy } from '../../assets/copy.svg'
import { APP_URL } from '../../constants/env/url'
import { useToast } from '../../hooks/useToast'

export const SentRecordItem: React.FC<{
  uuid: string
  time: string | Dayjs
  subject: ReactNode
  viewCount: number
}> = ({ uuid, time, subject, viewCount }) => {
  const toast = useToast()
  const { t } = useTranslation('common')

  return (
    <Grid
      as="a"
      h="inherit"
      gridTemplateColumns="120px 1fr 120px"
      alignItems="center"
      whiteSpace="nowrap"
      px="16px"
      rounded="8px"
      transition="200ms"
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
      <Center
        fontSize="12px"
        textAlign="right"
        verticalAlign="middle"
        fontWeight="400"
        justifyContent="space-between"
        pl="20px"
      >
        <Center>
          <ViewIcon w="16px" h="16px" mr="4px" mb="2px" />
          {viewCount.toLocaleString('en-US')}
        </Center>
        <Center>
          <Popover
            arrowSize={8}
            trigger="hover"
            placement="top-start"
            size="md"
          >
            <PopoverTrigger>
              <Box
                as="button"
                p="5px"
                _hover={{
                  color: 'primary.900',
                }}
                _active={{
                  color: '#A1A2F4',
                }}
                onClick={async () => {
                  await copyText(`${APP_URL}/p/${uuid}`)
                  toast(t('copy_successfully'), {
                    status: 'success',
                    alertProps: { colorScheme: 'green' },
                  })
                }}
              >
                <SvgCopy />
              </Box>
            </PopoverTrigger>
            <PopoverContent width="auto" bg="#000" color="#fff">
              <PopoverArrow bg="#000" />
              <PopoverBody
                whiteSpace="nowrap"
                fontSize="12px"
                justifyContent="center"
              >
                {t('copy_message_link')}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Center>
      </Center>
    </Grid>
  )
}
