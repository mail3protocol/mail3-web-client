import { Box, Text, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

export const QualificationText: React.FC<{
  isQualified?: boolean
}> = ({ isQualified }) => (
  <Box
    lineHeight="30px"
    fontSize="20px"
    mt="40px"
    mb="38px"
    textAlign="center"
    position="relative"
    h="150px"
  >
    {isQualified ? (
      <>
        <Text>
          Congratulations! 🎉 you are qualify for beta access to Mail3.
        </Text>
        <Text fontSize="16px">launch date: March 8</Text>
      </>
    ) : (
      <>
        You could not qualify for early access to Mail3 for now. <br />
        There are few spots left, join our{' '}
        <NextLink href="#" passHref>
          <Link textDecoration="underline" fontWeight="bold">
            Discord
          </Link>
        </NextLink>{' '}
        and follow us on{' '}
        <NextLink href="#" passHref>
          <Link textDecoration="underline" fontWeight="bold">
            Twitter
          </Link>
        </NextLink>{' '}
        to get.
      </>
    )}
  </Box>
)
