import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Center, Box, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'
import { BETA_TESTING_DATE_RANGE } from '../constants/env'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'connect',
      'common',
      'index',
    ])),
  },
})

const Home: NextPage = () => {
  const { t } = useTranslation('index')
  const isBetaTesting =
    new Date().getTime() < BETA_TESTING_DATE_RANGE[0].getTime()
  return (
    <Flex direction="column">
      <Center
        bg="linear-gradient(90.02deg, #FFBEBE 0.01%, #FFDC81 31.73%, #D9FF89 58.81%, #C6B2FF 99.99%)"
        minH="44px"
        textAlign="center"
        py="6px"
        px="20px"
      >
        <Box>
          {isBetaTesting ? (
            <>
              {t('heading-banner-text.beta-testing')}
              <NextLink href="/testing">
                <Link
                  fontWeight="bold"
                  textDecoration="underline"
                  display="inline-block"
                >
                  {t('join')}
                </Link>
              </NextLink>
            </>
          ) : (
            <>
              {t('heading-banner-text.white-list')}
              <NextLink href="/whitelist">
                <Link
                  fontWeight="bold"
                  textDecoration="underline"
                  display="inline-block"
                >
                  {t('join_white_list')}
                </Link>
              </NextLink>
            </>
          )}
        </Box>
      </Center>
    </Flex>
  )
}

export default Home
