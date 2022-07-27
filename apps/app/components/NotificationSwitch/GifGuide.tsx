import { Image, PopoverBody, PopoverHeader } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import NotificationGuideGif from '../../assets/notification_guide.gif'

export const GifGuide: React.FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <PopoverHeader
        fontSize="14px"
        border="none"
        fontWeight="bold"
        textAlign="center"
        p="0"
      >
        {t('bell.gif_guide_title')}
      </PopoverHeader>
      <PopoverBody pt="6px" px="0" pb="0">
        <Image src={NotificationGuideGif} alt="guide" rounded="16px" />
      </PopoverBody>
    </>
  )
}
