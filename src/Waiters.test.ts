import Spackle from './Spackle'
import { MemoryStore } from './stores'

describe('Waiters', () => {
  it('can wait for a customer', async () => {
    const spackle = new Spackle('abc123', new MemoryStore())
    await expect(
      spackle.waiters.waitForCustomer('cus_000000000', 1),
    ).rejects.toThrow(Error)

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
    const customer = await spackle.waiters.waitForCustomer('cus_000000000', 1)
    expect(customer.enabled('flag')).toEqual(true)
  })

  it('can wait for a subscription', async () => {
    const spackle = new Spackle('abc123', new MemoryStore())
    await expect(
      spackle.waiters.waitForSubscription('cus_000000000', 'sub_000000000', 1),
    ).rejects.toThrow(Error)

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

    const subscription = await spackle.waiters.waitForSubscription(
      'cus_000000000',
      'sub_000000000',
      1,
    )
    expect(subscription.id).toEqual('sub_000000000')
  })

  it('can wait for a subscription with status filter', async () => {
    const spackle = new Spackle('abc123', new MemoryStore())

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

    await expect(
      spackle.waiters.waitForSubscription('cus_000000000', 'sub_000000000', 1, {
        status: 'active',
      }),
    ).rejects.toThrow(Error)

    await spackle.getStore().setCustomerData('cus_000000000', {
      version: 1,
      subscriptions: [
        {
          id: 'sub_000000000',
          status: 'active',
        } as any,
      ],
      features: [],
    })

    const subscription = await spackle.waiters.waitForSubscription(
      'cus_000000000',
      'sub_000000000',
      1,
    )
    expect(subscription.id).toEqual('sub_000000000')
  })
})
