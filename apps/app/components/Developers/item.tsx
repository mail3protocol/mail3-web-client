import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  LinkProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { ReactNode, useMemo } from 'react'
import { GithubIcon, InterestIcon, MirrorIcon, RightArrowIcon } from 'ui'

export const Item: React.FC<{
  title: string
  descriptionBgColor: string
  description: string
  image: string
  links: ReactNode
}> = ({ title, descriptionBgColor, description, image, links, children }) => (
  <Grid
    templateColumns={{ base: 'full', lg: '418px 1fr' }}
    templateRows={{ base: 'min(228px, 1fr) 1fr', lg: 'full' }}
    bg="#F3F3F3"
    rounded="24px"
    p="16px"
    gridColumnGap="42px"
    gridRowGap="10px"
    w="full"
    position="relative"
  >
    <Flex direction="column">
      <Center bg="#fff" borderTopRadius="16px" overflow="hidden">
        <Image
          src={image}
          w="full"
          h="full"
          alt="example"
          objectFit="contain"
        />
      </Center>
      <Box
        borderBottomRadius="16px"
        bg={descriptionBgColor}
        px="14px"
        py="10px"
      >
        <Heading as="h3" fontSize="18px">
          {title}
        </Heading>
        <Text fontSize="12px" mt="7px">
          {description}
        </Text>
      </Box>
    </Flex>
    <VStack
      spacing={{ base: '6px', md: '10px' }}
      fontSize={{ base: '12px', md: '16px' }}
      fontWeight="500"
      css={`
        .item {
          width: 100%;
          display: flex;
          background-color: #fff;
          border-radius: 16px;
          align-items: center;
        }
        .item:hover {
          text-decoration: none;
          transform: scale(1.02);
        }
        .item:active {
          transform: scale(1);
        }
      `}
    >
      {links}
    </VStack>
    {children}
  </Grid>
)

export const ItemLink: React.FC<
  LinkProps & {
    icon: 'github' | 'mirror' | 'interest' | ReactNode
    text: ReactNode
  }
> = ({ icon, text, display, ...props }) => {
  const iconSize = { base: '30px', md: '40px' }
  const iconEl = useMemo(
    () =>
      ({
        github: <GithubIcon w={iconSize} h={iconSize} />,
        mirror: <MirrorIcon w={iconSize} h={iconSize} />,
        interest: <InterestIcon w={iconSize} h={iconSize} />,
      }[icon as string] || icon),
    [icon]
  )
  return (
    <Box w="100%" display={display}>
      <Link
        className="item"
        target="_blank"
        pl={{ base: '10px', md: '24px' }}
        pr={{ base: '10px', md: '20px' }}
        h={{ base: '62px', md: '66px' }}
        position="relative"
        {...props}
      >
        {iconEl}
        <Box ml={{ base: '7px', md: '18px' }}>{text}</Box>
        <RightArrowIcon
          w={{ base: '20px', md: '24px' }}
          h={{ base: '20px', md: '24px' }}
          ml="auto"
        />
      </Link>
    </Box>
  )
}
