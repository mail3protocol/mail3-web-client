import '@mail3/mail3-me'
import React from 'react'

const iconStyle = `
  width: 24px;
  height: 24px;
  margin-right: 8px;
  `

const bodyStyle = `
  line-height: 5px;
  font-weight: 700;
  font-size: 20px;
  width: 250px;
  border-radius: 40px;
`

const Mail3MeButton: React.FC = () => (
  <div id="mail3-me-button-wrap">
    <mail3-me css={bodyStyle} icon_style={iconStyle} />
  </div>
)

export default Mail3MeButton
