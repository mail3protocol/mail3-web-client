/* eslint-disable no-nested-ternary */
import {
  Center,
  Flex,
  HStack,
  Link,
  Stack,
  Switch,
  Text,
  VStack,
  Textarea,
  Spinner,
  Checkbox,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useTranslation, Trans } from 'react-i18next'
import React, { useCallback, useState } from 'react'
import { Button } from 'ui'
import {
  GlobalDimensions,
  useAccount,
  useDialog,
  useTrackClick,
  TrackEvent,
  useToast,
} from 'hooks'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { useObservableCallback, useSubscription } from 'observable-hooks'
import { pluck, debounceTime, tap } from 'rxjs/operators'
import { useUpdateAtom } from 'jotai/utils'
import { useAtomValue } from 'jotai'
import { useAPI } from '../../hooks/useAPI'
import { Query } from '../../api/query'
import happySetupMascot from '../../assets/happy-setup-mascot.png'
import unhappySetupMascot from '../../assets/unhappy-setup-mascot.png'
import { ReactComponent as EditSvg } from '../../assets/edit.svg'
import { RoutePath } from '../../route/path'
import { Mascot } from './Mascot'
import { getSigStatus, userPropertiesAtom } from '../../hooks/useLogin'
import { removeMailSuffix } from '../../utils'
import { RouterLink } from '../RouterLink'
import { IS_IPHONE } from '../../constants/utils'
import { CardSignature } from '../CardSignature'

const Container = styled(Center)`
  flex-direction: column;
  width: 100%;

  .label {
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .edit-button {
    position: absolute;
    top: 8px;
    right: 16px;
    color: #4e52f5;
    cursor: pointer;
  }

  .mascot {
    bottom: 0;
    // 240 = content width / 2
    // 164 = mascot width
    // 20 = gutter
    right: calc(50% - 240px - 164px - 20px);
    z-index: 1;
    position: absolute;

    @media (max-width: 1024px) {
      position: static;
      bottom: 50px;
    }

    @media (max-height: 768px) {
      right: 50px;
    }
  }

  .footer {
    display: none;
    @media (max-width: 930px) {
      display: flex;
      margin-top: 10px;
    }
  }
`

const generateCyberConnectLink = (account: string) =>
  `https://app.cyberconnect.me/address/${account}`

