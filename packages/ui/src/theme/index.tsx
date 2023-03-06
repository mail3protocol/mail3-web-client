import { cssVar, extendTheme } from '@chakra-ui/react'
import StepsTheme from '../Steps/theme'

const font =
  "'Poppins', Poppins-Regular, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"

const $popperArrowBgVar = cssVar('popper-arrow-bg')

export const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: '',
      },
    }),
  },
  shadows: {
    outline: 'none',
  },
  colors: {
    brand: {
      50: 'rgba(0, 0, 0, 0.64)',
      100: 'rgba(0, 0, 0, 0.80)',
      500: 'rgba(0, 0, 0, 0.92)',
    },
    deepBlue: {
      50: '#4E52F5',
      100: '#4E52F5',
      500: '#4E52F5',
    },
  },
  fonts: {
    body: font,
    heading: font,
  },
  breakpoints: {
    base: '0',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
    '3xl': '1600px',
  },
  components: {
    Steps: StepsTheme,
    Tooltip: {
      baseStyle: {
        bg: 'tooltipBackground',
        color: 'primaryTextColor',
        px: '16px',
        py: '12px',
        rounded: '16px',
        fontSize: '12px',
        shadow: 'none',
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
        [$popperArrowBgVar.variable]: '#FFF',
      },
    },
    Button: {
      colorScheme: {
        empty: {
          bg: 'transparent',
          _hover: { bg: 'transparent' },
          _focus: { outline: 'none', bg: 'transparent', boxShadow: 'none' },
          padding: '0',
        },
      },
      baseStyle: {
        _focus: {
          outline: 'none',
          boxShadow: 'none',
        },
        fontWeight: '600',
      },
    },
    Link: {
      baseStyle: {
        _focus: {
          outline: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
})
