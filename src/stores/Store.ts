import { CustomerData } from '../resources/Customer'

interface Store {
  getCustomerData(customerId: string): Promise<any>
  setCustomerData(customerId: string, data: CustomerData): Promise<void>
}

export default Store
