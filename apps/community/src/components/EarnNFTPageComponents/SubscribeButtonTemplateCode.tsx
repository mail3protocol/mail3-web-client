import type { TFunction } from 'react-i18next'

// language=html
export const subscribeButtonTemplateCode = (t: TFunction) => `<button
  style="
    background: #000;
    color: #fff;
    padding: 24px 34px 11px 26px;
    font-size: 24px;
    border-radius: 6px;
    border: none;
    opacity: 0.54;
    position: relative;
  "
>
  <span
    style="
      display: block;
      position: absolute;
      clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 20% 76%, 15% 100%, 15% 75%, 0% 75%);
      font-size: 14px;
      top: 3px;
      right: 9px;
      background: #4E51F4;
      padding: 0 5px 5px 5px;
      border-radius: 3px 3px 12px 12px;
    "
  >
    ${t('earn_nft')}
  </span>
  <span>${t('subscribe')}</span>
</button>
`

// language=css
export const subscribeButtonTemplateCssCode = `html, body{
  width: 100%;
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
}

* {
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-Thin.ttf) format('truetype');
  font-weight: 100;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-ThinItalic.ttf) format('truetype');
  font-weight: 100;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-ExtraLight.ttf) format('truetype');
  font-weight: 200;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-ExtraLightItalic.ttf) format('truetype');
  font-weight: 200;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-Light.ttf) format('truetype');
  font-weight: 300;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-LightItalic.ttf) format('truetype');
  font-weight: 300;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-Italic.ttf) format('truetype');
  font-weight: 400;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-Regular.ttf) format('truetype');
  font-weight: 400;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-Medium.ttf) format('truetype');
  font-weight: 500;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-MediumItalic.ttf) format('truetype');
  font-weight: 500;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-SemiBold.ttf) format('truetype');
  font-weight: 600;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-SemiBoldItalic.ttf) format('truetype');
  font-weight: 600;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-Bold.ttf) format('truetype');
  font-weight: 700;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-BoldItalic.ttf) format('truetype');
  font-weight: 700;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-ExtraBold.ttf) format('truetype');
  font-weight: 800;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-ExtraBoldItalic.ttf) format('truetype');
  font-weight: 800;
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  src: url(/fonts/Montserrat/Montserrat-Black.ttf) format('truetype');
  font-weight: 900;
}

@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  src: url(/fonts/Montserrat/Montserrat-BlackItalic.ttf) format('truetype');
  font-weight: 900;
}
`
