import { useEffect, useRef, useState } from 'react'

enum PositionType {
  Absolute = 'absolute',
  Fixed = 'fixed',
}

enum DirectionType { // scroll bar direction
  Up = -1,
  Down = 1,
}

export const useDynamicSticky = ({
  navbarHeight,
}: {
  navbarHeight: number
}) => {
  const [top, setTop] = useState(0)
  const [position, setPosition] = useState(PositionType.Absolute)
  const positionRef = useRef<PositionType>(PositionType.Absolute)
  const lastTopRef = useRef<number>(0)
  const directionRef = useRef<DirectionType>(DirectionType.Up)
  const fixTopRef = useRef<number>(0)

  const onScroll = () => {
    const y = window.scrollY
    if (y > lastTopRef.current) {
      lastTopRef.current = y
      if (
        directionRef.current !== DirectionType.Down &&
        positionRef.current === PositionType.Fixed
      ) {
        fixTopRef.current = lastTopRef.current - 1
        setTop(fixTopRef.current)
        setPosition(PositionType.Absolute)
        positionRef.current = PositionType.Absolute
      }
      directionRef.current = DirectionType.Down
      if (
        y > navbarHeight + fixTopRef.current &&
        positionRef.current !== PositionType.Fixed
      ) {
        fixTopRef.current = -navbarHeight
        setTop(-navbarHeight)
        setPosition(PositionType.Fixed)
        positionRef.current = PositionType.Fixed
      }
    } else {
      lastTopRef.current = y
      if (
        directionRef.current !== DirectionType.Up &&
        positionRef.current === PositionType.Fixed
      ) {
        fixTopRef.current = lastTopRef.current - navbarHeight + 1
        setTop(fixTopRef.current)
        setPosition(PositionType.Absolute)
        positionRef.current = PositionType.Absolute
      }
      directionRef.current = DirectionType.Up
      if (y < fixTopRef.current && positionRef.current !== PositionType.Fixed) {
        setTop(-1)
        setPosition(PositionType.Fixed)
        positionRef.current = PositionType.Fixed
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll, false)

    return () => {
      window.removeEventListener('scroll', onScroll, false)
    }
  }, [])
  return {
    top,
    position,
  }
}
