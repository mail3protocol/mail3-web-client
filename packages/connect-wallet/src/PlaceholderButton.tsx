import React, { useRef } from 'react'
import { Box, SlideFade, Text, useDisclosure } from '@chakra-ui/react'
import { TrackEvent, TrackKey, useTrackClick } from 'hooks'
import { ConnectButton, ConnectButtonProps } from './ConnectButton'

export const PlaceholderButton: React.FC<
  ConnectButtonProps & {
    trackDesiredWalletKey: string
  }
> = ({ trackDesiredWalletKey, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)

  return (
    <Box position="relative">
      <ConnectButton
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
      />
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
}
