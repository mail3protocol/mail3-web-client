import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  Textarea,
  useToken,
  Text,
  Link,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import React, { useRef, useState } from 'react'
import { useDialog } from 'hooks'
import { useQuery } from 'react-query'
import { Container } from '../../components/Container'
import { Content, Menus, StateProvider } from '../../components/Editor'
import { SubjectInput } from '../../components/NewMessagePageComponents/SubjectInput'
import { PreviewButton } from '../../components/NewMessagePageComponents/PreviewButton'
import { PreviewSimulator } from '../../components/NewMessagePageComponents/PreviewSimulator'
import { SendButton } from '../../components/NewMessagePageComponents/SendButton'
import { MAIL_CONTENT_IMAGE_QUOTA_KB } from '../../constants/env/config'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { ReactComponent as PremiumIconSvg } from '../../assets/Premium/diamond.svg'
import { MessageType } from '../../api/modals/MessageListResponse'
import { PREMIUM_DOCS_URL } from '../../constants/env/url'
import { QueryKey } from '../../api/QueryKey'
import { useAPI } from '../../hooks/useAPI'
import { UserPremiumSettingState } from '../../api/modals/UserPremiumSetting'

const ABSTRACT_MAX_LENGTH = 156

export const NewMessage = () => {
  useDocumentTitle('New Message')
  const { t } = useTranslation('new_message')
  const [subjectText, setSubjectText] = useState('')
  const [abstract, setAbstract] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [currentPreviewContent, setCurrentPreviewContent] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const fileMapRef = useRef<Map<string, File>>(new Map())
  const fileCacheMapRef = useRef<Map<string, string>>(new Map())
  const [count, setCount] = useState(0)
  const [messageType, setMessageType] = useState<MessageType>(
    MessageType.Normal
  )
  const colorPremium100 = useToken('colors', 'premium.100')
  const colorPremium500 = useToken('colors', 'premium.500')
  const api = useAPI()
  const { data } = useQuery([QueryKey.GetUserPremiumSettings], async () =>
    api.getUserPremiumSettings().then((res) => res.data)
  )
  const isConfiguredPremium = data?.state === UserPremiumSettingState.Enabled
  const dialog = useDialog()

  const uploadImageGuard = (file: File) => {
    const currentSize = Array.from(
      new Set(
        Array.from(
          contentRef.current?.shadowRoot?.querySelectorAll('img') || []
        ).map((img) => img.src)
      )
    )
      .map((src) => fileMapRef.current.get(src) as File)
      .filter((f) => f)
      .reduce((acc, f) => acc + f.size, 0)
    if (currentSize + file.size > MAIL_CONTENT_IMAGE_QUOTA_KB * 1024) {
      throw new Error(
        t('mail_image_limit', {
          size: `${MAIL_CONTENT_IMAGE_QUOTA_KB / 1024}MB`,
        })
      )
    }
  }

  const onUploadImageCallback = (file: File, url: string) => {
    fileMapRef.current.set(url, file)
    fileCacheMapRef.current.set(
      file.name + file.size + file.size + file.lastModified,
      url
    )
  }

  const getImageUrlCache = (file: File) =>
    fileCacheMapRef.current.get(
      file.name + file.size + file.size + file.lastModified
    )

  const onChangeMessageType = (type: MessageType) => {
    if (!isConfiguredPremium && type === MessageType.Premium) {
      dialog({
        title: t('did_not_enable_premium'),
        description: (
          <Trans
            t={t}
            i18nKey="what_is_the_premium"
            components={{
              h4: (
                <Heading
                  as="h4"
                  fontWeight={600}
                  fontSize="16px"
                  lineHeight="22px"
                />
              ),
              p: <Text fontWeight={500} fontSize="16px" lineHeight="22px" />,
              a: (
                <Link
                  href={PREMIUM_DOCS_URL}
                  target="_blank"
                  textDecoration="underline"
                  color="primary.900"
                />
              ),
            }}
          />
        ),
        okText: t('ok'),
      })
      return
    }
    setMessageType(type as MessageType)
  }

  return (
    <Container as={Flex} flexDirection="column">
      <StateProvider
        placeholder={t('editor_placeholder')}
        as={Flex}
        flexDirection="column"
        flex={1}
        onChangeTextLengthCallback={setCount}
      >
        <Flex
          h="56px"
          align="center"
          bg="cardBackground"
          shadow="card"
          rounded="card"
          py="16px"
          px="36px"
          fontSize="16px"
          fontWeight={500}
          color="primaryTextColor"
          _selection={{
            bg: 'premium.500',
          }}
          style={{
            backgroundColor:
              messageType === MessageType.Premium ? colorPremium100 : undefined,
            color:
              messageType === MessageType.Premium ? colorPremium500 : undefined,
          }}
        >
          <Icon
            as={PremiumIconSvg}
            w="24ppx"
            h="24px"
            mr="10px"
            style={{
              opacity: messageType === MessageType.Premium ? 1 : 0.2,
            }}
          />
          {messageType === MessageType.Premium
            ? t('premium_switch_help_text')
            : t('general_help_text')}
          <Flex ml="auto">
            <RadioGroup onChange={onChangeMessageType} value={messageType}>
              <HStack spacing="24px">
                <Radio colorScheme="primary" value={MessageType.Premium}>
                  {t('premium')}
                </Radio>
                <Radio colorScheme="primary" value={MessageType.Normal}>
                  {t('general')}
                </Radio>
              </HStack>
            </RadioGroup>
          </Flex>
        </Flex>
        <Flex
          bg="cardBackground"
          shadow="card"
          rounded="card"
          px="24px"
          py="32px"
          mt="20px"
          flex={1}
          flexDirection="column"
        >
          {isPreview ? (
            <PreviewSimulator
              subject={subjectText}
              html={currentPreviewContent}
            />
          ) : null}
          <Box
            flex={1}
            style={
              isPreview
                ? {
                    position: 'fixed',
                    top: '-100%',
                    left: '-100%',
                    pointerEvents: 'none',
                    opacity: 0,
                  }
                : undefined
            }
          >
            <SubjectInput
              onChange={(e) => setSubjectText(e.target.value)}
              value={subjectText}
            />
            <Divider as="hr" mt="20px" />
            <Menus
              imageButtonProps={{
                uploadImageGuard,
                onUploadImageCallback,
                getImageUrlCache,
              }}
            />
            <Content mt="4px" flex={1} ref={contentRef} />
          </Box>
        </Flex>

        {!isPreview ? (
          <FormControl
            p="32px 24px"
            h="217px"
            bg="cardBackground"
            shadow="card"
            rounded="card"
            mt="20px"
          >
            <FormLabel>Abstract</FormLabel>
            <Textarea
              resize="none"
              h="120px"
              value={abstract}
              maxLength={ABSTRACT_MAX_LENGTH}
              fontSize="14px"
              fontWeight="500"
              lineHeight="20px"
              onChange={({ target: { value } }) => setAbstract(value)}
            />
            <Box
              whiteSpace="nowrap"
              fontSize="14px"
              color="secondaryTextColor"
              position="absolute"
              bottom="40px"
              right="40px"
              zIndex={99}
              textDecorationLine="underline"
            >
              {abstract.length} / {ABSTRACT_MAX_LENGTH}
            </Box>
          </FormControl>
        ) : null}

        <HStack
          p="16px"
          justify="flex-end"
          mt="20px"
          bg="cardBackground"
          shadow="card"
          rounded="card"
        >
          <PreviewButton
            isPreview={isPreview}
            onClick={(e, content) => {
              setIsPreview((p) => !p)
              setCurrentPreviewContent(content)
            }}
            w="138px"
            h="40px"
          />
          <SendButton
            abstract={abstract}
            subject={subjectText}
            isDisabled={count === 0}
            messageType={messageType}
            h="40px"
          />
        </HStack>
      </StateProvider>
    </Container>
  )
}
