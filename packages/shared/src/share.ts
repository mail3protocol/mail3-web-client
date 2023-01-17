export const shareToTwitter = (config: {
  text: string
  url: string
  via?: string
  hashtags?: Array<string>
}) => {
  const hashtagString = config.hashtags
    ? `&hashtags=${config.hashtags.join(',')}`
    : ''

  const viaString = config.via ? `&via=${config.via}` : ''

  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    config.text
  )}&url=${encodeURIComponent(config.url)}${hashtagString}${viaString}`

  window.open(
    url,
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
  )
}

export const shareToTelegram = (config: { text: string; url: string }) => {
  const url = `https://t.me/share/url?text=${encodeURIComponent(
    config.text
  )}&url=${encodeURIComponent(config.url)}`

  window.open(
    url,
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
  )
}
