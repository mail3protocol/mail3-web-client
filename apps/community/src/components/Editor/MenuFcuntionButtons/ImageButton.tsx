import { ImageIcon } from 'ui'
import { useCommands } from '@remirror/react'
import { ChangeEventHandler, useCallback, useRef, useState } from 'react'
import { Input } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { MenuButton } from '../Menus'
import { useHomeAPI } from '../../../hooks/useHomeAPI'
import { useToast } from '../../../hooks/useToast'

export interface ImageButtonProps {
  uploadImageGuard?: (file: File) => void
  onUploadImageCallback?: (file: File, url: string) => void
  getImageUrlCache?: (file: File) => string | undefined
}

export const ImageButton: React.FC<ImageButtonProps> = ({
  uploadImageGuard,
  onUploadImageCallback,
  getImageUrlCache,
}) => {
  const { t } = useTranslation('common')
  const { insertImage, focus } = useCommands()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const homeApi = useHomeAPI()
  const toast = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const onUploadImage = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (e) => {
      if (isUploading) return
      setIsUploading(true)
      const target = e.target as HTMLInputElement
      if (!target.files?.[0]) return
      const file = target.files[0]
      target.value = ''
      try {
        uploadImageGuard?.(file)
        const url =
          getImageUrlCache?.(file) ||
          ((await homeApi.uploadImage(file).then((r) => r.data.url)) as string)
        insertImage({
          src: url,
        })
        onUploadImageCallback?.(file, url)
        toast(t('upload_succeed'))
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || err?.message || t('unknown_error')
        toast(
          t('upload_failed', {
            message: errorMessage,
          })
        )
      } finally {
        setIsUploading(false)
      }
      focus()
    },
    [insertImage, isUploading]
  )

  return (
    <>
      <Input
        type="file"
        ref={inputFileRef}
        onChange={onUploadImage}
        position="fixed"
        top="0"
        left="0"
        opacity="0"
        zIndex="-999"
        accept="image/png, image/jpeg, image/gif, image/webp"
      />
      <MenuButton
        onClick={() => {
          inputFileRef.current?.click()
        }}
        isLoading={isUploading}
      >
        <ImageIcon />
      </MenuButton>
    </>
  )
}
