import { ImageExtension } from 'remirror/extensions'
import {
  ApplySchemaAttributes,
  isElementDomNode,
  NodeExtensionSpec,
  NodeSpecOverride,
} from 'remirror'

function getImageAttributes({
  element,
  parse,
}: {
  element: HTMLElement
  parse: ApplySchemaAttributes['parse']
}) {
  const width = element.getAttribute('width') || ''
  const height = element.getAttribute('height') || ''
  const style = element.style.cssText
  return {
    ...parse(element),
    alt: element.getAttribute('alt') ?? '',
    height: Number.parseInt(height || '0', 10) || null,
    src: element.getAttribute('src') ?? null,
    title: element.getAttribute('title') ?? '',
    width: Number.parseInt(width || '0', 10) || null,
    fileName: element.getAttribute('data-file-name') ?? null,
    style,
  }
}

export class AttachmentImageExtensionExtension extends ImageExtension {
  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    const spec = super.createNodeSpec(extra, override)
    return {
      ...spec,
      attrs: {
        ...spec.attrs,
        style: { default: '' },
        'content-id': { default: '' },
      },
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: (element) =>
            isElementDomNode(element)
              ? getImageAttributes({ element, parse: extra.parse })
              : {},
        },
        ...(override.parseDOM ?? []),
      ],
    }
  }
}
