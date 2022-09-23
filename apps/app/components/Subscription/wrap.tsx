import { Box, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { FC } from 'react'
import { SubLeftList } from './leftList'
import { SubPreview } from './preview'

const Container = styled(Box)`
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
  top: 170px;
  left: 30px;
  right: 30px;
  bottom: 0;
  position: fixed;

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

export const SubWrap: FC = () => (
  <Container>
    <Flex h="100%">
      <SubLeftList />
      <SubPreview />
    </Flex>
  </Container>
)
