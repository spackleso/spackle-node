import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

import Spackle from '../Spackle'
import Store from './Store'
import fetch from 'node-fetch'
import { createSession, fromSpackleCredentials } from './DynamoDBCredentials'

export type SpackleSession = {
  account_id: string
  adapter: {
    name: string
    identity_id: string
    role_arn: string
    table_name: string
    token: string
    region: string
  }
}

class DynamoDBStore implements Store {
  private spackle: Spackle
  private session: SpackleSession | null = null
  private client: DynamoDBClient | null = null

  constructor(spackle: Spackle) {
    this.spackle = spackle
  }

  async bootstrap(): Promise<void> {
    if (!this.session) {
      this.session = await createSession(this.spackle)
    }

    if (!this.client) {
      this.client = new DynamoDBClient({
        region: this.session.adapter.region,
        credentials: fromSpackleCredentials(
          this.spackle,
          this.session,
          (s) => (this.session = s),
        ),
      })
    }
  }

  async getCustomerData(customerId: string) {
    await this.bootstrap()

    if (!this.session || !this.client) {
      throw new Error('spackle: session or client not initialized')
    }

    const item = await this.client.send(
      new GetItemCommand({
        TableName: this.session.adapter.table_name,
        Key: {
          AccountId: {
            S: this.session.adapter.identity_id,
          },
          CustomerId: {
            S: this.customerKey(customerId),
          },
        },
      }),
    )

    if (item.Item && item.Item.State && item.Item.State.S) {
      return JSON.parse(item.Item.State.S)
    }

    return await this.fetchStateFromApi(customerId)
  }

  async setCustomerData(customerId: string, data: any) {
    throw new Error('setCustomerData() is not supported on DynamoDBStore')
  }

  private customerKey(customerId: string) {
    return `${customerId}:${this.spackle.schemaVersion}`
  }

  private async fetchStateFromApi(customerId: string) {
    console.warn('spackle: state not found in DynamoDB, fetching from API...')
    const url = `${this.spackle.apiBase}/customers/${customerId}/state`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.spackle.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(
        `spackle: customer not found status: (${response.status})`,
      )
    }

    return await response.json()
  }
}

export default DynamoDBStore
