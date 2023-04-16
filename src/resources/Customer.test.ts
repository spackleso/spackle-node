import Spackle from '../Spackle'
import { MemoryStore } from '../stores'

describe('Customer', () => {
  it('can check if a feature is enabled', async () => {
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

  it('can check if a limit is enabled', async () => {
    const memoryStore = new MemoryStore()
    const spackle = new Spackle('abc123', memoryStore)
    await spackle.getStore().setCustomerData('cus_000000000', {
      version: 1,
      subscriptions: [],
      features: [
        {
          id: 1,
          key: 'limit',
          name: 'Limit',
          type: 1,
          value_flag: null,
          value_limit: 100,
        },
        {
          id: 2,
          key: 'unlimited',
          name: 'Unlimited',
          type: 1,
          value_flag: null,
          value_limit: null,
        },
      ],
    })

    const customer = await spackle.customers.retrieve('cus_000000000')
    expect(customer.limit('limit')).toEqual(100)
    expect(customer.limit('unlimited')).toEqual(Infinity)
  })

  it('can return subscription data', async () => {
    const memoryStore = new MemoryStore()
    const spackle = new Spackle('abc123', memoryStore)
    await spackle.getStore().setCustomerData('cus_000000000', {
      version: 1,
      subscriptions: [
        {
          id: 'sub_000000000',
          status: 'trialing',
        } as any,
      ],
      features: [],
    })

    const customer = await spackle.customers.retrieve('cus_000000000')
    expect(customer.subscriptions()).toHaveLength(1)
    expect(customer.subscriptions()[0].id).toEqual('sub_000000000')
  })
})
