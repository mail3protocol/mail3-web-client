import { ReactNode } from 'react'
import { Flex, useToken } from '@chakra-ui/react'
import { Box } from '@chakra-ui/layout'

export enum StepStatus {
  Active = 'active',
  Pending = 'pending',
  Done = 'done',
  Failed = 'failed',
}

export const Step: React.FC<{
  serialNumber: number
  status?: StepStatus
  children: ReactNode
}> = ({ serialNumber, status = StepStatus.Pending, children }) => {
  const serialActiveColor = useToken('colors', 'primary.900')
  const primaryTextColor = useToken('colors', 'primaryTextColor')
  const enabledColor = useToken('colors', 'enabledColor')
  const warnColor = useToken('colors', 'warnColor')
  return (
    <Flex
      fontWeight={500}
      fontSize="12px"
      lineHeight="16px"
      align="center"
      w="full"
      color="inputPlaceholder"
      style={{
        color: (
          {
            [StepStatus.Active]: primaryTextColor,
            [StepStatus.Done]: enabledColor,
            [StepStatus.Failed]: warnColor,
          } as { [key in StepStatus]?: string }
        )[status],
      }}
    >
      <Box
        color="secondaryTextColor"
        w="20px"
        h="20px"
        border="1px solid"
        borderColor="currentColor"
        mr="4px"
        lineHeight="18px"
        textAlign="center"
        rounded="20px"
        style={{
          color: [
            StepStatus.Active,
            StepStatus.Failed,
            StepStatus.Done,
          ].includes(status)
            ? serialActiveColor
            : '',
        }}
      >
        {serialNumber}
      </Box>
      {children}
    </Flex>
  )
}
