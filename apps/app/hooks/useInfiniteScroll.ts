import { useEffect, useState } from 'react'

type R<A> = [boolean, (value: A) => void]

export const useInfiniteScroll = (cb: Function): R<boolean> => {
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const isScrolling = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    ) {
      return
    }
    setIsFetching(true)
  }

  useEffect(() => {
    window.addEventListener('scroll', isScrolling)
    return () => window.removeEventListener('scroll', isScrolling)
  }, [])

  useEffect(() => {
    if (!isFetching) return
    cb()
  }, [isFetching])

  return [isFetching, setIsFetching]
}
