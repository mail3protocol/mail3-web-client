import { FunctionComponent, ReactNode, useMemo } from 'react'
import {
  Center,
  Flex,
  FlexProps,
  Icon,
  Spinner,
  useToken,
} from '@chakra-ui/react'
import { Box } from '@chakra-ui/layout'
import { ReactComponent as WarningIcon } from '../../assets/WarningIcon.svg'
import { ReactComponent as SucceedIcon } from '../../assets/SucceedIcon.svg'

export enum StepStatus {
  Active = 'active',
  Pending = 'pending',
  Done = 'done',
  Failed = 'failed',
  Loading = 'loading',
}

export const Step: React.FC<
  {
    serialNumber: number
    status?: StepStatus
    children: ReactNode
  } & FlexProps
> = ({ serialNumber, status = StepStatus.Pending, children, ...props }) => {
  const serialActiveColor = useToken('colors', 'primary.900')
  const primaryTextColor = useToken('colors', 'primaryTextColor')
  const enabledColor = useToken('colors', 'enabledColor')
  const warnColor = useToken('colors', 'warnColor')
  const icon = useMemo(() => {
    if ([StepStatus.Failed, StepStatus.Done].includes(status)) {
      const iconMap: { [key in StepStatus]?: FunctionComponent } = {
        [StepStatus.Failed]: WarningIcon,
        [StepStatus.Done]: SucceedIcon,
      }
      return (
        <Center className="icon">
          <Icon as={iconMap[status]} w="inherit" h="inherit" />
        </Center>
      )
    }
    if (status === StepStatus.Loading) {
      return (
        <Center className="icon">
          <Spinner w="16px" h="16px" />
        </Center>
      )
    }
    return (
      <Box
        color="secondaryTextColor"
        className="icon"
        border="1px solid"
        borderColor="currentColor"
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
    )
  }, [status])

  return (
    <Flex
      fontWeight={500}
      fontSize="12px"
      lineHeight="16px"
      align="center"
      w="full"
      color="inputPlaceholder"
      css={{
        '.icon': {
          width: '20px',
          minWidth: '20px',
          height: '20px',
          marginRight: '4px',
          marginBottom: 'auto',
        },
      }}
      style={{
        color: (
          {
            [StepStatus.Active]: primaryTextColor,
            [StepStatus.Done]: enabledColor,
            [StepStatus.Failed]: warnColor,
            [StepStatus.Loading]: primaryTextColor,
          } as { [key in StepStatus]?: string }
        )[status],
      }}
      {...props}
    >
      {icon}
      <Flex align="center" minH="20px" lineHeight="20px" mb="auto">
        {children}
      </Flex>
    </Flex>
  )
}
