export const shareToTwitter = (config: {
  text: string
  url: string
  hashtags?: Array<string>
}) => {
  const hashtagString = config.hashtags
    ? `&hashtags=${config.hashtags.join(',')}`
    : ''
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    config.text
  )}&url=${encodeURIComponent(config.url)}${hashtagString}`

  window.open(
    url,
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
  )
}
