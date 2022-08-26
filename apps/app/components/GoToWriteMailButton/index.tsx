import { Button } from 'ui'
import { Link, Box, LinkProps } from '@chakra-ui/react'
import { Link as RouteLink } from 'react-router-dom'
import { useTrackClick, TrackEvent } from 'hooks'
import { RoutePath } from '../../route/path'
import { ReactComponent as SVGWrite } from '../../assets/mailbox/write.svg'

export const GoToWriteMailButton: React.FC<LinkProps> = ({ ...props }) => {
  const trackWriteButton = useTrackClick(TrackEvent.ClickWrite)
  return (
    <Link
      as={RouteLink}
      display="inline-block"
      to={RoutePath.NewMessage}
      bottom={{
        base: '30px',
        md: 'unset',
      }}
      left={{
        base: '50%',
        md: 'unset',
      }}
      w={{ base: '250px', md: 'auto' }}
      position={{ base: 'fixed', md: 'static' }}
      zIndex={{ base: 99, md: 'unset' }}
      transform={{ base: 'translateX(-50%)', md: 'unset' }}
      onClick={() => trackWriteButton()}
      {...props}
    >
      <Button w="full">
        <SVGWrite /> <Box ml="10px">Write</Box>
      </Button>
    </Link>
  )
}
