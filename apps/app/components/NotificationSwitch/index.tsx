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
import { GifGuide } from './GifGuide'
import { BaseSwitch } from './BaseSwitch'

export const NotificationSwitch: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { permission, requestPermission } = useNotification()
  const isEnabledNotification = permission === 'granted'
  const [isHide, setHide] = useState(isEnabledNotification)

  useEffect(() => {
    onClose()
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

  return (
    <AnimatePresence initial={false}>
      {!isHide ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Popover
            isOpen={isOpen}
            onClose={onClose}
            arrowSize={12}
            arrowShadowColor="none"
            offset={[0, 20]}
          >
            <PopoverTrigger>
              <RowButton
                variant="unstyled"
                onClick={() => {
                  if (permission !== 'granted') onOpen()
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
              {permission === 'denied' ? <GifGuide /> : null}
              {permission === 'default' ? (
                <TextGuide
                  onConfirm={async () => {
                    onClose()
                    await requestPermission()
                  }}
                />
              ) : null}
            </PopoverContent>
          </Popover>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
