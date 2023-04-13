import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Box,
  Center,
  Heading,
  Image,
  Input,
  InputGroup,
  Spinner,
  Text,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'ui'
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import { useToast } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import {
  isInvalidNickname,
  isPrimitiveEthAddress,
  truncateMiddle,
} from 'shared'
import { useQuery } from 'react-query'
import { avatarsAtom, DEFAULT_AVATAR_SRC, defaultAvatar } from 'ui/src/Avatar'
import axios from 'axios'
import { useUpdateAtom } from 'jotai/utils'
import { RoutePath } from '../../route/path'
import { useAPI, useHomeAPI } from '../../hooks/useAPI'
import { userPropertiesAtom } from '../../hooks/useLogin'

type FileUploadProps = PropsWithChildren<{
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
}>

interface SettingAvatarProps {
  isSetup?: boolean
}

type FormValues = {
  file_: FileList
  nickname: string
}

const Container = styled(Box)`
  .footer {
    display: none;
    @media (max-width: 930px) {
      display: flex;
      margin-top: 10px;
    }
  }
`

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

export const SettingAvatar: React.FC<SettingAvatarProps> = ({ isSetup }) => {
  const [t] = useTranslation('settings')
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>()
  const [isUpLoading, setIsUpLoading] = useState(false)
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [isModifyNickname, setIsModifyNickname] = useState(false)
  const [isModifyAvatar, setIsModifyAvatar] = useState(false)

  const homeAPI = useHomeAPI()
  const api = useAPI()
  const toast = useToast()
  const navi = useNavigate()
  const setAvatars = useUpdateAtom(avatarsAtom)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)

  const [userProps, setUserProps] = useAtom(userPropertiesAtom)

  const { isLoading, data: info } = useQuery(
    ['settingAvatar'],
    async () => {
      const { data } = await api.getUserInfo()
      return data
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        if (d.avatar && d.avatar !== DEFAULT_AVATAR_SRC) setAvatarSrc(d.avatar)
        if (d.nickname) setValue('nickname', d.nickname)
      },
    }
  )

  const onSubmit = handleSubmit(async (data) => {
    if (isInvalidNickname(data.nickname)) {
      toast('Invalid nickname', {
        status: 'warning',
      })
      return
    }
    setIsSaveLoading(true)
    try {
      await api.setProfile(data.nickname, avatarSrc ?? '')
      toast('Settings are saved', {
        status: 'success',
      })
      if (userProps?.defaultAddress && avatarSrc) {
        setAvatars((prev) => ({
          ...prev,
          [userProps.defaultAddress.split('@')[0]]: avatarSrc,
        }))
      }
      setUserProps((prev) => ({
        ...prev,
        nickname: data.nickname,
      }))
    } catch (error) {
      toast('Network error', {
        status: 'warning',
      })
    }
    setIsSaveLoading(false)
  })

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (info?.nickname) {
      return
    }
    if (userProps?.defaultAddress) {
      const address = userProps.defaultAddress.split('@')[0]
      let defaultNickname = address
      if (isPrimitiveEthAddress(address)) {
        defaultNickname = truncateMiddle(address, 6, 4, '_')
      }
      setValue('nickname', defaultNickname)
    }
  }, [userProps, isLoading, info])

  useEffect(() => {
    const watchFile = watch(async (value, { name }) => {
      if (name === 'nickname' && info && value.nickname !== info?.nickname) {
        setIsModifyNickname(true)
      }

      if (name === 'file_' && value.file_ && value.file_.length > 0) {
        setIsUpLoading(true)
        try {
          const file = value.file_[0]
          const fsMb = file.size / (1024 * 1024)
          const MAX_FILE_SIZE = 2
          if (fsMb > MAX_FILE_SIZE) {
            throw new Error('Max file size 2mb')
          }
          const { data } = await homeAPI.uploadImage(file)
          setAvatarSrc(data.url)
          setIsModifyAvatar(true)
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            toast({
              status: 'error',
              title: error.message,
              description: error?.response?.data?.message,
            })
          } else {
            toast(error.message, {
              status: 'warning',
            })
          }
        }
        setIsUpLoading(false)
      }
    })
    return () => watchFile.unsubscribe()
  }, [watch, info])

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

          <Button
            bg="black"
            color="white"
            flex="1"
            position="absolute"
            className="next-header"
            isLoading={isSaveLoading}
            onClick={async () => {
              await onSubmit()
              navi(RoutePath.SetupSignature)
            }}
            right="60px"
            _hover={{
              bg: 'brand.50',
            }}
            rightIcon={<ChevronRightIcon color="white" />}
          >
            <Center flexDirection="column">
              <Text>{t('setup.next')}</Text>
            </Center>
          </Button>
        </Center>
      ) : null}

      {isLoading ? (
        <Center minH="300px">
          <Spinner />
        </Center>
      ) : (
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
              maxLength={16}
              _placeholder={{ color: 'rgba(0, 0, 0, 0.4)' }}
              {...register('nickname')}
            />
          </Box>
          <Box color="#6F6F6F" fontSize="14px" mt="3px" textAlign="center">
            {t('username_description')}
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
              overflow="hidden"
              bgColor="#fff"
            >
              <Image
                src={avatarSrc || defaultAvatar}
                objectFit="cover"
                crossOrigin=""
              />
            </Box>

            <Box mt="16px">
              <FileUpload
                accept=".jpg, .jpeg, .gif, .png, .bmp"
                register={register('file_')}
              >
                <Button
                  leftIcon={<AddIcon />}
                  variant="outline"
                  fontSize="12px"
                  loadingText="Uploading"
                  isLoading={isUpLoading}
                >
                  Upload image
                </Button>
              </FileUpload>
            </Box>

            <Box color="#6F6F6F" fontSize="14px" mt="6px" textAlign="center">
              Image format only: BMP, JPEG, JPG, GIF, PNG, size not more than 2M
            </Box>
          </Center>
          {!isSetup ? (
            <Box mt="24px">
              <Button
                w="120px"
                onClick={onSubmit}
                disabled={!isModifyNickname && !isModifyAvatar}
                isLoading={isSaveLoading}
              >
                Save
              </Button>
            </Box>
          ) : (
            <Center pt="25px" className="footer">
              <Button
                bg="black"
                color="white"
                w="250px"
                h="50px"
                isLoading={isSaveLoading}
                onClick={async () => {
                  await onSubmit()
                  navi(RoutePath.SetupSignature)
                }}
                _hover={{
                  bg: 'brand.50',
                }}
                rightIcon={<ChevronRightIcon color="white" />}
              >
                <Center flexDirection="column">
                  <Text>{t('setup.next')}</Text>
                </Center>
              </Button>
            </Center>
          )}
        </Center>
      )}
    </Container>
  )
}
