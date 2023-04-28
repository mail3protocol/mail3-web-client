import {
  ButtonProps,
  cssVar,
  extendTheme,
  tokenToCSSVar,
} from '@chakra-ui/react'
import { theme as DefaultTheme } from './index'

const font =
  '-apple-system, system-ui, SF Pro, PingFang SC, Helvetica, Roboto, Open Sans, Arial, sans-serif'

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
    blackButton: {
      50: 'rgba(0, 0, 0, 0.64)',
      100: 'rgba(0, 0, 0, 0.80)',
      500: 'rgba(0, 0, 0, 0.92)',
    },
    blackButtonOutline: {
      50: 'rgba(0, 0, 0, 0.64)',
      100: 'rgba(0, 0, 0, 0.10)',
      500: 'rgba(0, 0, 0, 0.92)',
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
    otherBrand: {
      discord: '#4E52F5',
      twitter: '#3888FF',
    },
    premium: {
      100: '#FFF8EB',
      500: '#FFA800',
    },
    importantColor: '#FF6B00',
    abstractBackground: '#EBEBEB',
    abstractColor: '#333333',
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
    previewBorder: '#D9D9D9',
    earnNftStylePreviewBorder: '#D9D9D9',
    earnNftStylePreviewCodeBackground: '#000',
    earnNftStylePreviewCodeTitle: '#FFF',
    loginHomePage: {
      background: '#000',
      color: '#fff',
    },
    rainbow:
      'linear-gradient(90.02deg, #FFB1B1 0.01%, #FFCD4B 50.26%, #916BFF 99.99%)',
    informationAvatarBackground: 'linear-gradient(#FFB800, #4E51F4)',
    connectWalletButtonBackground: '#FFF',
    connectedWalletButton: {
      background: '#F3F3F3',
      color: '#333',
    },
    informationQrCodeBackground: '#FFF',
    previewDatetimeColor: '#6f6f6f',
    editorAddLinkDialogErrorColor: '#E53E3E',
    loadingOverlayBackground: 'rgba(255, 255, 255, 0.4)',
    statusColorEnabled: '#14FF00',
    statusColorDisabled: '#FF0000',
    enabledColor: '#61C100',
    warnColor: '#FF5B00',
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
            _disabled: {
              opacity: 1,
              color: 'secondaryTitleColor',
              borderColor: 'inputBackground',
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        black: {
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
          _disabled: {
            opacity: 1,
            color: 'secondaryTitleColor',
            borderColor: 'inputBackground',
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
    FormError: {
      baseStyle: {
        text: {
          fontSize: '12px',
          fontWeight: 500,
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
        upload: ({ colorScheme }: { colorScheme: string }) => ({
          background: `${colorScheme}.500`,
          border: `1px solid ${colorScheme}.500`,
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '12px',
          lineHeight: '14px',
          color: '#fff',
          padding: '4px 8px',
          height: '28px',
        }),
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
        'outline-rounded': ({ colorScheme }: { colorScheme: string }) => {
          const exceptionalColorSchemeCases: { [key: string]: ButtonProps } = {
            primaryButton: {
              borderColor: `primary.900`,
              color: `primary.900`,
              _active: {
                bg: `${colorScheme}.400`,
                color: 'white',
                _disabled: {
                  color: `primary.900`,
                },
              },
              _hover: { bg: `primary.100` },
            },
          }
          return {
            lineHeight: '1.2',
            borderRadius: '999px',
            fontWeight: '600',
            transitionProperty: 'common',
            transitionDuration: 'normal',
            _focus: { boxShadow: 'none', outline: 'none' },
            _disabled: {
              opacity: 0.4,
              cursor: 'not-allowed',
              boxShadow: 'none',
            },
            _hover: { _disabled: { bg: 'initial' }, bg: `${colorScheme}.100` },
            h: 10,
            minW: 10,
            fontSize: 'md',
            border: '1px solid',
            px: '38px',
            borderColor: `${colorScheme}.200`,
            color: 'inherit',
            _active: { bg: `${colorScheme}.200` },
            ...exceptionalColorSchemeCases[colorScheme],
          }
        },
        wallet: ({
          disabled,
          isDisabled,
        }: {
          disabled?: boolean
          isDisabled?: boolean
        }) => {
          const _isDisabled = disabled || isDisabled
          return {
            justifyContent: 'flex-start',
            bg: 'connectWalletButtonBackground',
            filter: 'drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.15))',
            rounded: '100px',
            px: '8px',
            h: '40px',
            transition: '200ms',
            _hover: _isDisabled
              ? null
              : {
                  transform: 'scale(1.02)',
                },
            _active: _isDisabled
              ? null
              : {
                  transition: '20ms',
                  transform: 'scale(0.99)',
                  shadow: 'xs',
                  filter: 'drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.05))',
                },
          }
        },
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
    Radio: {
      baseStyle: (props: {
        theme: any
        variant: string
        colorScheme: string
      }) => {
        const { theme, colorScheme, variant } = props
        if (variant === 'outline') {
          return {
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
          }
        }
        const colorPrimary900 = tokenToCSSVar('colors', 'primary.900')(theme)
        return {
          control: {
            bg: colorScheme === 'primary' ? 'white' : undefined,
            border: '1px solid',
            color: 'primaryTextColor',
            borderColor: colorScheme === 'primary' ? 'currentColor' : undefined,
            _checked: {
              bg: colorScheme === 'primary' ? 'white' : undefined,
              borderColor:
                colorScheme === 'primary' ? colorPrimary900 : undefined,
              _before: {
                bg: colorScheme === 'primary' ? colorPrimary900 : undefined,
                width: 'calc(100% - 4px)',
                height: 'calc(100% - 4px)',
              },
              _hover: {
                bg: colorScheme === 'primary' ? 'white' : undefined,
                borderColor:
                  colorScheme === 'primary' ? colorPrimary900 : undefined,
              },
            },
          },
          label: {
            color: 'black',
            fontSize: '14px',
            _checked: {
              color: colorPrimary900,
            },
          },
        }
      },
    },
    Card: {
      baseStyle: {
        bg: 'cardBackground',
        shadow: 'card',
        rounded: 'card',
      },
    },
    TipsPanel: {
      baseStyle: {
        bg: 'tipsPanel',
        shadow: 'card',
        rounded: 'card',
        px: '18px',
        py: '32px',
        position: 'sticky',
        top: '80px',
        maxH: 'calc(100vh - 100px)',
        overflowY: 'auto',
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
    Tabs: {
      variants: {
        chain: {
          tablist: {
            pb: '4px',
          },
          tab: {
            display: 'inline-grid',
            gridTemplateColumns: '16px 1fr',
            gridGap: '4px',
            pl: 0,
            pr: '20px',
            fontWeight: '600',
            position: 'relative',
            py: 0,
            fontSize: '14px',
            lineHeight: '24px',
            color: 'secondaryTitleColor',
            _selected: {
              color: 'primaryTextColor',
              _before: {
                content: '" "',
                position: 'absolute',
                display: 'block',
                bottom: '0',
                right: '20px',
                w: 'calc(100% - 40px)',
                borderBottom: '2px solid currentColor',
              },
            },
          },
        },
        normal: {
          tablist: {
            borderBottom: '3px solid',
            borderColor: 'inherit',
          },
          tab: {
            marginBottom: '-3px',
            borderBottom: '3px solid',
            borderColor: 'transparent',
            _selected: {
              color: 'primary.900',
              borderColor: 'currentColor',
            },
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '20px',
            color: '#1D1B23',
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          rounded: '20px',
        },
        body: {
          py: '24px',
          px: '20px',
        },
      },
    },
    ConnectedWalletButton: {
      baseStyle: {
        rounded: '99px',
        ml: 'auto',
        fontSize: '12px',
        lineHeight: '14px',
        h: '36px',
        p: '2px',
        bg: 'connectedWalletButton.background',
        color: 'connectedWalletButton.color',
        avatar: {
          w: '32px',
          h: '32px',
        },
        text: {
          mx: '4px',
        },
        listItem: {
          fontSize: '16px',
          lineHeight: '20px',
          p: '10px',
          fontWeight: 500,
          rounded: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          w: 'full',
          textAlign: 'left',
          _hover: {
            bg: '#ECECF4',
            color: 'primary.900',
          },
          _active: {
            color: '#fff',
            bg: 'primary.400',
            transition: '50ms',
          },
        },
      },
    },
    Popover: {
      baseStyle: {
        arrow: {
          border: 'none',
        },
        content: {
          border: 'none',
          boxShadow: 'none',
          _focusVisible: { boxShadow: 'none' },
          filter: 'drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.15))',
          rounded: '16px',
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          py: '16px',
          px: '8px',
          border: 'none',
          boxShadow: 'none',
          _focusVisible: { boxShadow: 'none' },
          filter: 'drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.15))',
          rounded: '16px',
        },
        item: {
          fontSize: '16px',
          lineHeight: '20px',
          p: '10px',
          fontWeight: 500,
          rounded: '8px',
          _focus: {
            bg: '#ECECF4',
            color: 'primary.900',
          },
          _active: {
            color: '#fff',
            bg: 'primary.400',
          },
        },
      },
    },
    Table: {
      baseStyle: {
        table: {
          fontSize: '12px',
          fontVariantNumeric: 'inherit',
        },
        thead: {
          bg: '#F2F2F2',
        },
        th: {
          fontWeight: 500,
          textTransform: 'initial',
        },
        caption: {
          marginTop: 0,
          padding: '10px',
          fontWeight: '500',
          fontSize: '12px',
          lineHeight: '20px',
          color: '#AEAEAE',
        },
      },
    },
  },
})
