import { useEffect, useState } from 'react'

export function useInnerSize() {
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1920)
  useEffect(() => {
    function resize() {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  })
  return {
    width,
    height,
  }
}
