import { BlockquoteExtension } from 'remirror/extensions'
import {
  ApplySchemaAttributes,
  NodeExtensionSpec,
  NodeSpecOverride,
} from 'remirror'

export class CustomizedBlockquoteExtension extends BlockquoteExtension {
  // eslint-disable-next-line class-methods-use-this
  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      content: 'block+',
      defining: true,
      draggable: false,
      ...override,
      attrs: extra.defaults(),
      parseDOM: [
        { tag: 'blockquote', getAttrs: extra.parse, priority: 100 },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => [
        'blockquote',
        {
          ...extra.dom(node),
          style:
            'border-left: 3px solid #dee2e6; padding-left: 10px; margin: 0; color: rgb(136, 136, 136);',
        },
        0,
      ],
    }
  }
}
