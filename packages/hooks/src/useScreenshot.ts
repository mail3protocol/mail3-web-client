import html2canvas, { Options } from 'html2canvas'
import { useState } from 'react'

export const useScreenshot = (useFixHack = false) => {
  const [image, setImage] = useState('')

  const takeScreenshot = async (
    element: HTMLDivElement,
    options: Partial<Options> = {}
  ) =>
    html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      height: 566,
      width: 375,
      x: 0,
      y: 0,
      scale: 2,
      backgroundColor: null,
      ...options,
    }).then((canvas) => {
      const base64 = canvas.toDataURL()
      setImage(base64)
      return base64
    })

  const downloadScreenshot = async (
    element: HTMLDivElement,
    filename: string,
    options?: Partial<Options>
  ) => {
    // fix font position bug
    const style = document.createElement('style')
    document.head.appendChild(style)
    if (useFixHack)
      style.sheet?.insertRule(
        'body > div:last-child img { display: inline-block; }'
      )
    const dataSrc = await takeScreenshot(element, options)
    style.remove()
    const a = document.createElement('a')
    a.href = dataSrc
    a.download = filename
    a.click()
  }

  return { image, takeScreenshot, downloadScreenshot }
}
