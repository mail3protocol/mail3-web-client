import { Box, Center, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import styled from '@emotion/styled'
import QrCode from 'qrcode.react'
import { Avatar, Button } from 'ui'
import LogoSvg from 'assets/svg/logo-pure.svg'

import SvgEtherscan from '../../assets/profile/business/etherscan.svg'
import SvgArrow from '../../assets/profile/business/arrow.svg'
import SvgMailme from '../../assets/profile/mail-me.svg'

interface ShareCardProps {
  address: string
  mailAddress: string
}

const Container = styled(Box)`
  background: #fff;
  height: 566px;
  width: 375px;
  top: 10px;
  left: 10px;
  position: absolute;
  border-radius: 20px;
  border: 1px solid red;

  .address {
    margin-top: 15px;
    background: #f3f3f3;
    border-radius: 16px;
    padding: 13px;
    text-align: center;

    .p {
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 1;
    }
  }

  .qrCode {
    left: 50%;
    bottom: 116px;
    transform: translateX(-50%);
    position: absolute;
  }

  .button {
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
  }
`

export const ShareCard: React.FC<ShareCardProps> = ({
  address,
  mailAddress,
}) => (
  <Container>
    <Center flexDirection="column">
      <Box pt="20px">
        <LogoSvg />
      </Box>
      <Box mt="35px">
        <Avatar address={address} w="72px" h="72px" />
      </Box>
      <Box className="address">
        <Text className="p">{mailAddress}</Text>
      </Box>
      <HStack spacing="24px" mt="16px">
        {[SvgArrow, SvgEtherscan].map((Item, index) => (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            w="24px"
            h="24px"
          >
            <Item />
          </Box>
        ))}
      </HStack>

      <Box className="qrCode">
        <QrCode value={`https://mail3.me/${mailAddress}`} size={130} />
      </Box>

      <Button w="250px" className="button">
        <SvgMailme /> <Box pl="10px">Mail me</Box>
      </Button>
    </Center>
  </Container>
)
