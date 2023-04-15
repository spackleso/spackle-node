interface Store {
  bootstrap(): Promise<void>
  getCustomerData(customerId: string): Promise<any>
  setCustomerData(customerId: string, data: any): Promise<void>
}

export default Store
