import React, { useMemo, useState } from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer, Button } from 'ui'
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
  Select,
} from '@chakra-ui/react'
import Head from 'next/head'
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons'
import { Navbar } from '../components/Navbar'
import { getAuthenticateProps } from '../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = getAuthenticateProps(
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'filter'])),
    },
  })
)

const NewPageContainer = styled(PageContainer)`
  @media (max-width: 600px) {
    padding: 0;
  }
`

export const ContentWrap = styled(Box)`
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

const Filter: NextPage = () => {
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
    <>
      <Head>
        <title>Mail3: DiD Filter</title>
      </Head>
      <PageContainer>
        <Navbar />
      </PageContainer>
      <NewPageContainer>
        <Box paddingTop={{ base: '25px', md: '35px' }}>
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
                  <Grid
                    templateColumns="repeat(2, minmax(0px, 1fr))"
                    gap="10px"
                  >
                    <GridItem className="rule-item">
                      <Box>
                        <Flex
                          p="10px 20px"
                          background="#4ADE80"
                          borderRadius="16px 16px 0px 0px"
                          borderBottom="1px solid #000000"
                          color="#fff"
                          fontSize="14px"
                        >
                          <Box>NFT</Box>
                          <Spacer />
                          <Box as="button">
                            <CloseIcon />
                          </Box>
                        </Flex>
                        <Box className="form-wrap">
                          <FormControl isRequired>
                            <FormLabel htmlFor="Chain-1">Chain</FormLabel>
                            <Input id="Chain-1" placeholder="Chain" />
                          </FormControl>
                          <Divider />
                          <FormControl>
                            <FormLabel htmlFor="country">Country</FormLabel>
                            <Select
                              icon={<ChevronDownIcon />}
                              id="country"
                              placeholder="Select country"
                            >
                              <option>United Arab Emirates</option>
                              <option>Nigeria</option>
                            </Select>
                          </FormControl>
                          <FormControl isInvalid={!input}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input
                              id="email"
                              type="email"
                              value={input}
                              placeholder="min"
                              onChange={handleInputChange}
                            />
                            {input ? null : (
                              <FormErrorMessage>
                                Email is required.
                              </FormErrorMessage>
                            )}
                          </FormControl>
                        </Box>
                      </Box>
                    </GridItem>

                    <GridItem className="rule-item" />
                  </Grid>
                </Box>
              </Box>

              <Box>
                <Button
                  w="138px"
                  onClick={() => {
                    console.log('save')
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </ContentWrap>
        </Box>
      </NewPageContainer>
    </>
  )
}

export default Filter
