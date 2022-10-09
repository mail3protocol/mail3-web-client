import root from 'react-shadow'
import { Flex, FlexProps } from '@chakra-ui/react'
import parse from 'html-react-parser'
import { useMemo } from 'react'
import { HOME_URL } from '../../constants/env/url'

const fontSource = HOME_URL

// language=css
const style = `
html,
body {
    padding: 0;
    margin: 0;
    font-family: 'Poppins', Poppins-Regular, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

@font-face {
    font-family: Poppins-Regular;
    src: local(Poppins-Regular), url(${fontSource}/fonts/Poppins-Regular.ttf) format('truetype');
    font-display: fallback;
}

@font-face {
    font-family: NanumPenScript-Regular;
    src: local(NanumPenScript-Regular), url(${fontSource}/fonts/NanumPenScript-Regular.ttf) format('truetype');
    font-display: fallback;
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-Black.ttf) format('truetype');
    font-weight: 900;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-BlackItalic.ttf) format('truetype');
    font-weight: 900;
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-Bold.ttf) format('truetype');
    font-weight: 700;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-BoldItalic.ttf) format('truetype');
    font-weight: 700;
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-ExtraBold.ttf) format('truetype');
    font-weight: 800;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-ExtraBoldItalic.ttf) format('truetype');
    font-weight: 800;
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-ExtraLight.ttf) format('truetype');
    font-weight: 200;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-ExtraLightItalic.ttf) format('truetype');
    font-weight: 200;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-Italic.ttf) format('truetype');
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-Light.ttf) format('truetype');
    font-weight: 300;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-LightItalic.ttf) format('truetype');
    font-weight: 300;
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-Medium.ttf) format('truetype');
    font-weight: 500;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-MediumItalic.ttf) format('truetype');
    font-weight: 500;
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-Regular.ttf) format('truetype');
    font-weight: 400;
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-SemiBold.ttf) format('truetype');
    font-weight: 600;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-SemiBoldItalic.ttf) format('truetype');
    font-weight: 600;
}

@font-face {
    font-family: 'Poppins';
    font-style: normal;
    src: url(${fontSource}/fonts/Poppins/Poppins-Thin.ttf) format('truetype');
    font-weight: 100;
}

@font-face {
    font-family: 'Poppins';
    font-style: italic;
    src: url(${fontSource}/fonts/Poppins/Poppins-ThinItalic.ttf) format('truetype');
    font-weight: 100;
}
`

export const Preview: React.FC<FlexProps & { html: string }> = ({
  html,
  ...props
}) => {
  const content = useMemo(() => parse(html), [html])
  return (
    <Flex
      flex={1}
      direction="column"
      w="full"
      css={`
        div {
          flex: 1;
          display: flex;
        }
      `}
      {...props}
    >
      <root.div>
        <style>{style}</style>
        <body>{content}</body>
      </root.div>
    </Flex>
  )
}
