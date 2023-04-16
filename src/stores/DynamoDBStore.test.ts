import Spackle from '../Spackle'
import * as credentials from './DynamoDBCredentials'

jest.mock('@aws-sdk/client-sts', () => {
  return {
    STSClient: {
      send: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          Credentials: {
            AccessKeyId: 'access',
            SecretAccessKey: 'secret',
            SessionToken: 'token',
            Expiration: new Date(),
          },
        })
      }),
    },
  }
})

jest.mock('@aws-sdk/client-dynamodb', () => {
  return {
    GetItemCommand: jest.fn(),
    DynamoDBClient: function client() {
      return {
        send: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            Item: {
              AccountId: {
                S: 'identity',
              },
              CustomerId: {
                S: 'cus_000000000:1',
              },
              State: {
                S: JSON.stringify({
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
                }),
              },
            },
          })
        }),
      }
    },
  }
})

describe('DynamoDBStore', () => {
  it('returns customer data on getCustomerData', async () => {
    const createSession = jest.spyOn(credentials, 'createSession')
    createSession.mockImplementation(() =>
      Promise.resolve({
        account_id: 'abc123',
        adapter: {
          name: 'dynamodb',
          identity_id: 'identity',
          role_arn: 'role',
          table_name: 'spackle-prod',
          token: 'token',
          region: 'us-west-2',
        },
      }),
    )

    const spackle = new Spackle('abc123')
    const customer = await spackle.customers.retrieve('cus_000000000')
    expect(customer.enabled('flag')).toEqual(true)
  })
})
