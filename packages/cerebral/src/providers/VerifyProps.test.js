/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'

describe('VerifyProps', () => {
  it('should throw when invalid props', () => {
    const controller = new Controller({
      signals: {
        foo: () => {}
      }
    })
    assert.throws(() => {
      const obj = {}
      obj.circular = obj
      controller.getSignal('foo')(obj)
    })
  })
})
