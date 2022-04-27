/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module '*.svg?url' {
  const path: string
  export default path
}

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
