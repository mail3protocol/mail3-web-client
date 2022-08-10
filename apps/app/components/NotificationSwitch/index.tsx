import React, { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  Button as RowButton,
  Icon,
  Box,
  useDisclosure,
} from '@chakra-ui/react'
import { timer } from 'rxjs'
import { AnimatePresence, motion } from 'framer-motion'
import { useNotification } from '../../hooks/useNotification'
import { ReactComponent as BellSvg } from '../../assets/bell.svg'
import { TextGuide } from './TextGuide'
import { BaseSwitch } from './BaseSwitch'
import { IS_CHROME, IS_FIREBOX, IS_IOS, IS_OPERA } from '../../constants'
import { GifGuideDialog } from './GifGuideDialog'

export const NotificationSwitch: React.FC = () => {
  const {
    isOpen: isOpenPopover,
    onOpen: onOpenPopover,
    onClose: onClosePopover,
  } = useDisclosure()
  const {
    isOpen: isOpenGifGuideDialog,
    onOpen: onOpenGifGuideDialog,
    onClose: onCloseGifGuideDialog,
  } = useDisclosure()
  const { permission, requestPermission, webPushNotificationState } =
    useNotification()
  const isEnabledNotification =
    permission === 'granted' && webPushNotificationState === 'enabled'
  const [isHide, setHide] = useState(isEnabledNotification)

  const isBrowserSupport = [IS_CHROME, IS_FIREBOX, IS_OPERA].some(
    (isSupport) => isSupport && !IS_IOS
  )

  useEffect(() => {
    onClosePopover()
    onCloseGifGuideDialog()
    if (isEnabledNotification) {
      const timerSubscriber = timer(5000).subscribe(() => {
        setHide(true)
      })
      return () => {
        timerSubscriber.unsubscribe()
      }
    }
    setHide(false)
    return () => {}
  }, [isEnabledNotification])

  if (!isBrowserSupport) {
    return null
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {!isHide ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Popover
              isOpen={isOpenPopover}
              onClose={onClosePopover}
              arrowSize={12}
              arrowShadowColor="none"
              offset={[0, 20]}
            >
              <PopoverTrigger>
                <RowButton
                  variant="unstyled"
                  onClick={() => {
                    if (permission === 'default') onOpenPopover()
                    if (permission === 'denied') onOpenGifGuideDialog()
                  }}
                >
                  <BaseSwitch checked={isEnabledNotification}>
                    <Icon as={BellSvg} w="14px" h="14px" />
                    <Box
                      borderLeft="1px solid #000"
                      position="absolute"
                      h="14px"
                      transform="rotate(45deg)"
                      transformOrigin="top left"
                      top="5.5px"
                      right="4.5px"
                      transition="300ms"
                      style={{
                        transform: isEnabledNotification
                          ? 'rotate(45deg) scaleY(0)'
                          : undefined,
                      }}
                    />
                  </BaseSwitch>
                </RowButton>
              </PopoverTrigger>
              <PopoverContent
                w="calc(100vw - 40px)"
                maxW="267px"
                border="none"
                shadow="0 0 16px 12px rgba(192, 192, 192, 0.25)"
                _focus={{
                  boxShadow: '0 0 16px 12px rgba(192, 192, 192, 0.25)',
                  outline: 'none',
                }}
                rounded="16px"
                py="20px"
                px="16px"
                mx="20px"
              >
                <PopoverArrow />
                <TextGuide
                  onConfirm={async () => {
                    onClosePopover()
                    await requestPermission()
                  }}
                />
              </PopoverContent>
            </Popover>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <GifGuideDialog
        isOpen={isOpenGifGuideDialog}
        onClose={onCloseGifGuideDialog}
      />
    </>
  )
}
