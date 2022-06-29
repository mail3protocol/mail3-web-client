import React, { useEffect, useState } from 'react'
import {
  Flex,
  Icon,
  Link,
  useDisclosure,
  Button,
  Box,
  Center,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { CloseIcon } from '@chakra-ui/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { timer } from 'rxjs'
import { useMonitorSending } from '../../hooks/useSending'
import LoadingSvg from '../../assets/loading.svg'
import SucceedSvg from '../../assets/succeed.svg'
import { RoutePath } from '../../route/path'

export const SendingDialog: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const { sendingList } = useMonitorSending()
  const isSending = sendingList.length > 0
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMessageSent, setIsMessageSent] = useState(false)

  useEffect(() => {
    if (isSending) {
      onOpen()
    } else if (isOpen) {
      setIsMessageSent(true)
    }
  }, [isSending])

  useEffect(() => {
    if (isMessageSent) {
      const timerSubscriber = timer(3000).subscribe(() => {
        setIsMessageSent(false)
      })
      return () => {
        timerSubscriber.unsubscribe()
      }
    }
    return () => {}
  }, [isMessageSent])

  return (
    <AnimatePresence>
      {isOpen ? (
        <Flex
          position="fixed"
          w="full"
          bottom="80px"
          left="0"
          as={motion.div}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
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
              <NextLink href={RoutePath.Sent} passHref>
                <Link color="#4E51F4" textDecoration="underline" ml="16px">
                  {t('sending.view_message')}
                </Link>
              </NextLink>
            ) : null}
            <Button
              variant="unstyled"
              mx="10px"
              display="inline-flex"
              justifyContent="center"
              alignItems="center"
              onClick={onClose}
            >
              <CloseIcon w="10px" h="10px" />
            </Button>
          </Flex>
        </Flex>
      ) : null}
    </AnimatePresence>
  )
}
