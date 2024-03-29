import {
  Box,
  BoxProps,
  HStack,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  StackProps,
} from '@chakra-ui/react'
import SvgCopy from 'assets/subscription/copy.svg'
import SvgTelegram from 'assets/subscription/telegram.svg'
import SvgTwitter from 'assets/subscription/twitter.svg'
import SvgSystemShare from 'assets/subscription/system-share.svg'
import { useTranslation } from 'react-i18next'
import { useToast } from 'hooks'
import { copyText, shareToTelegram, shareToTwitter } from 'shared'
import { useCallback, useState } from 'react'
import { useAPI } from '../../hooks/useAPI'

export enum ShareButtonType {
  Copy,
  Telegram,
  Twitter,
  SystemShare,
}

interface ShareButtonGroupProps {
  spacing: StackProps['spacing']
  iconW: BoxProps['w']
  shareUrl: string
  text: string
  articleId?: string
  buttonListProps?: Array<ShareButtonType>
}

export const ShareButtonGroup: React.FC<ShareButtonGroupProps> = ({
  spacing,
  iconW,
  shareUrl,
  text,
  articleId,
  buttonListProps,
}) => {
  const [t] = useTranslation(['subscription-article', 'common'])
  const shareText = text.slice(0, 100)
  const toast = useToast()
  const api = useAPI()
  const [isOpen, setIsOpen] = useState(true)

  const shareData = {
    text: shareText,
    url: shareUrl,
  }

  const reportUserEligibility = useCallback(() => {
    if (articleId) api.postUserEligibility(articleId).catch(() => {})
  }, [articleId])

  const buttonConfig: Record<
    ShareButtonType,
    {
      Icon: string
      label: string
      onClick: () => void
    }
  > = {
    [ShareButtonType.Telegram]: {
      Icon: SvgTelegram,
      label: t('telegram'),
      onClick: () => {
        reportUserEligibility()
        shareToTelegram(shareData)
      },
    },
    [ShareButtonType.Copy]: {
      Icon: SvgCopy,
      label: t('copy'),
      onClick: async () => {
        reportUserEligibility()
        await copyText(shareUrl)
        toast(t('navbar.copied', { ns: 'common' }))
      },
    },
    [ShareButtonType.Twitter]: {
      Icon: SvgTwitter,
      label: t('twitter'),
      onClick: () => {
        reportUserEligibility()
        shareToTwitter({
          ...shareData,
          via: 'mail3dao',
        })
      },
    },
    [ShareButtonType.SystemShare]: {
      Icon: SvgSystemShare,
      label: t('system-share'),
      onClick: () => {
        setIsOpen(false)
        try {
          navigator.share(shareData)
        } catch (error) {
          //
        }
      },
    },
  }

  const canShare = () => {
    try {
      return navigator?.canShare(shareData)
    } catch (error) {
      return false
    }
  }

  const buttonList = buttonListProps || [
    ShareButtonType.Twitter,
    ShareButtonType.Telegram,
    ShareButtonType.Copy,
    ...(canShare() ? [ShareButtonType.SystemShare] : []),
  ]

  return (
    <HStack spacing={spacing}>
      {buttonList.map((type) => {
        const { Icon, label, onClick } = buttonConfig[type]

        return (
          <Popover
            arrowSize={8}
            key={type}
            trigger="hover"
            placement="top-start"
            size="md"
            onClose={() => !isOpen && setIsOpen(true)}
          >
            <PopoverTrigger>
              <Box
                as="button"
                p="5px"
                onClick={onClick}
                role="presentation"
                aria-label={label}
              >
                <Image src={Icon} w={iconW} h={iconW} alt={label} />
              </Box>
            </PopoverTrigger>
            {isOpen ? (
              <PopoverContent width="auto">
                <PopoverArrow />
                <PopoverBody
                  whiteSpace="nowrap"
                  fontSize="14px"
                  justifyContent="center"
                >
                  {label}
                </PopoverBody>
              </PopoverContent>
            ) : null}
          </Popover>
        )
      })}
    </HStack>
  )
}
