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
import { Trans, useTranslation } from 'react-i18next'
import RefreshSvg from '../../assets/refresh.svg'
import { ReactComponent as ArrawSvg } from '../../assets/setup/arrow.svg'
import {
  EmailSwitch,
  EmailSwitchProps,
  generateEmailAddress,
} from './SettingAddress'

interface SwitchPanelProps {
  isLoading: boolean
  list: Alias[]
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
  const renderList = list.slice(0, LIMIT_MAX_NUMBER)
  const { isOpen, onOpen } = useDisclosure()
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
          {renderList.map((a) => (
            <EmailSwitch
              uuid={a.uuid}
              address={a.address}
              emailAddress={generateEmailAddress(a.address)}
              account={a.address}
              onChange={onChange}
              key={a.address}
              isChecked={a.uuid === activeAccount}
            />
          ))}
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
