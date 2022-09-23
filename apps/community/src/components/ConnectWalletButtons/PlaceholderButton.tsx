import React, { forwardRef, useRef } from 'react'
import { Box, SlideFade, Text, useDisclosure } from '@chakra-ui/react'
import { TrackEvent, TrackKey, useTrackClick } from 'hooks'
import { BaseButton, BaseButtonProps } from './BaseButton'

export interface PlaceholderButtonProps extends BaseButtonProps {
  trackDesiredWalletKey: string
}

export const PlaceholderButton = forwardRef<
  HTMLButtonElement,
  PlaceholderButtonProps
>(({ icon, trackDesiredWalletKey, children, ...props }, ref) => {
  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const timeoutRef = useRef<NodeJS.Timeout>()
  return (
    <Box position="relative">
      <BaseButton
        ref={ref}
        variant="wallet"
        icon={icon}
        onClick={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          onClose()
          onOpen()
          timeoutRef.current = setTimeout(() => {
            onClose()
          }, 1000)
          trackWallet({
            [TrackKey.DesiredWallet as string]: trackDesiredWalletKey,
          })
        }}
        {...props}
      >
        {children}
      </BaseButton>
      <SlideFade
        offsetY="20px"
        in={isOpen}
        style={{ position: 'absolute', right: '-8px', top: '8px' }}
      >
        <Text position="absolute" fontStyle="italic" fontSize="12px">
          +1
        </Text>
      </SlideFade>
    </Box>
  )
})
