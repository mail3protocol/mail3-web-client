import {
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  Box,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Avatar } from 'ui'
import { verifyEmail, isPrimitiveEthAddress } from 'shared'
import { removeMailSuffix } from '../../../utils'
import { MAIL_SERVER_URL } from '../../../constants'

export interface ToInputProps {
  addresses?: string[]
  onChange?: (to: string[]) => void
}

export const ToInput: React.FC<ToInputProps> = ({
  addresses = [],
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('')
  const onAddAddress = (value: string) => {
    if (value !== '' && (isPrimitiveEthAddress(value) || verifyEmail(value))) {
      const addingAddress = isPrimitiveEthAddress(value)
        ? `${value}@${MAIL_SERVER_URL}`
        : value
      onChange?.([...addresses, addingAddress])
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
          onChange?.(addresses.slice(0, -1))
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
      case 'Space': {
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

  return (
    <Flex wrap="wrap" rowGap="8px" w="full" alignItems="center">
      {addresses.map((address, i) => (
        <Tag
          key={`${address}`}
          lineHeight="24px"
          minH="24px"
          fontSize="12px"
          rounded="32px"
          p="4px"
          pr="10px"
          mr="8px"
          bg="#F3F3F3"
          maxW="min(300px, 80vh)"
          minW="200px"
          display="grid"
          gridTemplateColumns="16px calc(100% - 16px - 13px) 13px"
        >
          <Avatar
            address={removeMailSuffix(address)}
            w="16px"
            minW="16px"
            h="16px"
            rounded="100px"
          />
          <TagLabel pl="4px" color="#6F6F6F" whiteSpace="pre-line">
            {address}
          </TagLabel>
          <TagCloseButton
            w="13px"
            h="13px"
            fontSize="12px"
            bg="#EBEBEB"
            onClick={() => {
              const a = addresses.concat()
              a.splice(i, 1)
              onChange?.(a)
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
