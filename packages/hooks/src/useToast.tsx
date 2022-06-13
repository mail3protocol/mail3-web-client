import React, { useCallback } from 'react'
import {
  useToast as useChakraToast,
  UseToastOptions,
  Text,
  TextProps,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'

export interface ToastOptions extends UseToastOptions {
  textProps?: TextProps
}

export const useToast = () => {
  const toast = useChakraToast()
  return useCallback(
    (message: React.ReactNode, options?: ToastOptions) => {
      toast.closeAll()
      const { textProps, position = 'top', ...rest } = options ?? {}
      toast({
        duration: 2000,
        position,
        ...rest,
        render: () => (
          <Alert
            status={options?.status ?? 'error'}
            position="relative"
            bg="white"
            borderRadius="22px"
            boxShadow="0px 0px 10px 4px rgb(25 25 100 / 10%)"
          >
            <AlertIcon color="black" />
            <Text fontSize="16px" {...textProps}>
              {message}
            </Text>
          </Alert>
        ),
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
