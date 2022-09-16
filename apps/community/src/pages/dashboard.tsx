import { Box, Grid, Center, Avatar, Text } from '@chakra-ui/react'
import { Container } from '../components/Container'

export const Dashboard: React.FC = () => (
  <Container
    as={Grid}
    gap="20px"
    gridTemplateColumns="3fr 1fr"
    gridTemplateRows="132px 1fr"
  >
    <Box bg="cardBackground" shadow="card" rounded="card" fontSize="14px">
      <Grid
        gridTemplateColumns="repeat(4, 1fr)"
        gridTemplateRows="1fr"
        h="full"
      >
        <Center flexDirection="column">
          <Avatar />
          <Text mt="4px" fontWeight="bold">
            Mail3
          </Text>
        </Center>
      </Grid>
    </Box>
    <Box bg="cardBackground" shadow="card" rounded="card">
      Send Message
    </Box>
    <Box bg="cardBackground" shadow="card" rounded="card" gridColumn="1 / 3">
      Records
    </Box>
  </Container>
)
