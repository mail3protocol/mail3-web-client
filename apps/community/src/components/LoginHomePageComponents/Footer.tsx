import { Box, Link, HStack, useToken } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { DiscordIcon, TwitterIcon } from 'ui'
import { DISCORD_URL, TWITTER_URL } from '../../constants/env/url'

export const Footer: React.FC = () => {
  const { t } = useTranslation('login_home_page')
  const [discordColor, twitterColor] = useToken('colors', [
    'otherBrand.discord',
    'otherBrand.twitter',
  ])
  return (
    <HStack
      bg="rainbow"
      pt="24px"
      align="flex-start"
      w="full"
      h="100px"
      color="loginHomePage.background"
      justifyContent="center"
      fontWeight="600"
      fontSize="16px"
      spacing="16px"
    >
      <Box fontWeight="800" fontSize="20px">
        {t('join_community')}
      </Box>
      <Link
        display="flex"
        alignItems="center"
        href={DISCORD_URL}
        target="_blank"
      >
        <DiscordIcon
          hasCircle={false}
          iconColor={discordColor}
          w="30px"
          h="30px"
          transform="scale(1.3)"
          mr="5px"
        />
        {t('join_discord')}
      </Link>
      <Link
        display="flex"
        alignItems="center"
        href={TWITTER_URL}
        target="_blank"
      >
        <TwitterIcon
          hasCircle={false}
          iconColor={twitterColor}
          w="30px"
          h="30px"
          transform="scale(1.3)"
          mr="5px"
        />
        {t('follow_twitter')}
      </Link>
    </HStack>
  )
}
