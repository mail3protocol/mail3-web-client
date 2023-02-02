import {
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  keyframes,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useMemo } from 'react'
import ActiveMePng from '../../assets/png/partner_brands/ActiveMe.png'
import AssurePng from '../../assets/png/partner_brands/Assure.png'
import AttaPng from '../../assets/png/partner_brands/Atta.png'
import AvatarDAOPng from '../../assets/png/partner_brands/AvatarDAO.png'
import BitPng from '../../assets/png/partner_brands/Bit.png'
import BitKeepPng from '../../assets/png/partner_brands/BitKeep.png'
import BNSPng from '../../assets/png/partner_brands/BNS.png'
import BubblePng from '../../assets/png/partner_brands/Bubble.png'
import CeresPng from '../../assets/png/partner_brands/Ceres.png'
import CKBytePng from '../../assets/png/partner_brands/CKByte.png'
import Cluster3Png from '../../assets/png/partner_brands/Cluster3.png'
import CoinbasePng from '../../assets/png/partner_brands/Coinbase.png'
import CwalletPng from '../../assets/png/partner_brands/Cwallet.png'
import CyberConnectPng from '../../assets/png/partner_brands/CyberConnect.png'
import DaoStarterPng from '../../assets/png/partner_brands/DaoStarter.png'
import DappOSPng from '../../assets/png/partner_brands/DappOS.png'
import DappRadarPng from '../../assets/png/partner_brands/DappRadar.png'
import DeBoxPng from '../../assets/png/partner_brands/DeBox.png'
import DtoolsPng from '../../assets/png/partner_brands/Dtools.png'
import EchoPng from '../../assets/png/partner_brands/Echo.png'
import EnviZionPng from '../../assets/png/partner_brands/EnviZion.png'
import FOBOPng from '../../assets/png/partner_brands/FOBO.png'
import ForMetasPng from '../../assets/png/partner_brands/For-Metas.png'
import FVPng from '../../assets/png/partner_brands/FV.png'
import GalxePng from '../../assets/png/partner_brands/Galxe.png'
import GangsDAOPng from '../../assets/png/partner_brands/GangsDAO.png'
import HuntingNFTPng from '../../assets/png/partner_brands/HuntingNFT.png'
import ImTokenPng from '../../assets/png/partner_brands/ImToken.png'
import KNN3Png from '../../assets/png/partner_brands/KNN3.png'
import Link3Png from '../../assets/png/partner_brands/Link3.png'
import MechCraftPng from '../../assets/png/partner_brands/MechCraft.png'
import MemoworldPng from '../../assets/png/partner_brands/memoworld.png'
import MetaBankPng from '../../assets/png/partner_brands/MetaBank.png'
import MetarisingPng from '../../assets/png/partner_brands/Metarising.png'
import MetaverseSpacePng from '../../assets/png/partner_brands/MetaverseSpace.png'
import MixinPng from '../../assets/png/partner_brands/Mixin.png'
import NameDAOPng from '../../assets/png/partner_brands/NameDAO.png'
import NenonbrainPng from '../../assets/png/partner_brands/Nenonbrain.png'
import NervapePng from '../../assets/png/partner_brands/Nervape.png'
import OutSadNFTPng from '../../assets/png/partner_brands/OutSadNFT.png'
import Port3Png from '../../assets/png/partner_brands/Port3.png'
import Quest3Png from '../../assets/png/partner_brands/Quest3.png'
import ReiPng from '../../assets/png/partner_brands/Rei.png'
import RelactionPng from '../../assets/png/partner_brands/Relaction.png'
import SaaSGoPng from '../../assets/png/partner_brands/SaaSGo.png'
import SeerPng from '../../assets/png/partner_brands/Seer.png'
import SEQPng from '../../assets/png/partner_brands/SEQ.png'
import SlashPng from '../../assets/png/partner_brands/Slash.png'
import SpaceIDPng from '../../assets/png/partner_brands/SpaceID.png'
import SuperheroPng from '../../assets/png/partner_brands/Superhero.png'
import TopBidderPng from '../../assets/png/partner_brands/TopBidder.png'
import UnstoppablePng from '../../assets/png/partner_brands/Unstoppable.png'
import InVariaPng from '../../assets/png/partner_brands/InVaria.png'
import VerticalPng from '../../assets/png/partner_brands/Vertical.png'
import Web3GoPng from '../../assets/png/partner_brands/Web3Go.png'
import XProtocolPng from '../../assets/png/partner_brands/XProtocol.png'
import ZilliqaPng from '../../assets/png/partner_brands/Zilliqa.png'
import ZkpassPng from '../../assets/png/partner_brands/Zkpass.png'

