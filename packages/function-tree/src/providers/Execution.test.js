/* eslint-env mocha */
import FunctionTree from '../'
import assert from 'assert'

describe('ExecutionProvider', () => {
  it('should expose the instance on the context', () => {
    const ft = new FunctionTree()

    ft.run('something', [
      ({execution}) => {
        assert.equal(execution.name, 'something')
        assert.ok(execution.id)
        assert.ok(execution.datetime)
        assert.ok(execution.staticTree)
      }
    ])
  })
})
