import { extendTheme } from '@chakra-ui/react'
import { theme as DefaultTheme } from './index'

const font =
  "'Montserrat', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"

export const CommunityTheme = extendTheme(DefaultTheme, {
  fonts: {
    body: font,
    heading: font,
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
    containerBackground: '#F2F2F2',
    lineColor: '#F2F2F2',
    cardBackground: '#FFF',
    headerBackground: '#FFF',
    secondaryTextColor: '#BFBFBF',
    sidebarBackground: '#FFF',
  },
  shadows: {
    sidebar: '4px 0px 20px rgba(0, 0, 0, 0.1)',
  },
  zIndices: {
    header: 1000,
  },
  components: {
    Divider: {
      baseStyle: {
        borderColor: '#F2F2F2',
        opacity: 1,
      },
    },
  },
})
