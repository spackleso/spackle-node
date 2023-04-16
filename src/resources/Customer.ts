import Spackle from '../Spackle'
import stripe from 'stripe'

export type Feature = {
  id: number
  name: string
  key: string
  type: 0 | 1
  value_flag: boolean | null
  value_limit: number | null
}

export type CustomerData = {
  version: number
  features: Feature[]
  subscriptions: stripe.Subscription[]
}

export class Customer {
  public data: CustomerData
  public customerId: string

  constructor(customerId: string, data: CustomerData) {
    this.customerId = customerId
    this.data = data
  }

  enabled(key: string) {
    for (const feature of this.data.features) {
      if (feature.key === key) {
        return feature.value_flag
      }
    }
  }

  limit(key: string) {
    for (const feature of this.data.features) {
      if (feature.key === key) {
        if (feature.value_limit === null) {
          return Infinity
        }
        return feature.value_limit
      }
    }
  }

  subscriptions() {
    return this.data.subscriptions
  }
}

export class CustomersResource {
  private spackle: Spackle

  constructor(spackle: Spackle) {
    this.spackle = spackle
  }

  async retrieve(customerId: string) {
    const data: CustomerData = await this.spackle
      .getStore()
      .getCustomerData(customerId)
    if (data) {
      return new Customer(customerId, data)
    }
    throw new Error('spackle: customer not found')
  }
}
