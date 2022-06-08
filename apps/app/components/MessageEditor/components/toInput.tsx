import {
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  Box,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Avatar } from 'ui'
import {
  isEthAddress,
  removeMailSuffix,
  truncateMiddle0xMail,
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
  const onAddAddress = (value: string) => {
    if (value !== '' && (isEthAddress(value) || verifyEmail(value))) {
      const addingAddress = isEthAddress(value)
        ? `${value}@${MAIL_SERVER_URL}`
        : value
      setAddresses((targets) => [...targets, addingAddress])
      setInputValue('')
      return true
    }
    return false
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    switch (e.code) {
      case 'Enter': {
        onAddAddress(inputValue)
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
      case 'Semicolon': {
        if (onAddAddress(inputValue)) {
          e.stopPropagation()
          e.preventDefault()
        }
        break
      }
      default: {
        break
      }
    }
  }

  useEffect(() => {
    onChange?.(addresses)
  }, [addresses.length])

  return (
    <Flex wrap="wrap" rowGap="8px" w="full" alignItems="center">
      {addresses.map((address, i) => (
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
            {truncateMiddle0xMail(address)}
          </TagLabel>
          <TagCloseButton
            w="13px"
            h="13px"
            fontSize="12px"
            bg="#EBEBEB"
            onClick={() => {
              setAddresses((a) => {
                a.splice(i, 1)
                return [...a]
              })
            }}
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
          onBlur={() => onAddAddress(inputValue)}
          onPaste={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onAddAddress(e.clipboardData.getData('text'))
          }}
        />
      </Box>
    </Flex>
  )
}