const rollingKeyframes = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`

interface BrandItem {
  src: string
  width: number
  height: number
}

export const BrandWall: React.FC = () => {
  const brandItems: BrandItem[] = [
    BitPng,
    UnstoppablePng,
    CyberConnectPng,
    GalxePng,
    Quest3Png,
    RelactionPng,
    SpaceIDPng,
    AssurePng,
    BNSPng,
    SuperheroPng,
    NameDAOPng,
    FVPng,
    BubblePng,
    XProtocolPng,
    DtoolsPng,
    DaoStarterPng,
    HuntingNFTPng,
    DappOSPng,
    CKBytePng,
    ForMetasPng,
    SaaSGoPng,
    MechCraftPng,
    Port3Png,
    OutSadNFTPng,
    CeresPng,
    MixinPng,
    AttaPng,
    NenonbrainPng,
    DeBoxPng,
    VerticalPng,
    AvatarDAOPng,
    MemoworldPng,
    FOBOPng,
    SeerPng,
    NervapePng,
    Link3Png,
    EchoPng,
    ZilliqaPng,
    Cluster3Png,
    CoinbasePng,
    ImTokenPng,
    BitKeepPng,
    DappRadarPng,
    ZkpassPng,
    CwalletPng,
    SlashPng,
    MetaBankPng,
    MetarisingPng,
    Web3GoPng,
    InVariaPng,
    GangsDAOPng,
    ActiveMePng,
    SEQPng,
    MetaverseSpacePng,
    KNN3Png,
    TopBidderPng,
    EnviZionPng,
    ReiPng,
  ]
  const countOfBrandItemInDesktopSizeRow = 20
  const countOfBrandItemInMobileSizeRow = 12
  const countOfBrandItemInRow = useBreakpointValue({
    base: countOfBrandItemInMobileSizeRow,
    sm: countOfBrandItemInDesktopSizeRow,
  }) as number
  const currentCountOfRow = Math.ceil(brandItems.length / countOfBrandItemInRow)
  const countOfDesktopRow = Math.ceil(
    brandItems.length / countOfBrandItemInDesktopSizeRow
  )
  const countOfMobileRow = Math.ceil(
    brandItems.length / countOfBrandItemInMobileSizeRow
  )
  const brandItemRows = useMemo(
    () =>
      new Array(currentCountOfRow)
        .fill(0)
        .map((_, i) =>
          brandItems.slice(
            i * countOfBrandItemInRow,
            i * countOfBrandItemInRow + countOfBrandItemInRow
          )
        ),
    [currentCountOfRow, countOfBrandItemInRow]
  )

  return (
    <Flex
      direction="column"
      bg="white"
      align="center"
      h={{ base: '556px', sm: '614px' }}
      pt={{ base: '42px', sm: '58px' }}
    >
      <Heading
        fontWeight={700}
        fontSize={{ base: '24px', sm: '48px' }}
        lineHeight="72px"
        mb={{ base: '42px', sm: '80px' }}
      >
        Partners
      </Heading>
      <Grid
        templateRows={{
          base: `repeat(${countOfMobileRow}, 60px)`,
          sm: `repeat(${countOfDesktopRow}, 80px)`,
        }}
        pos="relative"
        flex={1}
        w="full"
        overflow="hidden"
        rowGap={{ base: '20px', sm: '30px' }}
      >
        {brandItemRows.map((brands, brandItemIndex) => (
          <Flex
            // eslint-disable-next-line react/no-array-index-key
            key={brandItemIndex}
            minW="full"
            w="full"
            h="full"
            pl="30px"
          >
            <Flex
              w="auto"
              animation={`${rollingKeyframes} 60s infinite linear`}
              css={{
                animationDirection:
                  brandItemIndex % 2 === 0 ? undefined : 'reverse',
              }}
            >
              {brands.concat(brands).map((brand, brandIndex) => (
                <Center
                  // eslint-disable-next-line react/no-array-index-key
                  key={brandIndex}
                  w={{ base: '150px', sm: '200px' }}
                  minW={{ base: '150px', sm: '200px' }}
                  h="full"
                  shadow="0 6px 16px rgba(0, 0, 0, 0.05)"
                  rounded="10px"
                  border="1px solid #E8E8E8"
                  ml={{ base: '20px', sm: '50px' }}
                  px={{ base: '12px', sm: '28px' }}
                  py="14px"
                >
                  <Image
                    {...brand}
                    style={{
                      // width: `${brand.width / IMAGE_MAGNIFICATION}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Center>
              ))}
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  )
}
