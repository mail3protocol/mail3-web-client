import { describe, it, assert } from 'vitest'
import { truncateMailAddress } from 'shared'
import { isHttpUriNoBlankSpaceReg, isHttpUriReg } from './string'

describe('Utils String', () => {
  describe('Function truncateMiddle0xMail', () => {
    it('should test normal ens', () => {
      const ensCase = 'mail3.ens@mail3.me'
      assert.equal(truncateMailAddress(ensCase), ensCase)
    })

    it('should test normal email address', () => {
      const address = 'googlegooglegoogle@gmail.com'
      assert.equal(truncateMailAddress(address), address)
    })

    it('should test ethereum address (0x with 42 length)', () => {
      const testAddress = '0x1d970Bdc0828CeBFe8c7E4BdBc68908e12C56A30@mail3.me'
      assert.equal(truncateMailAddress(testAddress), '0x1d97...6A30@mail3.me')
    })
  })

  describe('RegExp isHttpUriReg', () => {
    it('should test list', () => {
      const list = [
        {
          str: 'htt://123456788',
          expected: false,
        },
        {
          str: 'http://example',
          expected: false,
        },
        {
          str: 'https://example',
          expected: false,
        },
        {
          str: 'http://example.com',
          expected: true,
        },
      ]
      list.forEach((item) => {
        assert.equal(isHttpUriReg.test(item.str), item.expected)
      })
    })
  })

  describe('RegExp isHttpUriNoBlankSpaceReg', () => {
    it('should test list', () => {
      const list = [
        {
          str: 'htt://123456788',
          expected: false,
        },
        {
          str: 'http://example',
          expected: false,
        },
        {
          str: 'https://example',
          expected: false,
        },
        {
          str: 'http://example.com',
          expected: true,
        },
      ]
      list.forEach((item) => {
        assert.equal(isHttpUriNoBlankSpaceReg.test(item.str), item.expected)
      })
    })

    it('should blank space case', () => {
      assert.equal(
        'https://mail3.me/test test'.replace(isHttpUriNoBlankSpaceReg, 'url'),
        'url test'
      )
    })
  })
})
