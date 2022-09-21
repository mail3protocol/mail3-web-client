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
  Text,
  Center,
  Skeleton,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'
import { Container } from '../../components/Container'
import { TipsPanel } from '../../components/TipsPanel'
import { useUpdateTipsPanel } from '../../hooks/useUpdateTipsPanel'

const CodeEditor = lazy(() => import('../../components/CodeEditor'))

export const EarnNft: React.FC = () => {
  const { t } = useTranslation('earn_nft')
  const onUpdateTipsPanelContent = useUpdateTipsPanel()

  return (
    <Container
      as={Grid}
      gridTemplateColumns="calc(calc(100% / 3) * 2) calc(100% / 3)"
      gap="20px"
    >
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
      <Box bg="cardBackground" shadow="card" rounded="card" p="32px">
        <Heading as="h4" fontSize="18px" lineHeight="20px" mb="8px">
          {t('title')}
        </Heading>
        <Box fontSize="12px" fontWeight="400" mb="24px">
          <Text>{t('subscription_style_preview.description_1')}</Text>
          <Text>
            <Trans
              t={t}
              i18nKey="subscription_style_preview.description_2"
              components={{ a: <Link color="primary.900" fontWeight="500" /> }}
            />
          </Text>
        </Box>
        <Heading as="h5" fontSize="14px" fontWeight="500" mb="16px">
          {t('subscription_style_preview.preview_subtitle')}
        </Heading>
        <Grid templateColumns="repeat(2, calc(50% - 4px))" gap="8px">
          <Box
            border="1px solid"
            borderColor="earnNftStylePreviewBorder"
            rounded="16px"
          />
          <Box
            bg="earnNftStylePreviewCodeBackground"
            rounded="16px"
            px="20px"
            py="16px"
          >
            <Heading
              as="h6"
              color="earnNftStylePreviewCodeTitle"
              fontSize="12px"
              lineHeight="17px"
              textAlign="center"
              mb="16px"
            >
              {t('subscription_style_preview.customize_the_button')}
            </Heading>
            <Suspense fallback={<Skeleton w="full" h="207px" />}>
              <CodeEditor />
            </Suspense>
          </Box>
          <Center gridColumn="2 / 3">
            <Button
              variant="solid-rounded"
              colorScheme="primaryButton"
              isDisabled
            >
              {t('subscription_style_preview.get_the_code')}
            </Button>
          </Center>
        </Grid>
      </Box>
    </Container>
  )
}
