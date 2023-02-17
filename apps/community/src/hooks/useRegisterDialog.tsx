import { useDialog } from 'hooks'
import { useCallback, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { APP_URL, APPLY_FOR_REGISTER_URL } from '../constants/env/url'
import { ErrorCode } from '../api/ErrorCode'

export function useRegisterDialog() {
  const dialog = useDialog()
  const { t } = useTranslation('hooks')
  const defaultDescription = useMemo(
    () => (
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
            href={APPLY_FOR_REGISTER_URL}
            target="_blank"
            fontWeight="600"
            fontSize="14px"
          >
            {t('register_dialog.apply')}
          </Button>
        </Flex>
      </>
    ),
    [t]
  )
  const noRegisterMail3Description = useMemo(
    () => (
      <>
        <Text>
          <Trans
            t={t}
            i18nKey="register_dialog.no_white_list_description"
            components={{
              sup: <sup />,
            }}
          />
        </Text>
        <Flex align="center" justify="flex-end" mt="24px">
          <Button
            as="a"
            colorScheme="blackButton"
            variant="solid-rounded"
            href={APP_URL}
            target="_blank"
            fontWeight="600"
            fontSize="14px"
          >
            {t('register_dialog.continue')}
          </Button>
        </Flex>
      </>
    ),
    [t]
  )

  return useCallback(
    (options?: { reason: ErrorCode }) => {
      const description =
        (
          {
            [ErrorCode.USER_NOT_FOUND]: noRegisterMail3Description,
            [ErrorCode.ADDRESS_NOT_FOUND]: noRegisterMail3Description,
            [ErrorCode.COMMUNITY_ADDRESS_NOT_IN_WHITELIST]: defaultDescription,
          } as { [key in string]: JSX.Element }
        )[options?.reason || ErrorCode.USER_NOT_FOUND] ||
        noRegisterMail3Description

      return dialog({
        title: t('register_dialog.title'),
        modalProps: {
          size: 'md',
        },
        modalContentProps: {
          width: '450px',
        },
        description,
      })
    },
    [t, dialog]
  )
}
