import { InputGroup } from '@chakra-ui/react'
import { useRef } from 'react'

type FileUploadProps = {
  onChange: (files: FileList) => void
  accept?: string
  multiple?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { accept, multiple, children, onChange } = props
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick}>
      <input
        type="file"
        multiple={multiple || false}
        hidden
        accept={accept}
        ref={inputRef}
        onChange={() => {
          const files = inputRef.current?.files
          if (!files) {
            return
          }
          if (typeof onChange === 'function') onChange(files)
        }}
      />
      {children}
    </InputGroup>
  )
}