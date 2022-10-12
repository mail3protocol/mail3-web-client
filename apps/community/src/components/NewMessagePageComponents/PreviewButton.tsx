import { Button, ButtonProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useHelpers } from '@remirror/react'

export interface PreviewButtonProps extends Omit<ButtonProps, 'onClick'> {
  isPreview: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>, content: string) => void
}

export const PreviewButton: React.FC<PreviewButtonProps> = ({
  isPreview,
  onClick,
  ...props
}) => {
  const { t } = useTranslation('new_message')
  const { getHTML } = useHelpers()

  return (
    <Button
      variant="outline-rounded"
      colorScheme="blackAlpha"
      {...props}
      onClick={(e) => {
        onClick(e, getHTML())
      }}
    >
      {!isPreview ? t('preview') : t('edit')}
    </Button>
  )
}
