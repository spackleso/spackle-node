import Spackle from './Spackle'
import stripe from 'stripe'

class Waiters {
  private spackle

  constructor(spackle: Spackle) {
    this.spackle = spackle
  }

  async waitForCustomer(customerId: string, timeout: number = 15) {
    const start = Date.now()
    const end = start + timeout * 1000

    while (Date.now() < end) {
      try {
        return await this.spackle.customers.retrieve(customerId)
      } catch (error) {}
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    throw new Error('spackle: timeout waiting for customer')
  }

  async waitForSubscription(
    customerId: string,
    subscriptionId: string,
    timeout: number = 15,
    filters: any = {},
  ) {
    const start = Date.now()
    const end = start + timeout * 1000

    while (Date.now() < end) {
      try {
        const customer = await this.spackle.customers.retrieve(customerId)
        for (const subscription of customer.subscriptions()) {
          if (
            subscription.id === subscriptionId &&
            this.matchesFilters(subscription, filters)
          ) {
            return subscription
          }
        }
      } catch (error) {}
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    throw new Error('spackle: timeout waiting for customer')
  }

  private matchesFilters(subscription: stripe.Subscription, filters: any) {
    for (const key in filters) {
      if (subscription[key as keyof stripe.Subscription] !== filters[key]) {
        return false
      }
    }
    return true
  }
}

export default Waiters
