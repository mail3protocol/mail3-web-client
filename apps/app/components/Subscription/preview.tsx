import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtomValue } from 'jotai'
import React, { useEffect } from 'react'

export const SubPreviewIdAtom = atom(null)

const Container = styled(Box)`
  flex: 2;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
`

export const SubPreview: React.FC = () => {
  const id = useAtomValue(SubPreviewIdAtom)

  // useQuery [id]

  useEffect(() => {
    console.log('preview', id)
  }, [id])

  // loading

  // empty

  // content (parse html)

  return <Container />
}
