import { register } from 'daodid-webcomponent'

register('dao-did')

const Daodid: React.FC<{ bitAccount: string }> = ({ bitAccount }) => (
  <dao-did cur-bit={bitAccount} theme="light" />
)

export default Daodid
