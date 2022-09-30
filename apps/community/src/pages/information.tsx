import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  useStyleConfig,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { Avatar } from 'ui'
import { useAccount } from 'hooks'
import { Trans, useTranslation } from 'react-i18next'
import { Container } from '../components/Container'
import { ReactComponent as DownloadSvg } from '../assets/download.svg'
import { TipsPanel } from '../components/TipsPanel'

export const DownloadButton: React.FC<ButtonProps> = () => {
  const { t } = useTranslation('user_information')
  return (
    <Button
      leftIcon={<Icon as={DownloadSvg} w="16px" h="16px" />}
      variant="link"
      fontSize="14px"
      colorScheme="primaryButton"
    >
      {t('download')}
    </Button>
  )
}

export const Information: React.FC = () => {
  const { t } = useTranslation('user_information')
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const account = useAccount()

  return (
    <Container
      as={Grid}
      gridTemplateRows="100%"
      gridTemplateColumns="3fr 1fr"
      gap="20px"
    >
      <Flex
        direction="column"
        align="center"
        {...cardStyleProps}
        w="full"
        h="full"
        p="32px"
      >
        <Heading fontSize="18px" lineHeight="20px" w="full">
          {t('title')}
        </Heading>
        <Center
          w="72px"
          h="72px"
          p="1.5px"
          bg="informationAvatarBackground"
          rounded="full"
          mt="32px"
        >
          <Avatar address={account} w="68.5px" h="68.5px" />
        </Center>
        <VStack as="form" spacing="24px" mt="32px" w="400px" mx="auto">
          <FormControl>
            <FormLabel>{t('name_field')}</FormLabel>
            <Input placeholder={t('name_placeholder')} name="name" />
          </FormControl>
          <FormControl>
            <FormLabel>
              <Trans
                t={t}
                i18nKey="address_field"
                components={{ sup: <sup /> }}
              />
            </FormLabel>
            <Input placeholder={t('address_placeholder')} name="mail_address" />
          </FormControl>
          <FormControl>
            <FormLabel>{t('qr_code')}</FormLabel>
            <Grid
              templateColumns="repeat(2, 1fr)"
              templateRows="100%"
              h="232px"
              gap="8px"
            >
              <Center
                bg="containerBackground"
                border="1px solid"
                borderColor="previewBorder"
                rounded="14px"
                p="16px"
                flexDirection="column"
              >
                <Box w="full" h="full" mb="16px" />
                <DownloadButton mt="auto" />
              </Center>
              <Center
                bg="containerBackground"
                border="1px solid"
                borderColor="previewBorder"
                rounded="14px"
                p="16px"
                flexDirection="column"
              >
                <Box
                  w="full"
                  h="full"
                  mb="16px"
                  bg="informationQrCodeBackground"
                  rounded="8px"
                />
                <DownloadButton mt="auto" />
              </Center>
            </Grid>
          </FormControl>
        </VStack>
      </Flex>
      <TipsPanel />
    </Container>
  )
}
