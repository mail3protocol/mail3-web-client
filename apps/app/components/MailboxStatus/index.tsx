import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import React from 'react'

import IMGClear from '../../assets/clear.png'
import SVGBottom from '../../assets/is-bottom.svg'
import SVGNone from '../../assets/none.svg'

export const EmptyStatus = () => {
  const [t] = useTranslation('mailboxes')

  return (
    <Flex h="500px" justifyContent="center" alignItems="center">
      <Box>
        <Box
          fontSize="20px"
          fontWeight={500}
          lineHeight="30px"
          marginBottom="30px"
        >
          {t('inbox.all-clear')}
        </Box>
        <Image src={IMGClear} />
      </Box>
    </Flex>
  )
}

export const ThisBottomStatus = () => {
  const [t] = useTranslation('mailboxes')

  return (
    <Flex h="200px" justifyContent="center" alignItems="center">
      <Box>
        <Box
          fontSize="12px"
          fontWeight={400}
          lineHeight="18px"
          marginBottom="20px"
          textAlign="center"
        >
          {t('this-is-bottom')}
        </Box>
        <SVGBottom />
      </Box>
    </Flex>
  )
}

export const ClearStatus = () => {
  const [t] = useTranslation('mailboxes')

  return (
    <Flex h="500px" justifyContent="center" alignItems="center">
      <Box>
        <Box
          fontSize="16px"
          fontWeight={400}
          lineHeight="18px"
          marginBottom="20px"
          textAlign="center"
        >
          {t('trash.clear')}
        </Box>
        <SVGNone />
      </Box>
    </Flex>
  )
}
