import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'ui'
import styled from '@emotion/styled'
import {
  Box,
  Center,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  Spacer,
  Input,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { Select, GroupBase } from 'chakra-react-select'

import { CloseIcon } from '@chakra-ui/icons'
import { useQuery } from 'react-query'
import { DidFilterModel } from '../../api/didFilterModel'

const ContentWrap = styled(Box)`
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;

  .wrap {
    max-width: 848px;
    margin: 0 auto;
  }

  .h2 {
    font-weight: 700;
    font-size: 16px;
    margin-top: 24px;
    span {
      background: radial-gradient(
        100% 100% at 80% 50%,
        #de1af075 0%,
        rgba(46, 255, 205, 1) 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .rules-area {
    margin-top: 6px;
    min-height: 80px;
    padding: 16px;
    background: #f3f3f3;
    border: 1px solid #e7e7e7;
    border-radius: 16px;
    align-items: baseline;
    justify-content: flex-start;
    flex-wrap: wrap;

    .rule {
      margin-top: 10px;
      border-radius: 39px;
      padding: 7px 10px;
      font-weight: 700;
      font-size: 12px;
      line-height: 18px;

      color: #000000;
    }

    .rule-green {
      background: #95ffbc;
    }

    .rule-purple {
      background: #d8dbff;
    }

    .condition {
      font-weight: 700;
      font-size: 12px;
      padding: 0 10px;
    }
  }

  .area-item {
    margin-top: 24px;

    .small-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 10px;
    }
  }

  .rule-item {
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 16px;
    min-height: 200px;
  }

  .form-wrap {
    padding: 20px;
  }

  @media (max-width: 600px) {
    margin-top: 0px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;

    .h2 {
      margin-top: 16px;
      font-size: 14px;
    }

    .rules-area {
      width: 335px;
      margin: 6px auto;
    }
  }
`

interface SelectOption {
  label: string
  value: string
  icon?: string
}

interface FormItemSelectProps {
  type: DidFilterModel.RuleType
  itemIndex?: number
  ruleId?: string
}

const FormItemSelect: React.FC<FormItemSelectProps> = ({
  type,
  ruleId,
  itemIndex,
}) => {
  const { data, isLoading } = useQuery<Array<string>>(
    [type],
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          const res = ['item1', 'item2', 'item3']
          resolve(res)
        }, 2000)
      }),
    {
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const options = useMemo(
    () =>
      data?.map((item) => ({
        value: item,
        label: item,
      })) ?? [],
    [data]
  )

  const itemName = type
  const domId = `select-${ruleId}-${itemIndex}`

  return (
    <FormControl mt="16px" isRequired>
      <FormLabel htmlFor={domId}>{itemName}</FormLabel>
      <Box>
        <Select<SelectOption, true, GroupBase<SelectOption>>
          name={itemName}
          options={options}
          placeholder="Search or paste address"
          closeMenuOnSelect
          isClearable
          isLoading={isLoading}
          chakraStyles={{
            menu: (provided) => ({
              ...provided,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderWidth: '1px',
              borderColor: '#000',
              _hover: { borderColor: '#000' },
              borderBottomRadius: 'md',
            }),
            menuList: (provided) => ({
              ...provided,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderWidth: 0,
            }),
            control: (provided) => ({
              ...provided,
              borderColor: '#000',
              _hover: { borderColor: '#000' },
            }),
          }}
        />
      </Box>
    </FormControl>
  )
}

const GeneratorItem: React.FC<any> = ({ chain, nft }, { ruleId, onClose }) => {
  const type = DidFilterModel.RuleType.NFT
  let itemIndex = 0

  return (
    <Box>
      <Flex
        p="10px 20px"
        background="#4ADE80"
        borderRadius="16px 16px 0px 0px"
        borderBottom="1px solid #000000"
        color="#fff"
        fontSize="14px"
      >
        <Box fontWeight="700">NFT</Box>
        <Spacer />
        <Box as="button">
          <CloseIcon />
        </Box>
      </Flex>
      <Box className="form-wrap">
        <FormControl isRequired>
          <FormLabel htmlFor={`${type}-${++itemIndex}`}>Chain</FormLabel>
          <Input
            id={`Chain-${itemIndex}`}
            placeholder="Chain"
            value={DidFilterModel.chain.Ethereum}
            pointerEvents="none"
            borderColor="#000000"
          />
        </FormControl>
        <Divider mt="16px" />
        <FormItemSelect type={type} itemIndex={++itemIndex} />
        <FormControl mt="16px" isRequired>
          <FormLabel htmlFor="amount">Minimum amount</FormLabel>
          <NumberInput min={1}>
            <NumberInputField
              id="amount"
              borderColor="#000"
              _hover={{ borderColor: '#000' }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Box>
    </Box>
  )
}

const DidFilter: React.FC = () => {
  const [input, setInput] = useState('')

  const relus = useMemo(() => {
    const relu = {
      type: 'nft',
      desc: '【NFT】Chain：Ethereum；NFT：HAHAHAHA；',
    }
    return [relu, relu, relu]
  }, [])

  const handleInputChange = (e) => {
    console.log(e.target.value)
    setInput(e.target.value)
  }

  return (
    <ContentWrap minH="700px">
      <Box className="wrap">
        <Box pt={{ base: '20px', md: '20px' }} textAlign="center">
          <Box fontSize={{ base: '20px', md: '28px' }} fontWeight="700">
            DID Filter
          </Box>
          <Box className="h2">
            Use <span>Web3 DID</span> to filter senders automaticly
          </Box>
          <Box fontSize="14px">Get emails from who...</Box>
        </Box>
        <Center className="rules-area">
          {relus.length ? (
            relus.map((item, index) => {
              const { desc, type } = item
              return (
                <>
                  <Box className="rule rule-green">
                    【NFT】Chain：Ethereum；NFT：HAHAHAHA；
                  </Box>
                  {index !== relus.length - 1 ? (
                    <Box className="condition">or</Box>
                  ) : null}
                </>
              )
            })
          ) : (
            <Center color="#6F6F6F" width="100%" height="70px">
              No smart filtering logic is currently set
            </Center>
          )}
        </Center>

        <Box className="area-item">
          <Box className="small-title">Requirements logic：</Box>
          <Center
            w="166px"
            h="40px"
            borderRadius="38px"
            background="#4E52F5"
            color="#fff"
          >
            OR
          </Center>
        </Box>

        <Box className="area-item">
          <Box className="small-title">Requirements logic：</Box>
          <Box className="rule-generator-area">
            <Grid templateColumns="repeat(2, minmax(0px, 1fr))" gap="10px">
              <GridItem className="rule-item">
                <GeneratorItem />
              </GridItem>
            </Grid>
          </Box>
        </Box>

        <Center p="50px">
          <Button
            w="138px"
            onClick={() => {
              console.log('save')
            }}
          >
            Save
          </Button>
        </Center>
      </Box>
    </ContentWrap>
  )
}

export default DidFilter
