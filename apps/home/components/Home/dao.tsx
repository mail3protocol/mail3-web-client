import {
  Center,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import Illustration2Svg from '../../assets/svg/illustration/2.svg'
import TwitterIconSvg from '../../assets/svg/socialMedia/twitter.svg'
import MediumIconSvg from '../../assets/svg/socialMedia/medium.svg'
import MirrorIconSvg from '../../assets/svg/socialMedia/mirror.svg'
import DiscordIconSvg from '../../assets/svg/socialMedia/discord.svg'

export const Dao = () => (
  <Center
    w="full"
    h="auto"
    minH={{ base: '667px', md: 'unset' }}
    bg="#000"
    color="#fff"
    px={{ base: '20px', md: '30px' }}
  >
    <Grid
      w="full"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      h="full"
      templateColumns={{
        base: '100%',
        md: '60% 40%',
      }}
      templateRows={{
        base: 'auto auto auto',
        md: '60% 40%',
      }}
      gap={{ base: '20px', md: 0 }}
      textAlign={{
        base: 'center',
        md: 'left',
      }}
      py="64px"
    >
      <Flex
        direction="column"
        pb={{ base: 0, md: '32px' }}
        pt={{ base: '20px', md: '26px' }}
      >
        <Heading
          fontSize="56px"
          lineHeight="56px"
          mb={{ base: '24px', md: '8px' }}
          w="full"
        >
          Mail3 Postoffice
        </Heading>
        <Text
          fontSize={{ base: '18px', md: '24px' }}
          lineHeight={{ base: '24px', md: '30px' }}
          mb="32px"
          fontWeight="300"
          w="full"
        >
          Mail3 Postoffice is the decentralized autonomous organization owned by
          the community to govern the protocol development, the collaboration
          between interested parties, and so on.
        </Text>
      </Flex>
      <Center
        gridRowEnd={{
          base: 'unset',
          md: 'span 2',
        }}
        gridColumn={{
          base: 'unset',
          md: '2',
        }}
      >
        <Icon as={Illustration2Svg} w="full" h="full" m="auto" />
      </Center>
      <VStack justify="end">
        <Heading fontSize="36px" w="full" mb="26px">
          Join Now
        </Heading>
        <Stack
          direction="row"
          fontWeight="500"
          fontSize="20px"
          w="full"
          pb="26px"
          justify={{
            base: 'space-between',
            md: 'start',
          }}
          spacing={{
            base: '30px',
            md: '56px',
          }}
          maxW={{ base: '200px', md: 'unset' }}
        >
          <Link href="#">
            <Icon
              as={TwitterIconSvg}
              w={{ base: '25px', md: '40px' }}
              h="auto"
            />
          </Link>
          <Link href="#">
            <Icon
              as={MediumIconSvg}
              w={{ base: '25px', md: '40px' }}
              h="auto"
            />
          </Link>
          <Link href="#">
            <Icon
              as={MirrorIconSvg}
              w={{ base: '25px', md: '40px' }}
              h="auto"
            />
          </Link>
          <Link href="#">
            <Icon
              as={DiscordIconSvg}
              w={{ base: '25px', md: '40px' }}
              h="auto"
            />
          </Link>
        </Stack>
      </VStack>
    </Grid>
  </Center>
)
