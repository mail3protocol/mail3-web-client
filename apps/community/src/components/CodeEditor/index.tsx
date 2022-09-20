import CodeMirror from '@uiw/react-codemirror'
import { atomone } from '@uiw/codemirror-theme-atomone'
import { css } from '@codemirror/lang-css'
import { Flex, FlexProps } from '@chakra-ui/react'

const CodeEditor: React.FC<FlexProps> = ({ ...props }) => (
  <Flex
    w="full"
    css={`
      .cm-theme {
        width: 100%;
        font-size: 14px;
      }
      .cm-focused {
        outline: none !important;
      }
    `}
    rounded="8px"
    overflow="hidden"
    {...props}
  >
    <CodeMirror
      value={`div {
  color: red;
}`}
      width="100%"
      height="207px"
      theme={atomone}
      extensions={[css()]}
    />
  </Flex>
)

export default CodeEditor
