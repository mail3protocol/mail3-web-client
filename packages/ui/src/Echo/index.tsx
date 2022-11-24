import React, { useMemo } from 'react'
import { isEnsDomain, isBitDomain, mailAddressToAddress } from 'shared'

interface EchoIframeProps {
  targetUri: string
  mailAddress: string
}

export const EchoIframe: React.FC<EchoIframeProps> = ({
  targetUri,
  mailAddress,
}) => {
  const allowDomains = [isBitDomain, isEnsDomain]

  const address = useMemo(
    () => mailAddressToAddress(mailAddress) || '',
    [mailAddress]
  )

  const iframeSrc = useMemo(() => {
    const src = new URL('https://embed.0xecho.com.ipns.page')
    const params: { [key: string]: string } = {
      'color-theme': 'light',
      modules: 'comment',
      receiver: 'mail3.eth',
      desc: '',
      target_uri: targetUri,
    }

    Object.keys(params).forEach((key) => {
      src.searchParams.set(key, params[key])
    })
    return src.href
  }, [targetUri, address])

  if (!allowDomains.some((fn) => fn(address))) return null

  return (
    <iframe
      src={iframeSrc}
      frameBorder="0"
      title="echo iframe"
      height="500px"
      width="100%"
    />
  )
}
