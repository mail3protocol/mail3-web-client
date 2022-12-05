import { PopoverBody, PopoverHeader, Center, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button } from 'ui'
import React from 'react'
import GuideMp4 from '../../assets/subscribe/guide-claim.mp4'

export const TextGuide: React.FC<{
  onConfirm?: () => void | Promise<void>
}> = ({ onConfirm }) => {
  const { t } = useTranslation('common')
  return (
    <>
      <PopoverHeader
        border="none"
        fontSize="14px"
        fontWeight="bold"
        textAlign="center"
        p="0"
      >
        <Text color="#4E51F4">{t('bell.title')}</Text>
        <Text>{t('bell.sub-title')}</Text>
      </PopoverHeader>
      <PopoverBody
        fontSize="12px"
        p="0"
        css={`
          p {
            margin-bottom: 12px;
          }
        `}
      >
        <Center
          h="200px"
          mt="20px"
          mb="20px"
          background="#FFFFFF"
          justifyContent="center"
        >
          <video width="320" autoPlay loop muted>
            <source src={GuideMp4} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Center>
        <Center>
          <Button
            onClick={onConfirm}
            w="175px"
            background="#4E51F4"
            _hover={{
              bg: '#4E51E0',
            }}
          >
            {t('bell.open_notification_confirm')}
          </Button>
        </Center>
      </PopoverBody>
    </>
  )
}
