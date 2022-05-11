import {
  Box,
  Center,
  Flex,
  FlexProps,
  Heading,
  Icon,
  Image,
  Text,
} from '@chakra-ui/react'
import { Button, CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import HomeGridBgSvgPath from '../../assets/svg/home-grid-bg.svg?url'
import Illustration1Svg from '../../assets/svg/illustration/1.svg'
import ArrowRightSvg from '../../assets/svg/illustration/arrow-right.svg'
import ArrowLeftSvg from '../../assets/svg/illustration/arrow-left.svg'
import Illustration1Png from '../../assets/png/illustration/1.png'
import Illustration3Png from '../../assets/png/illustration/3.png'
import { isWhiteListStage } from '../../utils/whitelist'

export const Banner: React.FC<FlexProps> = ({ ...props }) => {
  const inWhiteListStage = isWhiteListStage()
  return (
    <Flex
      direction="column"
      align="center"
      h="calc(100vh - 60px)"
      position="relative"
      px="20px"
      {...props}
    >
      <Image
        src={HomeGridBgSvgPath}
        objectFit="cover"
        objectPosition="center bottom"
        w="full"
        h="full"
        position="absolute"
      />
      <Flex
        direction="column"
        h="full"
        w="full"
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        position="relative"
      >
        <Box flex={1} position="relative" mt="28px">
          <Icon
            w="150px"
            as={Illustration1Svg}
            h="auto"
            position="absolute"
            top="0"
            left="0"
            transform={{
              base: 'unset',
              md: 'translateY(70px)',
            }}
          />
          <Image
            src={Illustration1Png.src}
            w={{ base: 'auto', md: '181px' }}
            h={{ base: 'full', md: 'auto' }}
            position="absolute"
            top="0"
            right="0"
            transform={{
              base: 'unset',
              md: 'translateY(70px)',
            }}
          />
        </Box>
        <Box position="relative" w="full" my="auto" flex={1}>
          <Heading
            fontSize={{ base: '24px', md: '48px' }}
            textAlign="center"
            lineHeight={{ base: '30px', md: '60px' }}
          >
            Communicate everyone <br /> in web3.0
          </Heading>
          <Heading
            mt="16px"
            fontSize={{ base: '16px', md: '24px' }}
            textAlign="center"
            fontWeight="normal"
            mb="57px"
          >
            Crypto native generation deserve a better mail protocol
          </Heading>
          <Flex justify="center" align="center">
            <Icon
              as={ArrowRightSvg}
              w={{ base: '52px', md: '83px' }}
              h="auto"
            />
            <Box mx={{ base: '21px', md: '34px' }} transition="200ms">
              {inWhiteListStage ? (
                <Button>Whitelist</Button>
              ) : (
                <Button>Connect Wallet</Button>
              )}
            </Box>
            <Icon as={ArrowLeftSvg} w={{ base: '52px', md: '83px' }} h="auto" />
          </Flex>
          <Text textAlign="center" mt="15px" fontSize="14px">
            Connect your wallet to use @mail3.me
          </Text>
        </Box>
        <Box flex={1} position="relative">
          <Image
            src={Illustration3Png.src}
            position="absolute"
            w="162px"
            bottom="40px"
            left="-30px"
          />
        </Box>
      </Flex>
    </Flex>
  )
}
