import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Center, Heading, Input, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'ui'
import { RoutePath } from '../../route/path'
import { RouterLink } from '../RouterLink'
import AvatarPng from '../../assets/settings/avatar.png'

const Container = styled(Box)``

interface SettingAvatarProps {
  isSetup?: boolean
}

export const SettingAvatar: React.FC<SettingAvatarProps> = ({ isSetup }) => {
  const [t] = useTranslation('settings')
  const [nicknameValue, setNicknameValue] = useState('')

  return (
    <Container>
      {isSetup ? (
        <Center
          position="relative"
          w="100%"
          mb="20px"
          mt={['20px', '20px', '40px']}
        >
          <Heading fontSize={['20px', '20px', '28px']}>
            {t('setup.avatar.title')}
          </Heading>
          <RouterLink href={RoutePath.SetupSignature} passHref>
            <Button
              bg="black"
              color="white"
              flex="1"
              className="next-header"
              position="absolute"
              onClick={() => {
                console.log('next')
              }}
              right="60px"
              _hover={{
                bg: 'brand.50',
              }}
              as="a"
              rightIcon={<ChevronRightIcon color="white" />}
            >
              <Center flexDirection="column">
                <Text>{t('setup.next')}</Text>
              </Center>
            </Button>
          </RouterLink>
        </Center>
      ) : null}

      <Center flexDirection="column" justifyContent="center">
        <Box>
          <Input
            placeholder="Nickname"
            background="#F4F4F4"
            border="1px solid #000000"
            borderRadius="100px"
            fontWeight="500"
            fontSize="20px"
            lineHeight="30px"
            p="6px"
            textAlign="center"
            color="#000"
            minW="300px"
            maxW="375px"
            value={nicknameValue}
          />
        </Box>
        <Box color="#6F6F6F" fontSize="14px" mt="3px">
          Need contain 1 to 16 numbers or letters and cannot contain special
          symbols or emoji
        </Box>

        <Center
          w="95%"
          border="1px solid #E7E7E7"
          borderRadius="24px"
          flexDirection="column"
          justifyContent="center"
          p="24px"
          mt="24px"
        >
          <Box
            w="150px"
            h="150px"
            border="4px solid #000000"
            borderRadius="100px"
            bgImage={AvatarPng}
            bgPosition="center"
            bgSize="100% auto"
          />
          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            fontSize="12px"
            mt="16px"
          >
            Upload image
          </Button>
          <Box color="#6F6F6F" fontSize="14px" mt="6px">
            Image format only: BMP, JPEG, JPG, GIF, PNG, size not more than 2M
          </Box>
        </Center>
        <Box mt="24px">
          <Button
            w="120px"
            onClick={() => {
              console.log('save')
            }}
            disabled
          >
            Save
          </Button>
        </Box>
      </Center>
    </Container>
  )
}
