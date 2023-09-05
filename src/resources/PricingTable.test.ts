import Spackle from '../Spackle'
import { MemoryStore } from '../stores'
import fetch, { Response } from 'node-fetch'

jest.mock('node-fetch', () => jest.fn())

describe('Pricing table', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  it('retrieves table from api', async () => {
    const json = jest.fn() as jest.MockedFunction<any>
    json.mockResolvedValue({
      id: 'abc123',
      name: 'Default',
      intervals: ['month', 'year'],
      products: [
        {
          id: 1,
          name: 'Basic',
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
        },
      ],
    })
    mockFetch.mockResolvedValue({ ok: true, json } as Response)

    const memoryStore = new MemoryStore()
    const spackle = new Spackle('abc123', memoryStore)
    const table = await spackle.pricingTables.retrieve('abc123')
    expect(table).toEqual({
      id: 'abc123',
      name: 'Default',
      intervals: ['month', 'year'],
      products: [
        {
          id: 1,
          name: 'Basic',
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
        },
      ],
    })
  })
})
