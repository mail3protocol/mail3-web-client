const fs = require('fs')
const path = require('path')

const WEIGHT_MAP = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900,
}

const output = fs
  .readdirSync(process.argv[2])
  .filter((name) => name !== 'generate-css.js')
  .map((name) => {
    const isItalic = name.endsWith('Italic.ttf')
    const cutNameTemp = name.substring(8)
    const cutName = cutNameTemp.substring(
      0,
      cutNameTemp.length - (isItalic ? 10 : 4)
    )
    const weight = WEIGHT_MAP[cutName]
    return `@font-face {
  font-family: 'Poppins';
  font-style: ${isItalic ? 'italic' : 'normal'};
  src: url(/fonts/Poppins/${name}) format('truetype');
  font-weight: ${weight};
}
`
  })
  .join('\n')

fs.writeFileSync(process.argv[3], output)
