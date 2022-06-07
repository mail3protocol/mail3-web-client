import {
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  Box,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Avatar } from 'ui'
import {
  isEthAddress,
  removeMailSuffix,
  truncateMiddle,
  verifyEmail,
} from '../../../utils'
import { MAIL_SERVER_URL } from '../../../constants'

export interface ToInputProps {
  defaultAddresses?: string[]
  onChange?: (to: string[]) => void
}

export const ToInput: React.FC<ToInputProps> = ({
  defaultAddresses,
  onChange,
}) => {
  const [addresses, setAddresses] = useState<string[]>(defaultAddresses ?? [])
  const [inputValue, setInputValue] = useState('')
  const onAddAddress = () => {
    if (
      inputValue !== '' &&
      (isEthAddress(inputValue) || verifyEmail(inputValue))
    ) {
      setAddresses((targets) => [...targets, inputValue])
      setInputValue('')
    }
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    switch (e.code) {
      case 'Enter': {
        onAddAddress()
        break
      }
      case 'Backspace': {
        if (inputValue === '') {
          setAddresses((targets) => targets.slice(0, -1))
        }
        break
      }
      case 'Escape': {
        target.blur()
        break
      }
      default: {
        break
      }
    }
  }
  const onDeleteAddress = useCallback(
    (targetAddress: string) =>
      setAddresses((address) => address.filter((t) => t !== targetAddress)),
    [setAddresses]
  )

  useEffect(() => {
    onChange?.(addresses)
  }, [addresses.length])

  return (
    <Flex wrap="wrap" rowGap="8px" w="full" alignItems="center">
      {addresses.map((address) => (
        <Tag
          key={`${address}`}
          lineHeight="24px"
          h="24px"
          fontSize="12px"
          rounded="32px"
          p="4px"
          pr="10px"
          mr="8px"
          bg="#F3F3F3"
        >
          <Avatar
            address={removeMailSuffix(address)}
            w="16px"
            h="16px"
            rounded="100px"
          />
          <TagLabel pl="4px" color="#6F6F6F">
            {isEthAddress(address)
              ? `${truncateMiddle(address)}@${MAIL_SERVER_URL}`
              : address}
          </TagLabel>
          <TagCloseButton
            w="13px"
            h="13px"
            fontSize="12px"
            bg="#EBEBEB"
            onClick={() => onDeleteAddress(address)}
          />
        </Tag>
      ))}
      <Box minW="200px" h="28px" w="full" flex={1} position="relative">
        <Input
          variant="unstyled"
          lineHeight="28px"
          w="full"
          h="full"
          fontSize="12px"
          onKeyDown={onKeyDown}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onBlur={onAddAddress}
        />
      </Box>
    </Flex>
  )
}
