import React, { useEffect, useState } from 'react'
import {
  Flex,
  Icon,
  Link,
  useDisclosure,
  Button,
  Box,
  Center,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from '@chakra-ui/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { switchMap, timer } from 'rxjs'
import { tap } from 'rxjs/operators'
import { useSending } from '../../hooks/useSending'
import { ReactComponent as LoadingSvg } from '../../assets/loading.svg'
import { ReactComponent as SucceedSvg } from '../../assets/succeed.svg'
import { RoutePath } from '../../route/path'
import { RouterLink } from '../RouterLink'

export const SendingDialog: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const { sendingList, clearSendingList } = useSending()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMessageSent, setIsMessageSent] = useState(false)

  useEffect(() => {
    if (sendingList.length > 0) {
      onOpen()
      const subscriber = timer(2000)
        .pipe(
          tap(() => setIsMessageSent(true)),
          switchMap(() => timer(3000).pipe(tap(() => onClose())))
        )
        .subscribe(() => {
          clearSendingList()
        })
      return () => {
        subscriber.unsubscribe()
        clearSendingList()
      }
    }
    return () => {}
  }, [sendingList])

  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <AnimatePresence>
      {isOpen ? (
        <Flex
          position="fixed"
          w="full"
          top={{ base: '76px', md: 'unset' }}
          bottom={{ base: 'unset', md: '80px' }}
          left="0"
          as={motion.div}
          {...(isMobile
            ? {
                initial: { opacity: 0, y: -100 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -100 },
              }
            : {
                initial: { opacity: 0, y: 100 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 100 },
              })}
        >
          <Flex
            h="52px"
            lineHeight="52px"
            align="center"
            fontSize="14px"
            rounded="22px"
            shadow="lg"
            mx={{ base: 'auto', md: '50px' }}
            bg="#fff"
            pl="22px"
            whiteSpace="nowrap"
          >
            {isMessageSent ? (
              <Icon as={SucceedSvg} w="20px" h="20px" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ ease: 'linear', duration: 2, repeat: Infinity }}
                style={{ width: '20px', height: '20px' }}
              >
                <Center w="inherit" h="inherit">
                  <Icon as={LoadingSvg} w="inherit" h="inherit" />
                </Center>
              </motion.div>
            )}
            <Box ml="12px">
              {isMessageSent ? t('sending.succeed') : t('sending.sending')}
            </Box>
            {isMessageSent ? (
              <RouterLink href={RoutePath.Sent} passHref>
                <Link
                  color="#4E51F4"
                  textDecoration="underline"
                  ml="16px"
                  onClick={() => {
                    clearSendingList()
                  }}
                >
                  {t('sending.view_message')}
                </Link>
              </RouterLink>
            ) : null}
            <Button
              variant="unstyled"
              mx="10px"
              display="inline-flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => {
                onClose()
                clearSendingList()
              }}
            >
              <CloseIcon w="10px" h="10px" />
            </Button>
          </Flex>
        </Flex>
      ) : null}
    </AnimatePresence>
  )
}
