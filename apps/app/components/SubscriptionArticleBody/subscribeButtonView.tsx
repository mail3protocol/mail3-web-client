import { Center, Box, Button } from '@chakra-ui/react'
import { RewardType } from 'models'

export const SubscribeButtonView: React.FC<{
  rewardType?: RewardType
  isFollow?: boolean
  onClick?: () => void
  isLoading: boolean
}> = ({ rewardType, isFollow, onClick, isLoading }) => {
  if (isFollow) {
    return (
      <Button
        isLoading={isLoading}
        onClick={onClick}
        variant="outline"
        w="150px"
      >
        Subscribed
      </Button>
    )
  }

  if (rewardType === RewardType.AIR || isLoading) {
    return (
      <Button isLoading={isLoading} onClick={onClick} w="150px">
        Subscribe
      </Button>
    )
  }

  return (
    <Button
      isLoading={isLoading}
      onClick={onClick}
      w="230px"
      overflow="hidden"
      justifyContent="flex-start"
      pl="24px"
    >
      Subscribe
      <Center
        bg="#4E52F5"
        transform="skew(-10deg)"
        position="absolute"
        top="0"
        right="0"
        w="105px"
        h="100%"
      >
        <Box transform="skew(10deg)">Earn NFT</Box>
      </Center>
    </Button>
  )
}
