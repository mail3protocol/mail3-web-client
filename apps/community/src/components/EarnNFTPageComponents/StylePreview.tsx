import {
  Box,
  Button,
  Center,
  Heading,
  Link,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { Grid } from '@chakra-ui/layout'
import { lazy, Suspense, useMemo } from 'react'
import { copyText } from 'shared'
import { useLoginInfo } from 'hooks'
import { subscribeButtonTemplateCode } from './SubscribeButtonTemplateCode'
import { useToast } from '../../hooks/useToast'
import { APP_URL } from '../../constants/env/url'

const CodeEditor = lazy(() => import('../CodeEditor'))

export interface StylePreviewProps {
  isDisabledCopy?: boolean
}

export const StylePreview: React.FC<StylePreviewProps> = ({
  isDisabledCopy,
}) => {
  const { t } = useTranslation(['earn_nft', 'common'])
  const loginInfo = useLoginInfo()
  const code = useMemo(
    () => subscribeButtonTemplateCode(loginInfo?.uuid || ''),
    [loginInfo?.uuid]
  )
  const toast = useToast()

  return (
    <Box bg="cardBackground" shadow="card" rounded="card" p="32px">
      <Heading as="h4" fontSize="18px" lineHeight="20px" mb="8px">
        {t('title')}
      </Heading>
      <Box fontSize="12px" fontWeight="400" mb="24px">
        <Trans
          t={t}
          i18nKey="subscription_style_preview.description"
          components={{
            a: <Link color="primary.900" fontWeight="500" />,
            p: <Text />,
          }}
        />
      </Box>
      <Grid templateColumns="repeat(2, calc(50% - 4px))" gap="8px">
        <Box
          border="1px solid"
          borderColor="earnNftStylePreviewBorder"
          rounded="16px"
        >
          <Box
            borderBottom="1px solid"
            borderColor="earnNftStylePreviewBorder"
            h="52px"
            lineHeight="52px"
            textAlign="center"
            w="full"
            fontSize="14px"
            fontWeight="500"
          >
            {t('subscription_style_preview.preview_subtitle')}
          </Box>
          <Center w="full" h="calc(100% - 53px)">
            <a
              href={`${APP_URL}/subscribe/${loginInfo?.uuid}`}
              target="_blank"
              rel="noreferrer"
              style={
                isDisabledCopy ? { opacity: 0.6, pointerEvents: 'none' } : {}
              }
            >
              <img
                src={`${APP_URL}/images/subscribe-btn.png`}
                alt="subscribe"
                style={{ width: '178px', height: 'auto', margin: 'auto' }}
              />
            </a>
          </Center>
        </Box>
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
            <CodeEditor value={isDisabledCopy ? '' : code} readOnly />
          </Suspense>
        </Box>
        <Center gridColumn="2 / 3">
          <Button
            variant="solid-rounded"
            colorScheme="primaryButton"
            onClick={() => {
              copyText(code).then(() => {
                toast(t('copy_succeed', { ns: 'common' }))
              })
            }}
            isDisabled={isDisabledCopy}
          >
            {t('subscription_style_preview.get_the_code')}
          </Button>
        </Center>
      </Grid>
    </Box>
  )
}
