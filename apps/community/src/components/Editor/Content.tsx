import { Flex, FlexProps } from '@chakra-ui/react'
import { useRemirrorContext } from '@remirror/react'
import root from 'react-shadow'

// language=css
const style = `
* {
  font-size: 14px;
}
.content-container {
  display: flex;
}
.ProseMirror.remirror-editor, .content-container {
  flex: 1;
}
div:focus-visible {
  outline: none;
}
.remirror-is-empty:first-of-type::before {
  position: absolute;
  color: #aaa;
  pointer-events: none;
  height: 0;
  content: attr(data-placeholder);
}
`

export const Content: React.FC<FlexProps> = ({ ...props }) => {
  const { getRootProps } = useRemirrorContext({ autoUpdate: true })
  return (
    <Flex
      flex={1}
      direction="column"
      css={`
        div {
          flex: 1;
          display: flex;
        }
      `}
      {...props}
    >
      <root.div>
        <style>{style}</style>
        <div className="content-container" {...getRootProps()} />
      </root.div>
    </Flex>
  )
}
