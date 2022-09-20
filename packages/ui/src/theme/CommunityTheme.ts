import { cssVar, extendTheme } from '@chakra-ui/react'
import { theme as DefaultTheme } from './index'

const font =
  "'Montserrat', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"

const $popperArrowBgVar = cssVar('popper-arrow-bg')

export const CommunityTheme = extendTheme(DefaultTheme, {
  fonts: {
    body: font,
    heading: font,
  },
  styles: {
    global: {
      body: {
        color: 'primaryTextColor',
      },
    },
  },
  colors: {
    primary: {
      900: '#4E51F4',
      800: '#5F62F5',
      700: '#6F72F4',
      600: '#8183F5',
      500: '#9193F4',
      400: '#A1A2F4',
      300: '#B2B3F5',
      200: '#C3C4F5',
      100: '#D4D4F5',
    },
    primaryButton: {
      100: '#A1A2F4',
      200: '#8183F5',
      300: '#6F72F4',
      400: '#5F62F5',
      500: '#4E51F4',
      600: '#3e41f5',
      700: '#262af1',
      800: '#1216f3',
      900: '#1013c7',
    },
    containerBackground: '#F2F2F2',
    lineColor: '#F2F2F2',
    cardBackground: '#FFF',
    headerBackground: '#FFF',
    primaryTextColor: '#000',
    secondaryTextColor: '#BFBFBF',
    secondaryTitleColor: '#737373',
    sidebarBackground: '#FFF',
    sidebarMenuActiveBackground: '#F2F2F2',
    sidebarSubmenuBorder: '#BFBFBF',
    sidebarMenuItemHoverBackground: '#F2F2F2',
    sidebarMenuHoverBackground: '#F2F2F2',
    sidebarMenuActiveText: '#FFF',
    tooltipBackground: '#FFF',
    inputBackground: '#F2F2F2',
    inputPlaceholder: '#BFBFBF',
    checkboxOutlineBackground: '#FFF',
    uneditable: '#A6A6A6',
    tipsPanel: '#ECECF4',
    earnNftStylePreviewBorder: '#D9D9D9',
    earnNftStylePreviewCodeBackground: '#000',
    earnNftStylePreviewCodeTitle: '#FFF',
  },
  shadows: {
    sidebar: '4px 0px 20px rgba(0, 0, 0, 0.1)',
    card: '0 4px 6px rgba(62, 73, 84, 0.04)',
    listHover: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  radii: {
    card: '20px',
  },
  zIndices: {
    header: 1000,
    sidebar: 999,
  },
  components: {
    Divider: {
      baseStyle: {
        borderColor: '#F2F2F2',
        opacity: 1,
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'tooltipBackground',
        color: 'primaryTextColor',
        px: '16px',
        py: '12px',
        rounded: '16px',
        fontSize: '14px',
        shadow: 'none',
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
        [$popperArrowBgVar.variable]: '#FFF',
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            background: 'inputBackground',
            border: '1px solid',
            borderColor: 'primaryTextColor',
            rounded: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'primaryTextColor',
            _placeholder: {
              color: 'inputPlaceholder',
              fontSize: '14px',
              fontWeight: '500',
            },
            _hover: {
              borderColor: 'primaryTextColor',
            },
            _focus: {
              borderColor: 'primary.900',
              shadow: 'none',
            },
          },
        },
      },
    },
    Form: {
      baseStyle: {
        helperText: {
          fontSize: '12px',
          fontWeight: 500,
          color: 'secondaryTitleColor',
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: '14px',
        fontWeight: 500,
        mb: '8px',
      },
    },
    Button: {
      variants: {
        'solid-rounded': ({ colorScheme }: { colorScheme: string }) => ({
          rounded: '99px',
          lineHeight: '1.2',
          fontWeight: '500',
          fontSize: '16px',
          transitionProperty: 'common',
          transitionDuration: 'normal',
          _focus: { boxShadow: 'none', outline: 'none' },
          _disabled: {
            bg: `${colorScheme}.200`,
            cursor: 'not-allowed',
            boxShadow: 'none',
            opacity: 0.6,
          },
          _hover: {
            _disabled: { bg: `${colorScheme}.200`, opacity: 0.6 },
            bg: `${colorScheme}.600`,
          },
          h: '42px',
          px: '38px',
          bg: `${colorScheme}.500`,
          color: 'white',
          _active: { bg: `${colorScheme}.700` },
        }),
      },
    },
    Checkbox: {
      variants: {
        outline: {
          container: {
            w: '150px',
            h: '38px',
            lineHeight: '36px',
          },
          control: {
            display: 'none',
            opacity: 0,
            h: 0,
            w: 0,
            border: 'none',
          },
          label: {
            m: 0,
            w: 'inherit',
            h: 'inherit',
            fontSize: '14px',
            textAlign: 'center',
            rounded: '8px',
            border: '1px solid',
            borderColor: 'currentColor',
            fontWeight: 600,
            letterSpacing: 0.1,
            opacity: 0.8,
            transaction: '200ms',
            bg: 'checkboxOutlineBackground',
            _checked: {
              color: 'primary.900',
              _disabled: {
                color: 'primary.400',
              },
            },
            _disabled: {
              opacity: 0.8,
              color: 'uneditable',
            },
          },
        },
      },
    },
    Card: {
      bg: 'card',
      shadow: 'card',
      rounded: 'card',
    },
    TipsPanel: {
      baseStyle: {
        bg: 'tipsPanel',
        shadow: 'card',
        rounded: 'card',
        px: '18px',
        py: '32px',
        position: 'relative',
        title: {
          color: 'primary.900',
          fontSize: '18px',
          lineHeight: '28px',
          display: 'flex',
          fontWeight: 500,
          mb: '32px',
        },
      },
    },
  },
})
