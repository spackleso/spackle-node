import Spackle from './Spackle'

describe('Spackle', () => {
  it('can be configured with an API key', () => {
    const spackle = new Spackle('my-api-key')
    expect(spackle.apiKey).toEqual('my-api-key')
  })
})
