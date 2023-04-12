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
  Text,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as ChatSvg } from '../../assets/subscription/chat-icon.svg'
import { ReactComponent as ArrowSvg } from '../../assets/subscription/arrow.svg'
import { ReactComponent as ChatIconBlackSvg } from '../../assets/subscription/chat-icon-black.svg'

const TRANSLATE_LIST = [
  {
    label: 'English',
    id: 0,
  },
  {
    label: '中文',
    id: 1,
  },
  {
    label: '日本語',
    id: 2,
  },
  {
    label: '한국어',
    id: 3,
  },
  {
    label: 'français',
    id: 4,
  },
  {
    label: 'العربية',
    id: 5,
  },
  {
    label: 'español',
    id: 6,
  },
  {
    label: 'português',
    id: 7,
  },
  {
    label: 'Deutsch',
    id: 8,
  },
  {
    label: 'русский',
    id: 9,
  },
  {
    label: 'Bahasa Indonesia',
    id: 10,
  },
  {
    label: 'हिन्दी',
    id: 11,
  },
]

function CustomRadio(props: { label: string } & RadioProps) {
  const { label, ...radioProps } = props
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio(radioProps)

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden />
      <Flex
        {...getCheckboxProps()}
        bg={state.isChecked ? 'green.200' : 'transparent'}
        rounded="4px"
        p="8px"
        h="100%"
        alignItems="center"
      >
        <Text
          {...getLabelProps()}
          fontWeight="400"
          fontSize="14px"
          lineHeight="14px"
        >
          {label}
        </Text>
      </Flex>
    </chakra.label>
  )
}

export const LanguageSelect = () => {
  const [t] = useTranslation(['subscription-article', 'common'])

  const handleChange = (value) => {
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

        <Popover>
          <PopoverTrigger>
            <Center
              borderRadius="0px 0px 14px 0px"
              fontWeight="510"
              fontSize="14px"
              lineHeight="16px"
              bgColor="#F2F2F2"
              p="8px"
              as="button"
            >
              English <Icon as={ArrowSvg} w="12px" h="12px" ml="10px" />
            </Center>
          </PopoverTrigger>
          <PopoverContent w="284px">
            {/* <PopoverArrow /> */}
            {/* <PopoverCloseButton /> */}
            <PopoverBody p="0">
              <Box p="20px 24px 0">
                <Text
                  fontWeight="400"
                  fontSize="12px"
                  lineHeight="16px"
                  color="#737373"
                >
                  {t('current-language')}
                  <Box as="span" fontSize="14px" color="black" ml="4px">
                    {value}
                  </Box>
                </Text>
                <Box m="12px 0" borderBottom="1px solid #F2F2F2" />
                <SimpleGrid
                  columns={2}
                  {...getRootProps()}
                  spacingX="8px"
                  spacingY="5px"
                >
                  {TRANSLATE_LIST.map((item) => {
                    const { id, label } = item
                    return (
                      <CustomRadio
                        key={id}
                        label={label}
                        {...getRadioProps({ value: label })}
                      />
                    )
                  })}
                </SimpleGrid>
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