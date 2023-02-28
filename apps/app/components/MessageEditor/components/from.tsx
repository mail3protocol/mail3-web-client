import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  Box,
  Flex,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Avatar } from 'ui'
import { TrackEvent, useTrackClick } from 'hooks'
import { useAtomValue } from 'jotai'
import { Alias } from 'models'
import { ReactComponent as ChangeFromAddressSvg } from '../../../assets/change-from-address.svg'
import { removeMailSuffix } from '../../../utils'
import { userPropertiesAtom } from '../../../hooks/useLogin'

export interface FromProps {
  onChange?: (address: string) => void
}

export const From: React.FC<FromProps> = ({ onChange }) => {
  const [emailAddress, setEmailAddress] = useState<string | undefined>(
    undefined
  )
  const trackClickFrom = useTrackClick(TrackEvent.AppEditMessageChangeFrom)
  const userProperties = useAtomValue(userPropertiesAtom)
  useEffect(() => {
    if (!userProperties) return
    setEmailAddress(userProperties.defaultAddress)
  }, [])
  useEffect(() => {
    if (emailAddress) {
      onChange?.(emailAddress)
    }
  }, [emailAddress])

  return (
    <Menu>
      <MenuButton
        as={Button}
        onClick={() => trackClickFrom()}
        rightIcon={
          <Icon
            as={ChangeFromAddressSvg}
            w="16px"
            h="16px"
            transition="200ms"
          />
        }
        variant="unstyled"
        minH="30px"
        h="auto"
        display="flex"
        alignItems="center"
        textAlign="left"
        fontSize="12px"
        color="#6F6F6F"
        fontWeight="normal"
        px="10px"
        _focus={{
          outline: 'none',
        }}
      >
        {emailAddress ? (
          <Flex align="center">
            <Avatar
              address={removeMailSuffix(emailAddress)}
              w="24px"
              h="24px"
              borderRadius="50%"
            />
            <Box
              as="span"
              ml="4px"
              whiteSpace="pre-line"
              overflow="hidden"
              noOfLines={1}
              textOverflow="ellipsis"
              flex={1}
              display="inline-block"
              w="full"
              h="auto"
              maxH="unset"
            >
              {emailAddress}
            </Box>
          </Flex>
        ) : null}
      </MenuButton>
      <MenuList
        border="none"
        shadow="0 0px 16px 12px rgba(192, 192, 192, 0.25)"
        minW="220px"
        p="16px"
        rounded="20px"
        maxW="min(460px, 100vw)"
      >
        {(userProperties?.aliases as Alias[])?.map((alias) => (
          <MenuItem
            key={alias.uuid}
            position="relative"
            color="#6F6F6F"
            zIndex={1}
            _focus={{
              bg: '#E7E7E7',
            }}
            rounded="4px"
            fontSize="12px"
            minH="40px"
            h="auto"
            px="10px"
            display="flex"
            alignItems="center"
            onClick={() => setEmailAddress(alias.address)}
          >
            <Avatar
              address={removeMailSuffix(alias.address)}
              w="24px"
              h="24px"
              borderRadius="50%"
            />
            <Box whiteSpace="pre-line" w="calc(100% - 28px)" ml="4px">
              {alias.address}
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
