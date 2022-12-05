import { Flex, FlexProps } from '@chakra-ui/react'
import { motion, MotionStyle } from 'framer-motion'
import { forwardRef } from 'react'

export interface SwitchProps extends FlexProps {
  checked?: boolean
  handleStyle?: MotionStyle
  inactiveBg?: string
  activeBg?: string
  activeBorderColor?: string
}

export const BaseSwitch = forwardRef<HTMLLabelElement, SwitchProps>(
  (
    {
      checked,
      handleStyle = {},
      activeBg = '#fff',
      activeBorderColor = '#000',
      children,
      ...props
    },
    ref
  ) => (
    <Flex
      position="relative"
      h="30px"
      w="55px"
      display="inline-flex"
      bg="#F3F3F3"
      rounded={props.w || props.h || '100px'}
      align="center"
      px="4px"
      cursor="pointer"
      border="1px solid #e7e7e7"
      {...props}
      ref={ref as any}
      data-isOn={checked}
      css={`
        &[data-isOn='true'] {
          justify-content: flex-end;
          background-color: ${activeBg};
          border-color: ${activeBorderColor};
        }
        .handle {
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 4px rgba(16, 16, 16, 0.2);
          position: relative;
        }
        ${props.css}
      `}
    >
      <motion.div
        className="handle"
        layout
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
        style={handleStyle}
      >
        {children}
      </motion.div>
    </Flex>
  )
)
