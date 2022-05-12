import NextLink from 'next/link'
import React from 'react'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/react'
import { APP_URL, DISCORD_URL, TWITTER_URL } from '../../constants/env'

export interface FooterProps {
  isQualified?: boolean
}

export const FooterText: React.FC<FooterProps> = ({ isQualified }) => {
  const { t } = useTranslation('testing')
  return isQualified ? (
    <>
      <NextLink href={APP_URL}>
        <Link display="block" textDecoration="underline" color="#4E52F5">
          {t('launch-app-link')}
        </Link>
      </NextLink>
      <NextLink href={DISCORD_URL}>
        <Link display="block" textDecoration="underline" color="#4E52F5">
          {t('discord-link')}
        </Link>
      </NextLink>
    </>
  ) : (
    <>
      {t('join_whitelist_tips.0')}
      <NextLink href={DISCORD_URL}>
        <Link textDecoration="underline" color="#4E52F5">
          {t('join_whitelist_tips.1')}
        </Link>
      </NextLink>
      {t('join_whitelist_tips.2')}
      <NextLink href={TWITTER_URL}>
        <Link textDecoration="underline" color="#4E52F5">
          {t('join_whitelist_tips.3')}
        </Link>
      </NextLink>
      {t('join_whitelist_tips.4')}
    </>
  )
}
