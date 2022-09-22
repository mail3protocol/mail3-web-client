import { useDialog } from 'hooks'
import { useCallback } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Box, Text, Flex } from '@chakra-ui/react'
import '@mail3/mail3-me'

export function useRegisterDialog() {
  const dialog = useDialog()
  const { t } = useTranslation('hooks')
  return useCallback(
    () =>
      dialog({
        title: t('register_dialog.title'),
        description: (
          <>
            <Text>
              <Trans
                t={t}
                i18nKey="register_dialog.description"
                components={{
                  sup: <sup />,
                  span: <Box as="span" color="primary.900" />,
                }}
              />
            </Text>
            <Flex align="center" justify="flex-end" mt="24px">
              <mail3-me
                css={`
                  line-height: 14px;
                  font-weight: 700;
                  font-size: 14px;
                  border-radius: 40px;
                  padding: 13px 22px;
                  white-space: nowrap;
                `}
              />
            </Flex>
          </>
        ),
      }),
    [t, dialog]
  )
}
