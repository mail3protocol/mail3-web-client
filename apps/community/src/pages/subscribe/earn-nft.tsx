import { Grid } from '@chakra-ui/layout'
import {
  Box,
  Button,
  Center,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  ListItem,
  OrderedList,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useDialog } from 'hooks'
import { isHttpUriReg } from 'shared'
import { Container } from '../../components/Container'
import { TipsPanel } from '../../components/TipsPanel'
import { useUpdateTipsPanel } from '../../hooks/useUpdateTipsPanel'
import { useAPI } from '../../hooks/useAPI'
import { QueryKey } from '../../api/QueryKey'
import {
  SubscriptionPlatform,
  SubscriptionRewardType,
  SubscriptionState,
} from '../../api/modals/SubscriptionResponse'
import { useToast } from '../../hooks/useToast'
import { GALXE_URL, QUEST3_URL } from '../../constants/env/url'
import { StylePreview } from '../../components/EarnNFTPageComponents/StylePreview'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

function isValidGalaxCampaignUrl(value: string) {
  return isHttpUriReg.test(value) && value.includes('galxe.com')
}

function isValidQuest3CampaignUrl(value: string) {
  return isHttpUriReg.test(value) && value.includes('quest3.xyz')
}

function isValidAccessToken(value: string) {
  return value.length === 32 && /^([a-z]|[A-Z]|[0-9])+$/.test(value)
}

function isValidCredentialId(value: string) {
  return value.length === 18 && /^[0-9]+$/.test(value)
}

interface GalaxState {
  campaignUrl: string
  credentialId: string
  accessToken: string
}

interface Quest3State {
  campaignUrl: string
}

