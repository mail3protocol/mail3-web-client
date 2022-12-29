import { PageContext } from '../../renderer/types'

export async function onBeforeRender(pageContext: PageContext) {
  const { primitiveAddress, uuid, address } = pageContext.routeParams!
  return {
    pageContext: {
      pageProps: {
        uuid,
        primitiveAddress,
        address,
      },
    },
  }
}
