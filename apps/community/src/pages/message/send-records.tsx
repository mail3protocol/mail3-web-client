import {
  BoxProps,
  Flex,
  Grid,
  Heading,
  useStyleConfig,
  Box,
  VStack,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Container } from '../../components/Container'
import { NewMessageLinkButton } from '../../components/NewMessageLinkButton'
import { SentRecordItem } from '../../components/SentRecordItem'

export const SendRecords: React.FC = () => {
  const { t } = useTranslation('send_message')
  const cardStyleProps = useStyleConfig('Card') as BoxProps

  return (
    <Container
      as={Grid}
      gridTemplateColumns="100%"
      gridTemplateRows="132px auto"
      gap="20px"
    >
      <Flex direction="column" p="16px" {...cardStyleProps}>
        <Heading as="h3" fontSize="16px">
          {t('new_message')}
        </Heading>
        <NewMessageLinkButton />
      </Flex>
      <Box {...cardStyleProps} p="32px">
        <Heading as="h2" fontSize="18px" fontWeight="700">
          {t('title')}
        </Heading>
        <VStack spacing="2px" mt="24px" w="full">
          {new Array(100).fill(0).map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={i} h="52px" w="full">
              <SentRecordItem
                time="2022-05-23"
                subject="🌟 Mail3 New Feature：See what we bring you in the past two
                weeks ；)"
                viewCount={22454}
              />
            </Box>
          ))}
        </VStack>
      </Box>
    </Container>
  )
}
