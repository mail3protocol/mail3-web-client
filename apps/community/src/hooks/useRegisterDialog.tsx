import { useDialog } from 'hooks'
import { useCallback } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Box, Text, Flex, Button } from '@chakra-ui/react'
import { Logo } from 'ui'
import { APP_URL } from '../constants/env/url'

export function useRegisterDialog() {
  const dialog = useDialog()
  const { t } = useTranslation('hooks')
  return useCallback(
    () =>
      dialog({
        title: t('register_dialog.title'),
        modalProps: {
          size: 'md',
        },
        modalContentProps: {
          width: '450px',
        },
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
              <Button
                as="a"
                colorScheme="blackButton"
                variant="solid-rounded"
                href={`${APP_URL}/message/edit?utm_source=${window.location.hostname}&utm_medium=click_mail_me_button&to=mail3.eth@mail3.me`}
                target="_blank"
                fontWeight="600"
                fontSize="14px"
              >
                <Logo
                  iconProps={{ w: '24px', h: '24px', mr: '6px' }}
                  isHiddenText
                />
                Mail<sup>3 </sup>
                <span> me</span>
              </Button>
            </Flex>
          </>
        ),
      }),
    [t, dialog]
  )
}
