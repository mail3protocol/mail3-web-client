import { Box, Button, Center, Circle, CloseButton } from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SvgBell } from 'assets/subscribe-page/bell.svg'

export const NotificationBarIsOpen = atom(true)

export const NotificationBar: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(NotificationBarIsOpen)
  const [t] = useTranslation('subscription-article')

  return (
    <Box display={{ base: 'none', md: 'block' }}>
      {isOpen ? (
        <Center w="full" bgColor="#4E51F4" h="40px">
          <Center
            maxW="800px"
            w="full"
            fontWeight="400"
            fontSize="16px"
            lineHeight="20px"
            color="#fff"
            position="relative"
          >
            <SvgBell />
            <Box ml="16px">{t('notifications')}</Box>
            <Button
              variant="outline"
              h="24px"
              ml="16px"
              _active={{
                bgColor: 'transparent',
                opacity: 0.6,
              }}
              _hover={{
                bgColor: 'transparent',
                opacity: 0.8,
              }}
            >
              {t('enable')}
            </Button>

            <Box
              as={Circle}
              position="absolute"
              right="0"
              top="50%"
              transform="translateY(-50%)"
              border="2px solid #fff"
              w="24px"
              h="24px"
            >
              <CloseButton onClick={() => setIsOpen(false)} />
            </Box>
          </Center>
        </Center>
      ) : null}
    </Box>
  )
}
