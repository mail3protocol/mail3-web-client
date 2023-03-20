import { Box, Divider, Flex, Heading, Icon } from '@chakra-ui/react'
import { Avatar } from 'ui'
import React, { useMemo } from 'react'
import { useAccount } from 'hooks'
import dayjs from 'dayjs'
import { ReactComponent as UnsubscribableSvg } from 'assets/svg/unsubscribe.svg'
import { useTranslation } from 'react-i18next'
import { Preview } from '../Preview'
import { useUserInfo } from '../../hooks/useUserInfo'
import { formatUserName } from '../../utils/string'

export interface PreviewSimulatorProps {
  html: string
  subject: string
}

export const PreviewSimulator: React.FC<PreviewSimulatorProps> = ({
  html,
  subject,
}) => {
  const address = useAccount()
  const userInfo = useUserInfo()
  const nowTime = useMemo(() => dayjs().format('MMM D h:mm a'), [])
  const { t } = useTranslation('new_message')

  return (
    <Flex flex={1} direction="column" px="50px">
      <Flex align="center">
        <Avatar w="32px" h="32px" address={address} borderRadius="50%" />
        <Box fontSize="14px" lineHeight="26px" fontWeight="600" ml="6px">
          {formatUserName(userInfo?.nickname)}
        </Box>
        <Flex
          align="center"
          ml="auto"
          fontSize="12px"
          lineHeight="20px"
          fontWeight="400"
        >
          <Icon as={UnsubscribableSvg} w="20px" h="20px" mr="5px" />
          <Box>{t('unsubscribe')}</Box>
        </Flex>
      </Flex>
      <Box
        color="previewDatetimeColor"
        lineHeight="26px"
        fontSize="12px"
        fontWeight="500"
      >
        {nowTime}
      </Box>
      <Divider as="hr" mt="20px" />
      <Heading
        lineHeight="32px"
        fontSize="28px"
        fontWeight="700"
        mt="20px"
        mb="12px"
        textAlign="center"
      >
        {subject}
      </Heading>
      <Preview html={html} />
    </Flex>
  )
}
