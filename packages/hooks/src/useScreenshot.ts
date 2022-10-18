import html2canvas, { Options } from 'html2canvas'
import { useState } from 'react'

export const useScreenshot = () => {
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
    const dataSrc = await takeScreenshot(element, options)
    const a = document.createElement('a')
    a.href = dataSrc
    a.download = filename
    a.click()
  }

  return { image, takeScreenshot, downloadScreenshot }
}
