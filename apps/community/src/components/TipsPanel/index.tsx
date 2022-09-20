import {
  Box,
  BoxProps,
  Heading,
  HeadingProps,
  Icon,
  useStyleConfig,
} from '@chakra-ui/react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as QuestionSvg } from '../../assets/Question.svg'
import { useTipsPanelContent } from '../../hooks/useUpdateTipsPanel'

export const SharedTipsPanelContent: React.FC = () => (
  <>{useTipsPanelContent()}</>
)

export const TipsPanel = forwardRef<
  HTMLDivElement,
  BoxProps & { useSharedContent?: boolean }
>(({ children, useSharedContent, ...props }, ref) => {
  const { t } = useTranslation('components')
  const { title: titleStyleConfig, ...styleConfig } = useStyleConfig(
    'TipsPanel'
  ) as BoxProps & {
    title: HeadingProps
  }
  return (
    <Box ref={ref} {...styleConfig} {...props}>
      <Box position="sticky" top="80px">
        <Heading as="h4" {...titleStyleConfig}>
          <Icon as={QuestionSvg} w="20px" h="20px" mr="14px" my="auto" />
          {t('tips_panel.title')}
        </Heading>
        {useSharedContent ? <SharedTipsPanelContent /> : children}
      </Box>
    </Box>
  )
})
