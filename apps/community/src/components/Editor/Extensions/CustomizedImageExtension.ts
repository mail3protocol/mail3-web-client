import { ImageAttributes, ImageExtension } from 'remirror/extensions'
import {
  ApplySchemaAttributes,
  isElementDomNode,
  NodeExtensionSpec,
  NodeSpecOverride,
  omitExtraAttributes,
  invariant,
  ErrorConstant,
  DelayedPromiseCreator,
} from 'remirror'
import { HomeAPI } from '../../../api/HomeAPI'

function getDimensions(element: HTMLElement) {
  let width = element.getAttribute('width') || ''
  let height = element.getAttribute('height') || ''
  if (element.style.width.endsWith('px')) {
    width = element.style.width
  }
  if (element.style.height.endsWith('px')) {
    height = element.style.height
  }
  return { width, height }
}

type SetProgress = (progress: number) => void

interface FileWithProgress {
  file: File
  progress: SetProgress
}

function getImageAttributes({
  element,
  parse,
}: {
  element: HTMLElement
  parse: ApplySchemaAttributes['parse']
}) {
  const { width, height } = getDimensions(element)
  return {
    ...parse(element),
    style: 'max-width: 100%;',
    alt: element.getAttribute('alt') ?? '',
    height: Number.parseInt(height || '0', 10) || null,
    src: element.getAttribute('src') ?? null,
    title: element.getAttribute('title') ?? '',
    width: Number.parseInt(width || '0', 10) || null,
    fileName: element.getAttribute('data-file-name') ?? null,
  }
}

type DelayedImage = DelayedPromiseCreator<ImageAttributes>

export function uploadHandlerFromHomeApi(
  files: FileWithProgress[],
  api: HomeAPI
): DelayedImage[] {
  invariant(files.length > 0, {
    code: ErrorConstant.EXTENSION,
    message:
      'The upload handler was applied for the image extension without any valid files',
  })

  let completed = 0
  const promises: Array<DelayedPromiseCreator<ImageAttributes>> = files.map(
    ({ file, progress }) =>
      async () => {
        const url = await api.uploadImage(file).then((r) => r.data.url)
        completed += 1
        progress(completed / files.length)
        return {
          src: url,
          fileName: '',
        }
      }
  )
  console.log(promises)

  return promises
}

export class CustomizedImageExtension extends ImageExtension {
  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    // @ts-ignore
    const { preferPastedTextContent } = this.options
    return {
      inline: true,
      draggable: true,
      selectable: false,
      ...override,
      attrs: {
        ...extra.defaults(),
        alt: { default: '' },
        crop: { default: null },
        height: { default: null },
        width: { default: null },
        rotate: { default: null },
        src: { default: null },
        title: { default: '' },
        fileName: { default: null },
        style: { default: 'max-width: 100%' },
        resizable: { default: false },
      },
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: (element) => {
            if (isElementDomNode(element)) {
              const attrs = getImageAttributes({ element, parse: extra.parse })

              if (
                preferPastedTextContent &&
                attrs.src?.startsWith('file:///')
              ) {
                return false
              }

              return attrs
            }

            return {}
          },
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        const attrs = omitExtraAttributes(node.attrs, extra)
        return ['img', { ...extra.dom(node), ...attrs }]
      },
    }
  }
}
