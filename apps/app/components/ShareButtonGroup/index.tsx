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
import { useTranslation } from 'react-i18next'
import { useToast } from 'hooks'
import { copyText, shareToTelegram, shareToTwitter } from 'shared'

enum ButtonType {
  Copy,
  Telegram,
  Twitter,
}

interface ShareButtonGroupProps {
  spacing: StackProps['spacing']
  iconW: BoxProps['w']
  shareUrl: string
  text: string
}

export const ShareButtonGroup: React.FC<ShareButtonGroupProps> = ({
  spacing,
  iconW,
  shareUrl,
  text,
}) => {
  const [t] = useTranslation(['subscription-article', 'common'])
  const shareText = text.slice(0, 100)
  const toast = useToast()

  const buttonConfig: Record<
    ButtonType,
    {
      Icon: any
      label: string
      onClick: () => void
    }
  > = {
    [ButtonType.Telegram]: {
      Icon: SvgTelegram,
      label: t('telegram'),
      onClick: () => {
        shareToTelegram({
          text: shareText,
          url: shareUrl,
        })
      },
    },
    [ButtonType.Copy]: {
      Icon: SvgCopy,
      label: t('copy'),
      onClick: async () => {
        await copyText(shareUrl)
        toast(t('navbar.copied', { ns: 'common' }))
      },
    },
    [ButtonType.Twitter]: {
      Icon: SvgTwitter,
      label: t('twitter'),
      onClick: () => {
        shareToTwitter({
          text: shareText,
          via: 'mail3dao',
          url: shareUrl,
        })
      },
    },
  }

  const buttonList = [ButtonType.Twitter, ButtonType.Telegram, ButtonType.Copy]

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
          </Popover>
        )
      })}
    </HStack>
  )
}
