import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Link,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { Alias } from 'models'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import RefreshSvg from '../../assets/refresh.svg'
import { ReactComponent as ArrawSvg } from '../../assets/setup/arrow.svg'
import {
  EmailSwitch,
  EmailSwitchProps,
  generateEmailAddress,
} from './SettingAddress'

export type SubBitAlias = {
  full: Alias
  short: Alias | null
}

interface SwitchPanelProps {
  isLoading: boolean
  list: Alias[] | SubBitAlias[]
  onChange: EmailSwitchProps['onChange']
  activeAccount: string
  emptyNode: JSX.Element
  onRefresh: () => Promise<void>
  register?: {
    i18nKey: string
    onClick: () => void
    href: string
  }
}

const LIMIT_MAX_NUMBER = 5

interface EmailSwitchSubBitProps {
  activeAccount: string
  data: SubBitAlias
  onChange: EmailSwitchProps['onChange']
}

export const EmailSwitchSubBit: React.FC<EmailSwitchSubBitProps> = ({
  onChange,
  data,
  activeAccount,
}) => {
  const [isFull, setIsFull] = useState(data.full.uuid === activeAccount)
  const isAllowShort = !!data.short
  const shortData = data.short ? data.short : data.full
  const isChecked = [data.full.uuid, shortData.uuid].includes(activeAccount)

  const item = isFull ? data.full : shortData

  const onSwitch = () => {
    const currentState = !isFull
    setIsFull(currentState)
    const currentData = currentState ? data.full : shortData
    onChange(currentData.uuid, currentData.address)({} as any)
  }

  if (!item) return null

  return (
    <EmailSwitch
      uuid={item.uuid}
      address={item.address}
      emailAddress={generateEmailAddress(item.address)}
      account={item.address}
      onChange={onChange}
      key={item.address}
      isChecked={isChecked}
      isAllowShort={isAllowShort}
      onSwitch={onSwitch}
      isFullName={isFull}
    />
  )
}

export const SwitchPanel: React.FC<SwitchPanelProps> = ({
  isLoading,
  list,
  emptyNode,
  onChange,
  activeAccount,
  onRefresh,
  register,
}) => {
  const [t] = useTranslation('settings')
  const { isOpen, onOpen } = useDisclosure()
  const renderList = isOpen ? list : list.slice(0, LIMIT_MAX_NUMBER)
  const {
    isOpen: isRefreshing,
    onOpen: startRefreshing,
    onClose: stopRefreshing,
  } = useDisclosure()
  if (isLoading) return null

  return (
    <Box className="switch-wrap">
      <Box p="16px 8px 16px 8px">
        {!list.length ? emptyNode : null}

        <VStack spacing="10px">
          {renderList.map((a) => {
            if ('full' in a) {
              return (
                <EmailSwitchSubBit
                  key={a.full.address}
                  data={a}
                  onChange={onChange}
                  activeAccount={activeAccount}
                />
              )
            }

            return (
              <EmailSwitch
                uuid={a.uuid}
                address={a.address}
                emailAddress={generateEmailAddress(a.address)}
                account={a.address}
                onChange={onChange}
                key={a.address}
                isChecked={a.uuid === activeAccount}
              />
            )
          })}
        </VStack>
        {list.length > LIMIT_MAX_NUMBER && !isOpen ? (
          <Center
            cursor="pointer"
            pt="8px"
            fontSize="12px"
            lineHeight="18px"
            onClick={onOpen}
          >
            <ArrawSvg />
            <Box ml="2px">{` +${list.length - LIMIT_MAX_NUMBER}`}</Box>
          </Center>
        ) : null}
      </Box>
      <Flex h="44px" bg="#fff" p="0 18px">
        <Button
          variant="link"
          colorScheme="deepBlue"
          leftIcon={<Image src={RefreshSvg} w="14px" h="14px" />}
          onClick={async () => {
            startRefreshing()
            await onRefresh()
            stopRefreshing()
          }}
          isLoading={isRefreshing}
          fontWeight="400"
          fontSize="16px"
        >
          {t('address.refresh')}
        </Button>
        <Spacer />
        {register ? (
          <Center alignItems="center">
            <Text fontSize="14px" fontWeight={500}>
              <Stack
                direction="row"
                spacing="16px"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Box fontSize={['11px', '14px', '14px']}>
                  <Trans
                    ns="settings"
                    i18nKey={register.i18nKey}
                    t={t}
                    components={{
                      a: (
                        <Link
                          isExternal
                          onClick={register.onClick}
                          href={register.href}
                          color="#4E52F5"
                        />
                      ),
                    }}
                  />
                </Box>
              </Stack>
            </Text>
          </Center>
        ) : null}
      </Flex>
    </Box>
  )
}
