import React, { useCallback } from 'react'
import {
  useToast as useChakraToast,
  Alert,
  AlertIcon,
  Text,
  TextProps,
  UseToastOptions,
} from '@chakra-ui/react'

export interface ToastOptions extends UseToastOptions {
  textProps?: TextProps
}

export function useToast() {
  const toast = useChakraToast()
  return useCallback(
    (message: React.ReactNode, options?: ToastOptions) => {
      toast.closeAll()
      const { textProps, position = 'top', ...rest } = options ?? {}
      toast({
        duration: 2000,
        position,
        containerStyle: {
          minWidth: 150,
        },
        ...rest,
        render: () => (
          <Alert
            status={options?.status ?? 'error'}
            position="relative"
            bg="white"
            borderRadius="22px"
            boxShadow="0px 0px 10px 4px rgb(25 25 100 / 10%)"
            px="24px"
            py="12px"
          >
            <AlertIcon color="black" mr="6px" />
            <Text fontSize="16px" fontWeight="500" {...textProps}>
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
