import { Button } from 'ui'
import { ReactComponent as JoyIDIcon } from 'assets/wallets/joyid.svg'
import { Divider, Flex, HStack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { ConnectorName, useSetLastConnector } from 'hooks'

const { connect } = require('@joyid/evm')

export const JoyIDButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const setLastConnector = useSetLastConnector()
  const onClick = async () => {
    setIsLoading(true)
    try {
      setIsLoading(true)
      await connect()
      setLastConnector(undefined)
      setTimeout(() => {
        setLastConnector(ConnectorName.JoyID)
      }, 1)
    } catch (error) {
      //
      //
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Flex w="full" flexDirection="column" alignItems="center">
      <Button
        onClick={onClick}
        w={['250px', '250px', '350px']}
        mb="16px"
        isLoading={isLoading}
      >
        <JoyIDIcon />
      </Button>
      <Text color="#6F6F6F" fontSize="12px" mb="16px">
        Keyless and non-custodial
      </Text>
      <HStack
        spacing="8px"
        color="rgba(32, 31, 34, 0.40)"
        mb="16px"
        w="100%"
        px="16px"
      >
        {/* <Box h="1px" bg="rgba(32, 31, 34, 0.40)" flex={1} /> */}
        <Divider />
        <Text fontSize="12px">or</Text>
        <Divider />
        {/* <Box h="1px" bg="rgba(32, 31, 34, 0.40)" flex={1} /> */}
      </HStack>
    </Flex>
  )
}
