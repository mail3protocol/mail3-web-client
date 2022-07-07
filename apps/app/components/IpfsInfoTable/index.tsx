import { Box, Grid, Icon, Link } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'next-i18next'
import { TrackEvent, useTrackClick } from 'hooks'

export const ExternalLink = () => (
  <Icon w="10px" h="10px" viewBox="0 0 10 10" ml="8px">
    <path
      d="M4.63993e-05 9.472C4.64049e-05 9.344 0.064563 9.216 0.129079 9.152L9.16134 0.192004C9.35489 4.12347e-06 9.61295 4.13475e-06 9.8065 0.192004C10 0.384004 10 0.704004 9.8065 0.896004L0.77424 9.856C0.580692 10.048 0.258111 10.048 0.0645628 9.856C4.66333e-05 9.728 4.63937e-05 9.6 4.63993e-05 9.472Z"
      fill="currentColor"
    />
    <path
      d="M2.3871 0.512C2.3871 0.256 2.58065 -3.2431e-07 2.90323 -3.1021e-07L9.48387 -2.25607e-08C9.74194 -1.12804e-08 10 0.192 10 0.512L10 7.104C10 7.36 9.80645 7.616 9.48387 7.616C9.16129 7.616 8.96774 7.424 8.96774 7.104L8.96774 1.024L2.83871 1.024C2.58065 1.024 2.3871 0.768 2.3871 0.512Z"
      fill="currentColor"
    />
  </Icon>
)

export const IpfsInfoTable: React.FC<{
  ipfs?: string
  ethAddress?: string
  contentDigest?: string
}> = ({ ipfs, ethAddress, contentDigest }) => {
  const [t] = useTranslation('mailboxes')
  function pendingBackupText(str?: string) {
    return !str ? t('ipfs.pending') : str
  }
  const ipfsLink = ipfs || undefined
  const ethAddressLink = ethAddress
    ? `https://etherscan.io/address/${ethAddress}`
    : undefined
  const trackClickDInfoBlockchainLink = useTrackClick(
    TrackEvent.clickDInfoBlockchainLink
  )
  const trackClickDInfoIpfsLink = useTrackClick(TrackEvent.clickDInfoIpfsLink)

  return (
    <Grid
      templateColumns="160px calc(100% - 160px)"
      templateRows="min(40px, auto) min(40px, auto) min(40px, auto)"
      bg="rgb(250, 250, 255)"
      border="1px solid #E7E7E7"
      overflow="hidden"
      color="#6F6F6F"
      fontSize="12px"
      rounded="8px"
      maxW="718px"
      css={`
        div {
          padding: 10px 12px;
          border-bottom: 1px solid #e7e7e7;
        }
        div:nth-child(odd) {
          background-color: rgb(245, 245, 255);
          border-right: 1px solid #e7e7e7;
        }
        div:nth-last-child(1),
        div:nth-last-child(2) {
          border-bottom: none;
        }
        a {
          width: 100%;
        }
        a:hover {
          cursor: wait;
        }
        a[href]:hover {
          color: #000;
          text-decoration: underline;
          cursor: pointer;
        }
      `}
    >
      <Box>
        <Link
          href={ethAddressLink}
          onClick={() => trackClickDInfoBlockchainLink()}
          target="_blank"
        >
          {t('ipfs.eth_address')}
          <ExternalLink />
        </Link>
      </Box>
      <Box>
        <Link
          href={ethAddressLink}
          onClick={() => trackClickDInfoBlockchainLink()}
          target="_blank"
        >
          {pendingBackupText(ethAddress)}
        </Link>
      </Box>
      <Box>
        <Link
          href={ipfsLink}
          onClick={() => trackClickDInfoIpfsLink()}
          target="_blank"
        >
          {t('ipfs.ipfs_link')}
          <ExternalLink />
        </Link>
      </Box>
      <Box>
        <Link
          href={ipfsLink}
          onClick={() => trackClickDInfoIpfsLink()}
          target="_blank"
        >
          {pendingBackupText(ipfs)}
        </Link>
      </Box>
      <Box>{t('ipfs.content_digest')}</Box>
      <Box>{pendingBackupText(contentDigest)}</Box>
    </Grid>
  )
}
