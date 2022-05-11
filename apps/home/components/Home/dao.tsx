import {
  Center,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  VStack,
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
    h={{
      base: 'calc(100vh - 60px - 174px)',
      md: '472px',
    }}
    minH={{ base: '607px', md: 'unset' }}
    bg="#000"
    color="#fff"
    px="20px"
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
        base: 'auto calc(100% - 264px) auto',
        md: '60% 40%',
      }}
      textAlign={{
        base: 'center',
        md: 'left',
      }}
    >
      <VStack pb={{ base: 0, md: '32px' }} pt={{ base: '20px', md: '26px' }}>
        <Heading
          fontSize={{
            base: '48px',
            md: '96px',
          }}
          mb="8px"
          h={{ base: '48px', md: '100px' }}
          whiteSpace="nowrap"
          w="full"
        >
          Mail3 DAO
        </Heading>
        <Text
          fontSize={{ base: '14px', md: '32px' }}
          lineHeight={{ base: '20px', md: '36px' }}
          mb="32px"
          fontWeight="300"
          w="full"
        >
          We are creating Mail3 DAO <br />
          for everyone rocket 🚀🚀🚀
        </Text>
      </VStack>
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
