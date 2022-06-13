import React, { useMemo } from 'react'
import { Icon, IconProps } from '@chakra-ui/icons'
import AudioSvg from '../../../../assets/fileIcons/audio.svg'
import FolderSvg from '../../../../assets/fileIcons/folder.svg'
import ImageSvg from '../../../../assets/fileIcons/image.svg'
import PdfSvg from '../../../../assets/fileIcons/pdf.svg'
import VideoSvg from '../../../../assets/fileIcons/video.svg'
import ZipSvg from '../../../../assets/fileIcons/zip.svg'

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
