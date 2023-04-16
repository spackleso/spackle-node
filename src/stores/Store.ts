import { CustomerData } from '../resources/Customer'

interface Store {
  bootstrap(): Promise<void>
  getCustomerData(customerId: string): Promise<any>
  setCustomerData(customerId: string, data: CustomerData): Promise<void>
}

export default Store
