import Spackle from '../Spackle'
import FileStore from './FileStore'

describe('FileStore', () => {
  it('returns customer data on getCustomerData', async () => {
    const fileStore = new FileStore('/tmp/spackle.json')
    const spackle = new Spackle('abc123', fileStore)
    await spackle.getStore().setCustomerData('cus_000000000', {
      version: 1,
      subscriptions: [],
      features: [
        {
          id: 1,
          key: 'flag',
          name: 'Flag',
          type: 0,
          value_flag: true,
          value_limit: null,
        },
      ],
    })

    const customer = await spackle.customers.retrieve('cus_000000000')
    expect(customer.enabled('flag')).toEqual(true)
  })
})
