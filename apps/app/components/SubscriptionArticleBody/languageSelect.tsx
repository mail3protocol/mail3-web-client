import {
  Box,
  Center,
  chakra,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  RadioProps,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { ReactComponent as ChatSvg } from '../../assets/subscription/chat-icon.svg'
import { ReactComponent as ArrowSvg } from '../../assets/subscription/arrow.svg'
import { ReactComponent as CheckSvg } from '../../assets/subscription/check.svg'
import { ReactComponent as ChatIconBlackSvg } from '../../assets/subscription/chat-icon-black.svg'
import { Query } from '../../api/query'
import { useAPI } from '../../hooks/useAPI'

function CustomRadio(props: { label: string } & RadioProps) {
  const { label, ...radioProps } = props
  const { isDisabled } = radioProps
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio(radioProps)

  return (
    <chakra.label {...htmlProps} cursor={isDisabled ? 'auto' : 'pointer'}>
      <input {...getInputProps({})} hidden />
      <Flex
        {...getCheckboxProps()}
        bg={state.isChecked ? '#F2F2F2' : 'transparent'}
        rounded="4px"
        p="8px"
        h="100%"
        alignItems="center"
      >
        <Center
          {...getLabelProps()}
          fontWeight="400"
          fontSize="14px"
          lineHeight="14px"
          w="full"
        >
          <Text color={isDisabled ? '#A6A6A6' : 'black'}>{label}</Text>
          <Spacer />
          {state.isChecked ? <Icon as={CheckSvg} w="14px" h="14px" /> : null}
        </Center>
      </Flex>
    </chakra.label>
  )
}

interface LanguageSelectProps {
  articleId: string
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  articleId,
}) => {
  const [t] = useTranslation(['subscription-article', 'common'])
  const api = useAPI()

  const [checkMap, setCheckMap] = useState<{
    [key: string]: boolean
  }>({})

  const { data } = useQuery(
    [Query.GetLanguageCode],
    async () => {
      const [languages, languagesState] = await Promise.all([
        api.getLanguageCode().then((r) => r.data.languages),
        api.getTranslationStates(articleId).then((r) => r.data.language_codes),
      ])

      return {
        languages,
        languagesState,
      }
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess({ languagesState }) {
        const newCheckMap = languagesState.reduce((acc, item) => {
          if (item.state === 'done')
            return {
              ...acc,
              [item.language_code]: true,
            }
          return acc
        }, {})
        setCheckMap(newCheckMap)
      },
    }
  )

  const handleChange = (value: string) => {
    console.log(value)
  }

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: 'English',
    onChange: handleChange,
  })

  return (
    <Box>
      <Flex>
        <Center
          fontWeight="700"
          fontSize="14px"
          lineHeight="16px"
          borderRadius="0px 0px 0px 14px"
          bgColor="black"
          color="white"
          p="8px"
        >
          <Icon as={ChatSvg} w="16px" h="16px" mr="2px" /> ChatGPT
        </Center>

        <Popover isLazy matchWidth={false}>
          <PopoverTrigger>
            <Center
              borderRadius="0px 0px 14px 0px"
              fontWeight="510"
              fontSize="14px"
              lineHeight="16px"
              bgColor="#F2F2F2"
              p="8px"
              as="button"
              minW="120px"
            >
              {data?.languages ? (
                <Box>
                  {value} <Icon as={ArrowSvg} w="12px" h="12px" ml="10px" />
                </Box>
              ) : (
                <Spinner w="12px" h="12px" />
              )}
            </Center>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody p="0">
              <Box p="20px 24px 0">
                <Text
                  fontWeight="400"
                  fontSize="12px"
                  lineHeight="16px"
                  color="#737373"
                >
                  {t('current-language')}
                  <Box as="span" fontSize="14px" color="black">
                    {value}
                  </Box>
                </Text>
                <Box m="12px 0" borderBottom="1px solid #F2F2F2" />
                {data?.languages ? (
                  <SimpleGrid
                    columns={2}
                    {...getRootProps()}
                    spacingX="8px"
                    spacingY="5px"
                  >
                    {data.languages.map((item) => {
                      const { language_code: code, language } = item
                      const isDisabled = !checkMap[code]
                      return (
                        <CustomRadio
                          isDisabled={isDisabled}
                          key={code}
                          label={language}
                          {...getRadioProps({ value: language })}
                        />
                      )
                    })}
                  </SimpleGrid>
                ) : null}
                <Box m="12px 0" borderBottom="1px solid #F2F2F2" />
                <CustomRadio
                  key="Original language"
                  label="Original language"
                  {...getRadioProps({ value: 'Original language' })}
                />
              </Box>
              <Center
                mt="16px"
                p="10px 0"
                fontSize="12px"
                lineHeight="14px"
                bgColor="#F2F2F2"
              >
                <Text fontWeight="300" mr="10px">
                  Provided by the
                </Text>
                <ChatIconBlackSvg />
                <Text ml="2px" fontWeight="700">
                  ChatGPT API
                </Text>
              </Center>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Box>
  )
}
