import {
  ApplySchemaAttributes,
  NodeExtensionSpec,
  NodeSpecOverride,
  ProsemirrorNode,
} from 'remirror'
import { HeadingExtension } from 'remirror/extensions'

const levelStyles: { [key in string]: string } = {
  1: 'font-size: 26px',
  2: 'font-size: 24px',
  3: 'font-size: 22px',
  4: 'font-size: 18px',
  5: 'font-size: 16px',
  6: 'font-size: 14px',
}

export class CustomizedHeadingExtension extends HeadingExtension {
  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      content: 'inline*',
      defining: true,
      draggable: false,
      ...override,
      attrs: {
        ...extra.defaults(),
        style: { default: 'font-size: 26px' },
        level: {
          default: this.options.defaultLevel,
        },
      },
      parseDOM: [
        ...this.options.levels.map((level) => ({
          tag: `h${level}`,
          getAttrs: (element: string | Node) => ({
            ...extra.parse(element),
            level,
          }),
        })),
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node: ProsemirrorNode) => {
        const level = node.attrs.level as string
        const attr = {
          style: levelStyles[level] || levelStyles['1'],
          ...extra.dom(node),
        }
        if (!this.options.levels.includes(node.attrs.level)) {
          return [`h${this.options.defaultLevel}`, attr, 0]
        }

        return [`h${node.attrs.level as string}`, attr, 0]
      },
    }
  }
}
