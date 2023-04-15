import Waiters from './Waiters'
import { CustomersResource } from './resources'
import { DynamoDBStore, Store } from './stores'

class Spackle {
  public apiKey: string

  public apiBase: string = 'https://api.spackle.so/v1'
  public store: Store | null = null
  public schemaVersion: number = 1

  public customers: CustomersResource
  public waiters: Waiters

  constructor(apiKey: string, store: Store | null = null) {
    this.apiKey = apiKey
    this.customers = new CustomersResource(this)
    this.waiters = new Waiters(this)
    this.store = store
  }

  bootstrap() {
    if (!this.store) {
      this.store = new DynamoDBStore(this)
      this.store.bootstrap()
    }
  }

  getStore(): Store {
    if (!this.store) {
      this.store = new DynamoDBStore(this)
    }
    return this.store
  }
}

export default Spackle
