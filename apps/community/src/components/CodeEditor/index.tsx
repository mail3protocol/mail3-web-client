import CodeMirror from '@uiw/react-codemirror'
import { atomone } from '@uiw/codemirror-theme-atomone'
import { html } from '@codemirror/lang-html'
import { Flex, FlexProps } from '@chakra-ui/react'

export interface CodeEditorProps extends Omit<FlexProps, 'onChange'> {
  value: string
  onChange: (value: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  ...props
}) => (
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
      value={value}
      width="100%"
      height="207px"
      theme={atomone}
      extensions={[html()]}
      onChange={onChange}
    />
  </Flex>
)

export default CodeEditor
