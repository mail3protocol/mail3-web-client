import { describe, it, assert } from 'vitest'
import { truncateMiddle0xMail } from './string'

describe('Utils String', () => {
  describe('Function truncateMiddle0xMail', () => {
    it('should test normal ens', () => {
      const ensCase = 'mail3.ens@mail3.me'
      assert.equal(truncateMiddle0xMail(ensCase), ensCase)
    })

    it('should test ethereum address (0x with 42 length)', () => {
      const testAddress = '0x1d970Bdc0828CeBFe8c7E4BdBc68908e12C56A30@mail3.me'
      assert.equal(truncateMiddle0xMail(testAddress), '0x1d97...6A30@mail3.me')
    })
  })
})
