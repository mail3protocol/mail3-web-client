import { Box, Button, ButtonProps, Center, Icon } from '@chakra-ui/react'
import React from 'react'
import { ReactComponent as AttachSvg } from '../../../../assets/upload-attach.svg'

export const AttachActivationButton: React.FC<
  { fileCount?: number } & ButtonProps
> = ({ fileCount, ...props }) => (
  <Button
    variant="unstyled"
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    fontSize="14px"
    p="15px"
    py="0"
    rounded="100px"
    position="relative"
    {...props}
  >
    <Center w="full" h="full">
      <Icon
        as={AttachSvg}
        mr={{ base: 0, md: '10px' }}
        transform={{ base: 'rotate(90deg)', md: 'rotate(0deg)' }}
        w="30px"
        h="15px"
      />
    </Center>
    <Box as="span" display={{ base: 'none', md: 'inline' }}>
      Attach
    </Box>
    {fileCount && fileCount > 0 ? (
      <Center
        position="absolute"
        top="0"
        right="0"
        rounded="10px"
        w="20px"
        h="20px"
        lineHeight="20px"
        bg="#F0871A"
        fontSize="12px"
      >
        {fileCount}
      </Center>
    ) : null}
  </Button>
)
