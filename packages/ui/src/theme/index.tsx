import { extendTheme } from '@chakra-ui/react'

const font =
  'Poppins-Regular, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'

export const theme = extendTheme({
  colors: {
    brand: {
      50: 'rgba(0, 0, 0, 0.64)',
      100: 'rgba(0, 0, 0, 0.80)',
      500: 'rgba(0, 0, 0, 0.92)',
    },
  },
  fonts: {
    body: font,
    heading: font,
  },
  components: {
    Button: {
      colorScheme: {
        empty: {
          bg: 'transparent',
          _hover: { bg: 'transparent' },
          _focus: { outline: 'none', bg: 'transparent', boxShadow: 'none' },
          padding: '0',
        },
      },
    },
  },
})
