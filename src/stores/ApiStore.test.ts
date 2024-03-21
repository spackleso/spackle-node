import Spackle from '../Spackle'
import fetch, { Response } from 'node-fetch'

jest.mock('node-fetch', () => jest.fn())

describe('ApiStore', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  it('returns customer data on getCustomerData', async () => {
    const json = jest.fn() as jest.MockedFunction<any>
    json.mockResolvedValue({
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
    mockFetch.mockResolvedValue({ ok: true, json } as Response)

    const spackle = new Spackle('abc123')
    const customer = await spackle.customers.retrieve('cus_000000000')
    expect(customer.enabled('flag')).toEqual(true)
  })
})
