import Spackle from '../Spackle'
import Store from './Store'
import fetch from 'node-fetch'

class EdgeStore implements Store {
  private spackle: Spackle

  constructor(spackle: Spackle) {
    this.spackle = spackle
  }

  public async getCustomerData(customerId: string): Promise<any> {
    const url = `${this.spackle.edgeBase}/customers/${customerId}/state`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.spackle.apiKey}`,
        'X-Spackle-Schema-Version': this.spackle.schemaVersion.toString(),
      },
    })

    if (!response.ok) {
      return await this.fetchStateFromApi(customerId)
    }

    return await response.json()
  }

  async setCustomerData(customerId: string, data: any) {
    throw new Error('setCustomerData() is not supported on EdgeStore')
  }

  private async fetchStateFromApi(customerId: string) {
    console.warn('spackle: state not found in DynamoDB, fetching from API...')
    const url = `${this.spackle.apiBase}/customers/${customerId}/state`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.spackle.apiKey}`,
        'X-Spackle-Schema-Version': this.spackle.schemaVersion.toString(),
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

export default EdgeStore
