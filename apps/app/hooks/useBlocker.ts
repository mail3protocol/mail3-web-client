import { History, Transition } from 'history'
import { useContext, useEffect } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

type ExtendNavigator = Navigator & Pick<History, 'block'>
export function useBlocker(blocker: (tx: Transition) => void, when = true) {
  const { navigator } = useContext(NavigationContext)

  useEffect(() => {
    if (!when) return () => {}

    const unblock = (navigator as any as ExtendNavigator).block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock()
          tx.retry()
        },
      }

      blocker(autoUnblockingTx)
    })

    return unblock
  }, [navigator, blocker, when])
}
