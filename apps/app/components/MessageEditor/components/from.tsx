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
import { useQuery } from 'react-query'
import { useAccount } from 'hooks'
import React, { useEffect, useState } from 'react'
import { Avatar } from 'ui'
import ChangeFromAddressSvg from '../../../assets/change-from-address.svg'
import { Query } from '../../../api/query'
import { useAPI } from '../../../hooks/useAPI'
import { removeMailSuffix, truncateEmailMiddle } from '../../../utils'

export interface FromProps {
  onChange?: (address: string) => void
}

export const From: React.FC<FromProps> = ({ onChange }) => {
  const [emailAddress, setEmailAddress] = useState<string | undefined>(
    undefined
  )
  const account = useAccount()
  const api = useAPI()
  const { data } = useQuery(
    [Query.ENS_NAMES, account],
    async () => (await api.getAliases()).data,
    {
      onSuccess(d) {
        const defaultAddress = (
          d.aliases.find((alias) => alias.is_default) || d.aliases[0]
        ).address
        setEmailAddress(defaultAddress)
      },
    }
  )
  useEffect(() => {
    if (emailAddress) {
      onChange?.(emailAddress)
    }
  }, [emailAddress])

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={
          <Icon
            as={ChangeFromAddressSvg}
            w="16px"
            h="16px"
            transition="200ms"
          />
        }
        variant="unstyled"
        h="30px"
        lineHeight="30px"
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
        <Flex align="center">
          {emailAddress ? (
            <Avatar
              address={removeMailSuffix(emailAddress)}
              w="24px"
              h="24px"
            />
          ) : null}
          <Box as="span" ml="4px">
            {truncateEmailMiddle(emailAddress)}
          </Box>
        </Flex>
      </MenuButton>
      <MenuList
        border="none"
        shadow="0 0px 16px 12px rgba(192, 192, 192, 0.25)"
        minW="220px"
        p="16px"
        rounded="20px"
        maxW="min(460px, 100vw)"
      >
        {data?.aliases?.map((alias) => (
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