export const SettingSignature: React.FC = () => {
  const [t] = useTranslation('settings')
  const account = useAccount()
  const api = useAPI()
  const dialog = useDialog()
  const [isTextEnable, setIsTextEnable] = useState(false)
  const [isCardEnable, setIsCardEnable] = useState(false)
  const [textSignature, setTextSignature] = useState('')
  const trackImageEdit = useTrackClick(TrackEvent.ClickImageSignature)
  const trackCyberConnect = useTrackClick(TrackEvent.ClickCyperConnect)
  const trackNext = useTrackClick(TrackEvent.ClickSignatureNext)
  const setUserInfo = useUpdateAtom(userPropertiesAtom)

  const { isLoading } = useQuery(
    [Query.Signatures, account],
    async () => {
      const { data } = await api.getUserInfo()
      return data
    },
    {
      enabled: !!account,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        setIsCardEnable(d.card_sig_state === 'enabled')
        setIsTextEnable(d.text_sig_state === 'enabled')
        setTextSignature(d.text_signature)
        setUserInfo((prev) => ({
          ...prev,
          user_role: d.user_role,
        }))
      },
    }
  )
  const toast = useToast()
  const userInfo = useAtomValue(userPropertiesAtom)
  const onChangeSignStatus = () => {
    const sigStatus = getSigStatus({
      card_sig_state: isCardEnable ? 'enabled' : 'disabled',
      text_sig_state: isTextEnable ? 'enabled' : 'disabled',
    })
    setUserInfo((prev) => ({
      ...prev,
      [GlobalDimensions.SignatureStatus]: sigStatus,
    }))
  }
  const onChangeSignText = (v: string) => {
    setUserInfo((prev) => ({
      ...prev,
      text_signature: v,
    }))
  }

  const onTextEnableSubscription = useCallback(async () => {
    const prevValue = isTextEnable
    try {
      await api.toggleTextSignature()
      await onChangeSignStatus()
    } catch (error: any) {
      toast(error?.message)
      setIsTextEnable(prevValue)
    }
  }, [isTextEnable])

  const [onTextEnableChange, onTextEnableChange$] = useObservableCallback<
    boolean,
    React.ChangeEvent<HTMLInputElement>
  >((ev$) =>
    ev$.pipe(
      pluck('target', 'checked'),
      tap((b) => {
        setIsTextEnable(b)
      }),
      debounceTime(500)
    )
  )

  useSubscription(onTextEnableChange$, onTextEnableSubscription)

  const onCardEnableSubscription = useCallback(async () => {
    const prevValue = isCardEnable
    try {
      await api.toggleCardSignature()
      onChangeSignStatus()
    } catch (error: any) {
      toast(error?.message)
      setIsCardEnable(prevValue)
    }
  }, [isCardEnable])

  const [onCardEnableChange, onCardEnableChange$] = useObservableCallback<
    boolean,
    React.ChangeEvent<HTMLInputElement>
  >((ev$) =>
    ev$.pipe(
      pluck('target', 'checked'),
      tap((b) => {
        setIsCardEnable(b)
      }),
      debounceTime(500)
    )
  )

  useSubscription(onCardEnableChange$, onCardEnableSubscription)

  const [onTextareaChange, onTextareaChange$] = useObservableCallback<
    string,
    React.ChangeEvent<HTMLTextAreaElement>
  >((event$) => event$.pipe(pluck('target', 'innerHTML'), debounceTime(1000)))

  const onTextSignatureChange = useCallback(
    async (v: string) => {
      try {
        await api.setTextSignature(v)
        onChangeSignText(v)
      } catch (error: any) {
        toast(`The text signature should be less than 1024.`)
      }
    },
    [isTextEnable]
  )

  useSubscription(onTextareaChange$, onTextSignatureChange)
  const router = useLocation()
  return (
    <Container>
      <Stack
        direction="column"
        spacing="32px"
        justifyContent="center"
        maxW="100%"
      >
        <Text fontSize={['14px', '14px', '18px']}>{t('signature.desc')}</Text>
        <VStack spacing="8px" w="100%">
          <Flex className="label">
            <Text fontWeight={600}>{t('signature.text')}</Text>
            {isLoading ? (
              <Spinner />
            ) : IS_IPHONE() ? (
              <Switch
                colorScheme="deepBlue"
                isChecked={isTextEnable}
                onChange={onTextEnableChange}
              />
            ) : (
              <>
                <Switch
                  colorScheme="deepBlue"
                  isChecked={isTextEnable}
                  onChange={onTextEnableChange}
                  display={['none', 'none', 'block']}
                />
                <Checkbox
                  colorScheme="deepBlue"
                  isChecked={isTextEnable}
                  top="2px"
                  onChange={onTextEnableChange}
                  display={['block', 'block', 'none']}
                />
              </>
            )}
          </Flex>
          <Textarea
            as="div"
            contentEditable
            height="auto"
            placeholder="Here is a sample placeholder"
            dangerouslySetInnerHTML={{
              __html: textSignature,
            }}
            value={textSignature}
            onInput={onTextareaChange}
          />
        </VStack>
        <VStack spacing="8px" w="100%">
          <Flex className="label">
            <Text fontWeight={600}>{t('signature.card')}</Text>
            {isLoading ? (
              <Spinner />
            ) : IS_IPHONE() ? (
              <Switch
                colorScheme="deepBlue"
                isChecked={isCardEnable}
                onChange={onCardEnableChange}
              />
            ) : (
              <>
                <Switch
                  colorScheme="deepBlue"
                  isChecked={isCardEnable}
                  onChange={onCardEnableChange}
                  display={['none', 'none', 'block']}
                />
                <Checkbox
                  colorScheme="deepBlue"
                  isChecked={isCardEnable}
                  onChange={onCardEnableChange}
                  top="2px"
                  display={['block', 'block', 'none']}
                />
              </>
            )}
          </Flex>
          <Center
            minH="205px"
            border="1px solid #e7e7e7"
            borderRadius="8px"
            position="relative"
            w="100%"
          >
            <CardSignature
              account={removeMailSuffix(userInfo?.defaultAddress || account)}
            />
            <HStack
              display="none"
              spacing="6px"
              className="edit-button"
              onClick={() => {
                trackImageEdit()
                dialog({
                  type: 'warning',
                  title: t('signature.edit-dialog.title'),
                  description: (
                    <Trans
                      ns="settings"
                      i18nKey="signature.edit-dialog.desc"
                      t={t}
                      components={{
                        a: (
                          <Link
                            isExternal
                            onClick={() => trackCyberConnect()}
                            href={generateCyberConnectLink(
                              removeMailSuffix(
                                userInfo?.defaultAddress || account
                              )
                            )}
                            color="#4E52F5"
                          />
                        ),
                      }}
                    />
                  ),
                })
              }}
            >
              <EditSvg />
              <Text>{t('signature.edit')}</Text>
            </HStack>
          </Center>
        </VStack>
      </Stack>
      {isLoading ? null : (
        <Flex className="mascot">
          <Mascot
            src={
              isCardEnable && isTextEnable
                ? happySetupMascot
                : unhappySetupMascot
            }
          />
        </Flex>
      )}
      {router.pathname !== RoutePath.SettingSignature ? (
        <Center className="footer" w="full">
          <RouterLink href={RoutePath.SetupShare} passHref>
            <Button
              bg="black"
              color="white"
              w="250px"
              height="50px"
              onClick={() => trackNext()}
              _hover={{
                bg: 'brand.50',
              }}
              as="a"
              rightIcon={<ChevronRightIcon color="white" />}
            >
              <Center flexDirection="column">
                <Text>{t('setup.next')}</Text>
              </Center>
            </Button>
          </RouterLink>
        </Center>
      ) : null}
    </Container>
  )
}
