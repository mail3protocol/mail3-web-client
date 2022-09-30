import {
  AddIcon,
  InfoOutlineIcon,
  QuestionOutlineIcon,
  ViewIcon,
} from '@chakra-ui/icons'
import {
  Box,
  Grid,
  Center,
  Avatar,
  Text,
  Flex,
  Heading,
  Tooltip,
  Link,
  List,
  ListItem,
  Icon,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as InsideLink } from 'react-router-dom'
import { Container } from '../components/Container'
import { RoutePath } from '../route/path'
import { ReactComponent as DownloadSvg } from '../assets/download.svg'

interface BaseInfo {
  key: string
  field: ReactNode
  value: ReactNode
}

export const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard')
  const baseInfos: BaseInfo[] = [
    {
      key: 'message',
      field: t('message'),
      value: 0,
    },
    {
      key: 'subscribers',
      field: (
        <>
          {t('subscribers')}
          <Link
            onClick={() => {
              console.log('download')
            }}
          >
            <Icon
              as={DownloadSvg}
              color="primaryTextColor"
              w="16px"
              h="16px"
              ml="5px"
            />
          </Link>
        </>
      ),
      value: 0,
    },
    {
      key: 'new_subscribers',
      field: (
        <>
          {t('new_subscribers')}
          <Tooltip label={t('statistics_time')} hasArrow placement="top">
            <InfoOutlineIcon
              color="primaryTextColor"
              w="14px"
              h="14px"
              mb="2px"
              ml="5px"
            />
          </Tooltip>
        </>
      ),
      value: 10000,
    },
  ]

  return (
    <Container
      as={Grid}
      gap="20px"
      gridTemplateColumns="3fr 1fr"
      gridTemplateRows="132px 1fr"
    >
      <Grid
        bg="cardBackground"
        shadow="card"
        rounded="card"
        fontSize="14px"
        gridTemplateColumns="repeat(4, 1fr)"
        gridTemplateRows="1fr"
        h="full"
      >
        <Center flexDirection="column">
          <Avatar w="48px" h="48px" />
          <Text mt="4px" fontWeight="bold">
            Mail3
          </Text>
        </Center>
        {baseInfos.map((info) => (
          <Flex
            key={info.key}
            direction="column"
            align="flex-start"
            justifyContent="center"
          >
            <Heading as="h4" fontSize="14px" color="secondaryTitleColor">
              {info.field}
            </Heading>
            <Text fontSize="16px" fontWeight="600" mt="4px">
              {typeof info.value === 'number'
                ? info.value.toLocaleString('en-US')
                : info.value}
            </Text>
          </Flex>
        ))}
      </Grid>
      <Flex
        direction="column"
        bg="cardBackground"
        shadow="card"
        rounded="card"
        p="16px"
      >
        <Heading as="h3" fontSize="16px">
          {t('send_message')}
        </Heading>
        <Center
          as={InsideLink}
          to={RoutePath.NewMessage}
          target="_blank"
          w="full"
          mt="20px"
          flex={1}
          borderColor="primary.900"
          color="primary.900"
          borderWidth="2px"
          borderStyle="dashed"
          rounded="14px"
        >
          <AddIcon w="16px" h="16px" />
        </Center>
      </Flex>
      <Box
        bg="cardBackground"
        shadow="card"
        rounded="card"
        gridColumn="1 / 3"
        p="32px"
      >
        <Flex justify="space-between" align="flex-end">
          <Heading as="h2" fontSize="18px" fontWeight="700">
            {t('send_records')}
            <Tooltip label={t('send_records_tooltip')} hasArrow placement="top">
              <QuestionOutlineIcon ml="4px" mb="3px" w="16px" h="16px" />
            </Tooltip>
          </Heading>
          <Link
            color="primary.900"
            fontSize="12px"
            textDecoration="underline"
            fontWeight="500"
          >
            {t('view_all_send_records')}
          </Link>
        </Flex>
        <List mt="24px">
          <ListItem h="52px">
            <Grid
              as="a"
              h="inherit"
              gridTemplateColumns="120px 1fr 80px"
              alignItems="center"
              whiteSpace="nowrap"
              px="16px"
              rounded="8px"
              transition="200ms"
              cursor="pointer"
              _hover={{ shadow: 'listHover', transform: 'scale(1.01)' }}
            >
              <Box fontSize="12px" color="secondaryTitleColor" fontWeight="500">
                2022-05-23
              </Box>
              <Box
                fontSize="16px"
                overflow="hidden"
                noOfLines={1}
                textOverflow="ellipsis"
                display="block"
                fontWeight="600"
              >
                🌟 Mail3 New Feature：See what we bring you in the past two
                weeks ；)
              </Box>
              <Box
                fontSize="12px"
                textAlign="right"
                verticalAlign="middle"
                fontWeight="400"
              >
                <ViewIcon w="16px" h="16px" mr="4px" mb="2px" />
                22,454
              </Box>
            </Grid>
          </ListItem>
        </List>
      </Box>
    </Container>
  )
}
