import { atomWithReset } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'

const isEnableCardSignatureAtom = atomWithReset(false)
const cardSignatureBase64Atom = atomWithReset('')
const isRenderingAtom = atomWithReset(false)

function waitAllImagesLoaded(element: HTMLDivElement) {
  const images = element.querySelectorAll('img')
  return Promise.all(
    Array.from(images).map(
      (image) =>
        new Promise<void>((resole, reject) => {
          // eslint-disable-next-line no-param-reassign
          image.onload = () => {
            resole()
          }
          // eslint-disable-next-line no-param-reassign
          image.onerror = reject
        })
    )
  )
}

export function useCardSignature(renderKey: string[] = []) {
  const [isEnableCardSignature, setIsEnableCardSignature] = useAtom(
    isEnableCardSignatureAtom
  )
  const [cardSignatureBase64, setCardSignatureBase64] = useAtom(
    cardSignatureBase64Atom
  )
  const [blobUrl, setBlobUrl] = useState('')
  const [isRendering, setIsRendering] = useAtom(isRenderingAtom)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || isRendering) return
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    ;(async () => {
      setIsRendering(true)
      await waitAllImagesLoaded(element)
      await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        height: element.offsetHeight,
        width: element.offsetWidth,
        x: 0,
        y: scrollTop,
        scale: 2,
        backgroundColor: null,
      })
        .then(async (canvas) => {
          const base64 = canvas.toDataURL()
          const removeHeadBase64 = base64.split(',')[1]
          if (removeHeadBase64 !== cardSignatureBase64) {
            canvas.toBlob((blob) => {
              setBlobUrl(URL.createObjectURL(blob!))
            })
          }
          setCardSignatureBase64(removeHeadBase64)
        })
        .catch(() => false)
        .finally(() => {
          setIsRendering(false)
        })
    })()
  }, [isEnableCardSignature, ...renderKey])
  return {
    ref,
    cardSignatureBase64,
    blobUrl,
    isEnableCardSignature,
    setIsEnableCardSignature,
  }
}
