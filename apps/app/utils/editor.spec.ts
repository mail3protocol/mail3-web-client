import { describe, it, assert } from 'vitest'
import {
  DISABLED_FILENAME_SPECIAL_CHARACTERS,
  hasFilenameSpecialCharacters,
} from './editor'

describe('Utils Editor', () => {
  describe('Function hasFilenameSpecialCharacters', () => {
    const fileNameList = [
      ...DISABLED_FILENAME_SPECIAL_CHARACTERS.map((char) => ({
        name: `fi${char}le.png`,
        has: true,
      })),
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
