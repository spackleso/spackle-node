import { CustomerData } from '../resources/Customer'
import Store from './Store'

class MemoryStore implements Store {
  private store: any = {}

  public bootstrap() {
    return Promise.resolve()
  }

  public getCustomerData(key: string): Promise<any> {
    if (this.store[key]) {
      return Promise.resolve(this.store[key])
    }
    return Promise.reject(new Error('spackle: customer not found'))
  }

  public setCustomerData(key: string, value: CustomerData): Promise<void> {
    this.store[key] = value
    return Promise.resolve()
  }
}

export default MemoryStore
