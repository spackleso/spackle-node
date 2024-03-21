import Spackle from '../Spackle'
import Store from './Store'
import fetch from 'node-fetch'

class ApiStore implements Store {
  private spackle: Spackle

  constructor(spackle: Spackle) {
    this.spackle = spackle
  }

  public async getCustomerData(customerId: string): Promise<any> {
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

  async setCustomerData(customerId: string, data: any) {
    throw new Error('setCustomerData() is not supported on ApiStore')
  }
}

export default ApiStore
