import { Grid, Box } from '@chakra-ui/layout'
import { Container } from '../../components/Container'
import { TipsPanel } from '../../components/TipsPanel'

export const Premium: React.FC = () => (
  <Container
    as={Grid}
    gridTemplateColumns="calc(calc(calc(100% - 20px) / 4) * 3) calc(calc(100% - 20px) / 4)"
    gap="20px"
    position="relative"
  >
    <Box bg="cardBackground" shadow="card" rounded="card" />
    <TipsPanel />
  </Container>
)
