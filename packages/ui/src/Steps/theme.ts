import { StepsTheme as StepsStyleConfig } from 'chakra-ui-steps'

const StepsTheme = {
  ...StepsStyleConfig,
  baseStyle: (props: any) => ({
    ...StepsStyleConfig.baseStyle(props),
    icon: {
      ...StepsStyleConfig.baseStyle(props).icon,
    },
    label: {
      ...StepsStyleConfig.baseStyle(props).label,
      color: '#4E51F4',
    },
    description: {
      ...StepsStyleConfig.baseStyle(props).description,
      color: '#000',
      marginTop: '10px',
    },
    stepIconContainer: {
      ...StepsStyleConfig.baseStyle(props).stepIconContainer,
      bg: '#fff',
      borderColor: '#6F6F6F',
      _activeStep: {
        borderColor: '#4E51F4',
      },
      _highlighted: {
        bg: '#4E51F4',
        borderColor: '#4E51F4',
      },
    },
    connector: {
      ...StepsStyleConfig.baseStyle(props).connector,
      borderColor: '#EEEEEE',
      _highlighted: {
        borderColor: '#4E51F4',
      },
    },
  }),
  sizes: {
    sm: {
      stepIconContainer: {
        width: '24px',
        height: '24px',
        borderWidth: '2px',
      },
      icon: {
        width: '12px',
        height: '12px',
      },
      label: {
        fontWeight: 'medium',
        textAlign: 'center',
        fontSize: '14px',
      },
      description: {
        fontWeight: '700',
        textAlign: 'center',
        fontSize: '14px',
      },
    },
    md: {
      stepIconContainer: {
        width: '40px',
        height: '40px',
        borderWidth: '2px',
      },
      icon: {
        width: '18px',
        height: '18px',
      },
      label: {
        fontWeight: 'medium',
        textAlign: 'center',
        fontSize: 'md',
      },
      description: {
        fontWeight: '300',
        textAlign: 'center',
        fontSize: 'sm',
      },
    },
    lg: {
      stepIconContainer: {
        width: '48px',
        height: '48px',
        borderWidth: '2px',
      },
      icon: {
        width: '22px',
        height: '22px',
      },
      label: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 'lg',
      },
      description: {
        fontWeight: '300',
        textAlign: 'center',
        fontSize: 'md',
      },
    },
  },
}

export default StepsTheme