export const EarnNft: React.FC = () => {
  useDocumentTitle('Subscribe To Earn NFT')
  const { t } = useTranslation(['earn_nft', 'common'])
  const api = useAPI()
  const toast = useToast()

  const [campaignUrl, setCampaignUrl] = useState('')
  const [rewardType, setRewardType] = useState(SubscriptionRewardType.NFT)
  const [platform, setPlatform] = useState(SubscriptionPlatform.Galaxy)
  const [credentialId, setCredentialId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [state, setState] = useState(SubscriptionState.Inactive)
  const [isUpdating, setIsUpdating] = useState(false)
  const dialog = useDialog()

  const platformStateMap = useRef(
    new Map<SubscriptionPlatform, GalaxState | Quest3State>()
  )

  const { isLoading, refetch } = useQuery(
    [QueryKey.GetSubscription],
    async () => api.getSubscription().then((r) => r.data),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      cacheTime: 0,
      onSuccess(res) {
        setCampaignUrl(res.campaign_url)
        setRewardType(res.reward_type)
        setPlatform(res.platform)
        setCredentialId(res.credential_id)
        setAccessToken(res.key)
        setState(res.state)
      },
    }
  )

  const isDisabled = isLoading || state === SubscriptionState.Active

  const onUpdateSubscription = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      const body = {
        campaign_url: campaignUrl,
        reward_type: rewardType,
        platform,
        state:
          state === SubscriptionState.Active
            ? SubscriptionState.Inactive
            : SubscriptionState.Active,
        ...(platform === SubscriptionPlatform.Galaxy
          ? {
              credential_id: credentialId,
              key: accessToken,
            }
          : {}),
      }
      await api.updateSubscription(body)
      await refetch()
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t('unknown_error', { ns: 'common' })
      toast(
        t('update_failed', {
          message: errorMessage,
        })
      )
    } finally {
      setIsUpdating(false)
    }
  }

  const onSubmit = () =>
    dialog({
      title:
        state === SubscriptionState.Inactive
          ? t('enable_confirm.title')
          : t('disable_confirm.title'),
      description:
        state === SubscriptionState.Inactive ? (
          <Trans
            t={t}
            i18nKey="enable_confirm.description"
            components={{ p: <Text /> }}
          />
        ) : (
          t('disable_confirm.description')
        ),
      okText:
        state === SubscriptionState.Inactive
          ? t('enable_confirm.confirm')
          : t('disable_confirm.confirm'),
      okButtonProps: {
        colorScheme:
          state === SubscriptionState.Inactive ? 'blackButton' : 'red',
      },
      onConfirm: () => {
        onUpdateSubscription()
      },
    })

  const onChangePlatformWithSyncState = (newPlatform: SubscriptionPlatform) => {
    if (platform === newPlatform) return
    setPlatform(newPlatform)
    if (platform === SubscriptionPlatform.Galaxy) {
      platformStateMap.current.set(platform, {
        campaignUrl,
        credentialId,
        accessToken,
      })
    }
    if (platform === SubscriptionPlatform.Quest3) {
      platformStateMap.current.set(platform, {
        campaignUrl,
      })
    }
    if (newPlatform === SubscriptionPlatform.Galaxy) {
      const newPlatformState = platformStateMap.current.get(newPlatform) as
        | GalaxState
        | undefined
      setCampaignUrl(newPlatformState?.campaignUrl || '')
      setCredentialId(newPlatformState?.credentialId || '')
      setAccessToken(newPlatformState?.accessToken || '')
    }
    if (newPlatform === SubscriptionPlatform.Quest3) {
      const newPlatformState = platformStateMap.current.get(newPlatform) as
        | Quest3State
        | undefined
      setCampaignUrl(newPlatformState?.campaignUrl || '')
    }
  }

  const onUpdateTipsPanel = useUpdateTipsPanel()
  useEffect(() => {
    if (platform === SubscriptionPlatform.Galaxy) {
      onUpdateTipsPanel(
        <Trans
          i18nKey="help"
          t={t}
          components={{
            h3: <Heading as="h3" fontSize="18px" mt="32px" mb="12px" />,
            ul: <UnorderedList />,
            ol: <OrderedList />,
            li: <ListItem fontSize="14px" fontWeight="400" />,
            p: <Text fontSize="14px" fontWeight="400" />,
          }}
        />
      )
    } else {
      onUpdateTipsPanel(null)
    }
  }, [platform])

  const currentIsValidGalaxCampaignUrl =
    platform === SubscriptionPlatform.Galaxy
      ? isValidGalaxCampaignUrl(campaignUrl)
      : false
  const currentIsValidQuest3CampaignUrl =
    platform === SubscriptionPlatform.Quest3
      ? isValidQuest3CampaignUrl(campaignUrl)
      : false
  const currentIsValidCampaignUrl =
    currentIsValidGalaxCampaignUrl || currentIsValidQuest3CampaignUrl
  const currentIsValidCredentialId = isValidCredentialId(credentialId)
  const currentIsValidAccessToken = isValidAccessToken(accessToken)

  const isDisabledSubmit = useMemo(() => {
    if (platform === SubscriptionPlatform.Galaxy)
      return (
        !currentIsValidCampaignUrl ||
        !currentIsValidCredentialId ||
        !currentIsValidAccessToken
      )
    if (platform === SubscriptionPlatform.Quest3)
      return !currentIsValidCampaignUrl
    return false
  }, [
    currentIsValidCampaignUrl,
    currentIsValidCredentialId,
    currentIsValidAccessToken,
    platform,
  ])

  return (
    <Container
      as={Grid}
      gridTemplateColumns="calc(calc(calc(100% - 20px) / 4) * 3) calc(calc(100% - 20px) / 4)"
      gap="20px"
      position="relative"
    >
      <Box
        as={chakra.form}
        bg="cardBackground"
        shadow="card"
        rounded="card"
        p="32px"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
        position="relative"
      >
        {isLoading ? (
          <Center
            w="full"
            h="full"
            bg="loadingOverlayBackground"
            position="absolute"
            top="0"
            left="0"
            zIndex={2}
          >
            <Flex align="center">
              <Spinner mr="6px" w="16px" h="16px" />
              {t('loading', { ns: 'common' })}
            </Flex>
          </Center>
        ) : null}
        <Flex mb="32px">
          <Heading as="h4" fontSize="18px" lineHeight="20px">
            {t('title')}
          </Heading>
          <Flex
            ml="auto"
            color="secondaryTitleColor"
            fontSize="16px"
            fontWeight="500"
            align="center"
          >
            {t('status_field')}
            <Box
              w="8px"
              h="8px"
              bg={
                state === SubscriptionState.Inactive
                  ? 'statusColorDisabled'
                  : 'statusColorEnabled'
              }
              rounded="full"
              ml="8px"
              mr="4px"
              style={{ opacity: isLoading ? 0 : 1 }}
            />
            <Box color="primaryTextColor" w="72px">
              {!isLoading
                ? t(
                    state === SubscriptionState.Inactive
                      ? 'status_value.disabled'
                      : 'status_value.enabled'
                  )
                : t('status_value.loading')}
            </Box>
          </Flex>
        </Flex>
        <VStack spacing="24px" maxW="487px" mb="32px">
          <FormControl>
            <FormLabel>{t('to_earn')}</FormLabel>
            <RadioGroup
              isDisabled={isDisabled}
              value={rewardType}
              onChange={(val) => setRewardType(val as SubscriptionRewardType)}
            >
              <HStack spacing="8px">
                <Radio variant="outline" value={SubscriptionRewardType.NFT}>
                  {t('nft')}
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>{t('distribution_platform')}</FormLabel>
            <RadioGroup
              isDisabled={isDisabled}
              value={platform}
              onChange={(val) =>
                onChangePlatformWithSyncState(val as SubscriptionPlatform)
              }
            >
              <HStack spacing="8px">
                <Radio value={SubscriptionPlatform.Galaxy}>
                  {t('platforms.galaxy')}
                </Radio>
                <Radio value={SubscriptionPlatform.Quest3}>
                  {t('platforms.quest3')}
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl
            isInvalid={!currentIsValidCampaignUrl && campaignUrl !== ''}
          >
            <FormLabel>{t('campaign_link_field')}</FormLabel>
            <Input
              placeholder={t('campaign_link_placeholder')}
              name="campaign_link"
              isDisabled={isDisabled}
              value={campaignUrl}
              onChange={(e) => setCampaignUrl(e.target.value)}
            />
            <FormHelperText whiteSpace="nowrap">
              {platform === SubscriptionPlatform.Galaxy ? (
                <Trans
                  t={t}
                  i18nKey="go_to_galaxy_description"
                  components={{
                    a: (
                      <Link
                        color="primary.900"
                        href={GALXE_URL}
                        target="_blank"
                      />
                    ),
                  }}
                />
              ) : null}
              {platform === SubscriptionPlatform.Quest3 ? (
                <Trans
                  t={t}
                  i18nKey="go_to_quest3_description"
                  components={{
                    a: (
                      <Link
                        color="primary.900"
                        href={QUEST3_URL}
                        target="_blank"
                      />
                    ),
                  }}
                />
              ) : null}
            </FormHelperText>
            <FormErrorMessage>{t('illegal_error_message')}</FormErrorMessage>
          </FormControl>
          {platform === SubscriptionPlatform.Galaxy ? (
            <>
              <FormControl
                isInvalid={!currentIsValidCredentialId && credentialId !== ''}
              >
                <FormLabel>{t('credential_id')}</FormLabel>
                <Input
                  isDisabled={isDisabled}
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder={t('credential_id_placeholder')}
                />
                <FormErrorMessage>
                  {t('illegal_error_message')}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!currentIsValidAccessToken && accessToken !== ''}
              >
                <FormLabel>{t('access_token')}</FormLabel>
                <Input
                  isDisabled={isDisabled}
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder={t('access_token_placeholder')}
                />
                <FormErrorMessage>
                  {t('illegal_error_message')}
                </FormErrorMessage>
              </FormControl>
            </>
          ) : null}
        </VStack>
        {state === SubscriptionState.Active ? (
          <Button
            variant="solid-rounded"
            colorScheme="red"
            type="submit"
            isLoading={isUpdating}
            style={{ opacity: isLoading ? 0 : undefined }}
          >
            {t('disable')}
          </Button>
        ) : (
          <Button
            variant="solid-rounded"
            colorScheme="primaryButton"
            type="submit"
            isLoading={isUpdating}
            isDisabled={isDisabledSubmit}
            style={{ opacity: isLoading ? 0 : undefined }}
          >
            {t('enable')}
          </Button>
        )}
      </Box>
      <TipsPanel gridRow="1 / 3" gridColumn="2 / 3" useSharedContent />
      <StylePreview isDisabledCopy={state === SubscriptionState.Inactive} />
      <div />
    </Container>
  )
}
