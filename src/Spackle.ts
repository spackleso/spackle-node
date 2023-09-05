import Waiters from './Waiters'
import { CustomersResource, PricingTablesResource } from './resources'
import { EdgeStore, Store } from './stores'

class Spackle {
  public apiKey: string

  public apiBase: string = 'https://api.spackle.so/v1'
  public edgeBase: string = 'https://us-west-2.edge.spackle.so'
  public store: Store | null = null
  public schemaVersion: number = 1

  public customers: CustomersResource
  public pricingTables: PricingTablesResource
  public waiters: Waiters

  constructor(apiKey: string, store: Store | null = null) {
    this.apiKey = apiKey
    this.customers = new CustomersResource(this)
    this.pricingTables = new PricingTablesResource(this)
    this.waiters = new Waiters(this)
    this.store = store
  }

  getStore(): Store {
    if (!this.store) {
      this.store = new EdgeStore(this)
    }
    return this.store
  }
}

export default Spackle
