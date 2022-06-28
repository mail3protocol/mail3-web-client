import React from 'react'
import '@mail3/mail3-me'

const Mail3MeButton: React.FC = () => (
  <mail3-me
    to="mail3.eth@mail3.me"
    variant="ghost"
    css="color: #fff; border: none; display: inline; line-height: 16px; height: 24px; font-size: 16px"
    icon_style="width: 20px; height: 20px; margin-right: 10px;"
  />
)

export default Mail3MeButton
