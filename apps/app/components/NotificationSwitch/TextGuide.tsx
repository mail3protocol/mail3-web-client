import {
  Flex,
  ListItem,
  PopoverBody,
  PopoverHeader,
  UnorderedList,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { Button } from 'ui'
import React from 'react'

export const TextGuide: React.FC<{
  onConfirm?: () => void | Promise<void>
}> = ({ onConfirm }) => {
  const { t } = useTranslation('common')
  return (
    <>
      <PopoverHeader
        fontSize="14px"
        border="none"
        fontWeight="bold"
        textAlign="center"
        p="0"
      >
        {t('bell.title')}
      </PopoverHeader>
      <PopoverBody
        fontSize="12px"
        p="0"
        css={`
          p {
            margin-bottom: 12px;
          }
        `}
      >
        <UnorderedList
          py="16px"
          pr="8px"
          pl="24px"
          bg="rgba(243, 243, 243, 0.5)"
          rounded="16px"
          my="6px"
          mx="0"
          css={`
            li:not(:last-child) {
              margin-bottom: 16px;
            }
          `}
        >
          <Trans
            i18nKey="bell.open_notification_prompt_list"
            t={t}
            components={{
              li: <ListItem />,
            }}
          />
        </UnorderedList>
        <Flex justify="flex-end">
          <Button ml="auto" size="xs" onClick={onConfirm}>
            {t('bell.open_notification_confirm')}
          </Button>
        </Flex>
      </PopoverBody>
    </>
  )
}