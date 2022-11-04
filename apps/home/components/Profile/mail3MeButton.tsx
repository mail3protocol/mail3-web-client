import '@mail3/mail3-me'
import React from 'react'

const iconStyle = `
  width: 18px;
  height: 18px;
  margin-right: 8px;
  `

const bodyStyle = `
  font-weight: 700;
  font-size: 12px;
  width: 104px;
  height: 22px;
  border-radius: 100px;
  padding: 4px 24px;
`

const Mail3MeButton: React.FC<{ to: string }> = ({ to }) => (
  <div id="mail3-me-button-wrap">
    <mail3-me css={bodyStyle} icon_style={iconStyle} to={to} />
  </div>
)

export default Mail3MeButton
