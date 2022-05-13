import { Text, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'
import { DISCORD_URL, TWITTER_URL } from '../../constants/env'

export const QualificationText: React.FC<{
  isQualified?: boolean
}> = ({ isQualified }) => {
  const { t } = useTranslation('whilelist')
  return isQualified ? (
    <>
      <Text mb={{ base: '20px', md: 0 }}>{t('qualified-text')}</Text>
      <Text fontSize="16px" fontWeight="normal">
        {t('launch-date', {
          date: 'March 8',
        })}
      </Text>
    </>
  ) : (
    <>
      {t('not-qualified-text.0')}
      <NextLink href={TWITTER_URL} passHref>
        <Link textDecoration="underline" fontWeight="bold">
          {t('not-qualified-text.1')}
        </Link>
      </NextLink>
      {t('not-qualified-text.2')}
      <NextLink href={DISCORD_URL} passHref>
        <Link textDecoration="underline" fontWeight="bold">
          {t('not-qualified-text.3')}
        </Link>
      </NextLink>{' '}
      {t('not-qualified-text.4')}
    </>
  )
}
