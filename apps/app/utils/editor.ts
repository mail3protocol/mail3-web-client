import html2canvas from 'html2canvas-objectfit-fix'

export async function onRenderElementToImage(element: HTMLDivElement) {
  const boundingClientRect = element.getBoundingClientRect()
  return html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    height: element.offsetHeight,
    width: element.offsetWidth,
    x: boundingClientRect.x,
    y: boundingClientRect.y,
    scale: 2,
    backgroundColor: null,
  }).then(async (canvas) => canvas.toDataURL())
}
