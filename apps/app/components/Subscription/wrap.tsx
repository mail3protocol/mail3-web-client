import { Box, Center, Flex, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtomValue } from 'jotai'
import { FC } from 'react'
import { ReactComponent as Empty } from '../../assets/subscription/all-empty.svg'
import { Loading } from '../Loading'
import { SubLeftList } from './leftList'
import { SubPreview } from './preview'

const Container = styled(Box)`
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
  top: 170px;
  left: calc((100% - 1200px) / 2);
  right: calc((100% - 1200px) / 2);
  max-width: 1200px;
  bottom: 0;
  position: fixed;

  @media (max-width: 1220px) {
    left: 30px;
    right: 30px;
  }

  @media (max-width: 768px) {
    top: auto;
    left: auto;
    right: auto;
    bottom: auto;
    position: relative;
    box-shadow: none;
    border-top-left-radius: none;
    border-top-right-radius: none;
  }
`

export const SubWrapEmptyAtom = atom(true)
export const SubWrapIsloadingAtom = atom(true)

export const SubWrap: FC = () => {
  const isEmpty = useAtomValue(SubWrapEmptyAtom)
  const isLoading = useAtomValue(SubWrapIsloadingAtom)

  return (
    <Container>
      {isLoading ? (
        <Flex h="100%">
          <Loading />
        </Flex>
      ) : (
        <Flex h="100%" display={!isEmpty ? 'none' : 'flex'}>
          <Center minH="200px" w="100%">
            <Box>
              <Empty />
              <Text mt="10px">No new update here for now</Text>
            </Box>
          </Center>
        </Flex>
      )}

      <Flex h="100%" display={isEmpty ? 'none' : 'flex'}>
        <SubLeftList />
        <SubPreview isSingleMode={false} />
      </Flex>
    </Container>
  )
}
