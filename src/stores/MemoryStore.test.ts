import Spackle from '../Spackle'
import MemoryStore from './MemoryStore'

describe('MemoryStore', () => {
  it('returns customer data on getCustomerData', async () => {
    const memoryStore = new MemoryStore()
    const spackle = new Spackle('abc123', memoryStore)
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
