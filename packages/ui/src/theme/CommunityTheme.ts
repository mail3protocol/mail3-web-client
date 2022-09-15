import { extendTheme } from '@chakra-ui/react'
import { theme as DefaultTheme } from './index'

const font =
  "'Montserrat', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"

export const CommunityTheme = extendTheme(DefaultTheme, {
  fonts: {
    body: font,
    heading: font,
  },
})
