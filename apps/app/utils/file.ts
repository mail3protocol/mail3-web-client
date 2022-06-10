export function convertFileToBase64(file: File) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
  })
}

export function kbToMb(value: number) {
  return (value / 1024 ** 2).toFixed(2)
}

export function convertBlobToBase64(blob: Blob) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target!.result as string)
    }
    reader.readAsDataURL(blob)
  })
}
