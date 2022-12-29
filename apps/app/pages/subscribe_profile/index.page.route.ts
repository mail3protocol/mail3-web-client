import { isPrimitiveEthAddress, isSupportedAddress } from 'shared'
import { PageContext } from '../../renderer/types'
import { API } from '../../api'

export const iKnowThePerformanceRisksOfAsyncRouteFunctions = true

// This is like '/@address'
export default async (pageContext: PageContext) => {
  const address = pageContext.urlPathname.split('/')[1]
  const isSupported = isSupportedAddress(address)
  if (!isSupported) return false
  const api = new API()

  async function getPrimitiveEthAddress() {
    return isPrimitiveEthAddress(address)
      ? address
      : api.getPrimitiveAddress(address)
  }

  const [uuid, primitiveAddress] = await Promise.all([
    api.checkIsProject(address).then((res) => res.data.uuid),
    getPrimitiveEthAddress().then((res) =>
      typeof res === 'string' ? res : res.data.eth_address
    ),
  ])
  if (!uuid || !primitiveAddress) return false

  return {
    routeParams: { address, uuid, primitiveAddress },
  }
}
