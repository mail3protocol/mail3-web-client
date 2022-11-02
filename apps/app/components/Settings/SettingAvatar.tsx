import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Center, Heading, Input, InputGroup, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'ui'
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import { RoutePath } from '../../route/path'
import { RouterLink } from '../RouterLink'
import AvatarPng from '../../assets/settings/avatar.png'

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
}

interface SettingAvatarProps {
  isSetup?: boolean
}

type FormValues = {
  file_: FileList
  nickname: string
}

const Container = styled(Box)``

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { register, accept, multiple, children } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void
  }

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick}>
      <input
        type="file"
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
      />
      {children}
    </InputGroup>
  )
}

const validateFiles = (value: FileList) => {
  if (value.length < 1) {
    return 'Files is required'
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const file of Array.from(value)) {
    const fsMb = file.size / (1024 * 1024)
    const MAX_FILE_SIZE = 2
    if (fsMb > MAX_FILE_SIZE) {
      return 'Max file size 2mb'
    }
  }
  return true
}

export const SettingAvatar: React.FC<SettingAvatarProps> = ({ isSetup }) => {
  const [t] = useTranslation('settings')
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>()

  const onSubmit = handleSubmit((data) => {
    console.log('On Submit: ', data)
    console.log(errors)
  })

  useEffect(() => {
    const watchFile = watch((value, { name }) => {
      if (name === 'file_') {
        console.log(value.file_)
      }
    })
    return () => watchFile.unsubscribe()
  }, [watch])

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
            _placeholder={{ color: 'rgba(0, 0, 0, 0.4)' }}
            {...register('nickname')}
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

          <Box mt="16px">
            <FileUpload
              accept={'image/*'}
              register={register('file_', { validate: validateFiles })}
            >
              <Button leftIcon={<AddIcon />} variant="outline" fontSize="12px">
                Upload image
              </Button>
            </FileUpload>
          </Box>

          <Box color="#6F6F6F" fontSize="14px" mt="6px">
            Image format only: BMP, JPEG, JPG, GIF, PNG, size not more than 2M
          </Box>
        </Center>
        <Box mt="24px">
          <Button w="120px" onClick={onSubmit}>
            Save
          </Button>
        </Box>
      </Center>
    </Container>
  )
}
