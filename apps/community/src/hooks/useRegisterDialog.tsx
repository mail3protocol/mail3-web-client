import { useDialog } from 'hooks'
import { useCallback, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import { Logo } from 'ui'
import { APP_URL, HOME_URL } from '../constants/env/url'
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
            href={`${APP_URL}/message/edit?utm_source=${
              window.location.hostname
            }&utm_medium=click_mail_me_button&to=mail3.eth@mail3.me&subject=${t(
              'register_dialog.register_mail_default_subject'
            )}`}
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
    [t]
  )
  const noRegisterMail3Description = useMemo(
    () => (
      <>
        <Text>
          <Trans
            t={t}
            i18nKey="register.no_white_list_description"
            components={{
              sup: <sup />,
              a: <Link target="_blank" href={HOME_URL} color="primary.900" />,
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
            {t('register_dialog.continua')}
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
        description: (
          <>
            {description}
            <div />
          </>
        ),
      })
    },
    [t, dialog]
  )
}
