import { ImageIcon } from 'ui'
import { useCommands } from '@remirror/react'
import { ChangeEventHandler, useCallback, useRef } from 'react'
import { Input } from '@chakra-ui/react'
import { MenuButton } from '../Menus'

export const ImageButton: React.FC = () => {
  const { insertImage, focus } = useCommands()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const onUploadImage = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (e) => {
      const target = e.target as HTMLInputElement
      if (!target.files?.[0]) return
      const file = target.files[0]
      target.value = ''
      const blob = await file
        .arrayBuffer()
        .then(
          (arrayBuffer) =>
            new Blob([new Uint8Array(arrayBuffer)], { type: file.type })
        )
      insertImage({
        src: URL.createObjectURL(blob),
      })
      focus()
    },
    [insertImage]
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
      >
        <ImageIcon />
      </MenuButton>
    </>
  )
}
