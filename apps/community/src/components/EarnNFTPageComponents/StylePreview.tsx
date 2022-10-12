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
import { lazy, Suspense, useMemo, useState } from 'react'
import { downloadStringAsFile } from 'shared/src/downloadStringAsFile'
import DOMPurify from 'dompurify'
import {
  subscribeButtonTemplateCode,
  subscribeButtonTemplateCssCode,
} from './SubscribeButtonTemplateCode'

const CodeEditor = lazy(() => import('../CodeEditor'))

export const StylePreview = () => {
  const { t } = useTranslation(['earn_nft', 'common'])
  const [code, setCode] = useState(subscribeButtonTemplateCode(t))
  const secureCode = useMemo(() => DOMPurify.sanitize(code), [code])

  return (
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
        >
          <iframe
            srcDoc={`<style>${subscribeButtonTemplateCssCode}</style>${secureCode}`}
            frameBorder="0"
            title="preview"
            style={{ width: '100%', height: '100%' }}
          />
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
            <CodeEditor value={code} onChange={setCode} />
          </Suspense>
        </Box>
        <Center gridColumn="2 / 3">
          <Button
            variant="solid-rounded"
            colorScheme="primaryButton"
            onClick={() => downloadStringAsFile(code, 'code.html')}
          >
            {t('subscription_style_preview.get_the_code')}
          </Button>
        </Center>
      </Grid>
    </Box>
  )
}
