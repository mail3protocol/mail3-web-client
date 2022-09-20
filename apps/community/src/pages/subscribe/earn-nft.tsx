import { Grid } from '@chakra-ui/layout'
import {
  Box,
  Button,
  chakra,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  VStack,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { Container } from '../../components/Container'
import { TipsPanel } from '../../components/TipsPanel'
import { useUpdateTipsPanel } from '../../hooks/useUpdateTipsPanel'

export const EarnNft: React.FC = () => {
  const { t } = useTranslation('earn_nft')
  const onUpdateTipsPanelContent = useUpdateTipsPanel()

  return (
    <Container as={Grid} gridTemplateColumns="2fr 1fr" gap="20px">
      <Box
        as={chakra.form}
        bg="cardBackground"
        shadow="card"
        rounded="card"
        p="32px"
        onSubmit={(event) => {
          event.preventDefault()
          console.log((event.target as HTMLFormElement).campaign_link)
        }}
      >
        <Box mb="32px">
          <Heading as="h4" fontSize="18px" lineHeight="20px">
            {t('title')}
          </Heading>
        </Box>
        <VStack spacing="24px" maxW="487px" mb="32px">
          <FormControl>
            <FormLabel>{t('to_earn')}</FormLabel>
            <Checkbox variant="outline">{t('nft')}</Checkbox>
          </FormControl>
          <FormControl>
            <FormLabel>{t('distribution_platform')}</FormLabel>
            <HStack spacing="8px">
              <Checkbox variant="outline">{t('platforms.galaxy')}</Checkbox>
              <Checkbox variant="outline">{t('platforms.quest3')}</Checkbox>
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel>{t('campaign_link_field')}</FormLabel>
            <Input
              placeholder={t('campaign_link_placeholder')}
              name="campaign_link"
              onFocus={() =>
                onUpdateTipsPanelContent(
                  `current is: ${t('campaign_link_field')}`
                )
              }
            />
            <FormHelperText whiteSpace="nowrap">
              <Trans
                t={t}
                i18nKey="go_to_galaxy_description"
                components={{ a: <Link color="primary.900" /> }}
              />
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>{t('credential_id')}</FormLabel>
            <Input
              w="150px"
              onFocus={() =>
                onUpdateTipsPanelContent(`current is: ${t('credential_id')}`)
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('credential_key')}</FormLabel>
            <Input w="150px" />
          </FormControl>
        </VStack>
        <Button
          variant="solid-rounded"
          colorScheme="primaryButton"
          type="submit"
        >
          {t('enable')}
        </Button>
      </Box>
      <TipsPanel gridRow="1 / 3" gridColumn="2 / 3" useSharedContent />
      <Box bg="cardBackground" shadow="card" rounded="card" h="506px" />
    </Container>
  )
}
