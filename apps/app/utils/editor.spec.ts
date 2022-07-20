import { describe, it, assert } from 'vitest'
import { hasFilenameSpecialCharacters } from './editor'

describe('Utils Editor', () => {
  describe('Function hasFilenameSpecialCharacters', () => {
    const fileNameList = [
      {
        name: 'file&.png',
        has: true,
      },
      {
        name: 'file/.png',
        has: true,
      },
      {
        name: 'file>.png',
        has: true,
      },
      {
        name: '<file>.png',
        has: true,
      },
      {
        name: 'fi<le.png',
        has: true,
      },
      {
        name: 'file|file.png',
        has: true,
      },
      {
        name: 'file:file.png',
        has: true,
      },
      {
        name: 'file.png',
        has: false,
      },
    ]

    it('should test filename list', () => {
      fileNameList.forEach((item) => {
        assert.equal(hasFilenameSpecialCharacters(item.name), item.has)
      })
    })
  })
})
