import React, { useMemo } from 'react'
import { Icon, IconProps } from '@chakra-ui/icons'
import { ReactComponent as AudioSvg } from '../../../assets/fileIcons-preview/audio.svg'
import { ReactComponent as FolderSvg } from '../../../assets/fileIcons-preview/folder.svg'
import { ReactComponent as ImageSvg } from '../../../assets/fileIcons-preview/image.svg'
import { ReactComponent as PdfSvg } from '../../../assets/fileIcons-preview/pdf.svg'
import { ReactComponent as VideoSvg } from '../../../assets/fileIcons-preview/video.svg'
import { ReactComponent as ZipSvg } from '../../../assets/fileIcons-preview/zip.svg'

export const FileIcon: React.FC<{ type: string } & IconProps> = ({
  type,
  ...props
}) => {
  const as = useMemo(() => {
    if (/image\/*/.test(type)) {
      return ImageSvg
    }
    if (/audio\/*/.test(type)) {
      return AudioSvg
    }
    if (/video\/*/.test(type)) {
      return VideoSvg
    }
    if (type === 'application/pdf') {
      return PdfSvg
    }
    if (
      [
        'application/zip',
        'application/x-gtar',
        'application/x-gzip',
        'application/x-7z-compressed',
        'application/vnd.rar',
      ].includes(type)
    ) {
      return ZipSvg
    }
    return FolderSvg
  }, [type])

  return <Icon as={as} {...props} />
}
