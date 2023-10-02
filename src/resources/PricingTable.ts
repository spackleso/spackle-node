import Spackle from '../Spackle'
import { Feature } from './Customer'
import fetch from 'node-fetch'

export type PricingTableInterval = 'month' | 'year'

export type PricingTableProductPrice = {
  id: string
  unit_amount: number
  currency: string
}

export type PricingTableProduct = {
  id: string
  name: string
  description: string
  features: Feature[]
  prices: {
    month?: PricingTableProductPrice
    year?: PricingTableProductPrice
  }
}

export type PricingTableData = {
  id: string
  name: string
  intervals: PricingTableInterval[]
  products: PricingTableProduct[]
}

export class PricingTable {
  public id: string
  public name: string
  public intervals: string[]
  public products: PricingTableProduct[]

  constructor(id: string, data: PricingTableData) {
    this.id = id
    this.name = data.name
    this.intervals = data.intervals
    this.products = data.products
  }
}

export class PricingTablesResource {
  private spackle: Spackle

  constructor(spackle: Spackle) {
    this.spackle = spackle
  }

  async retrieve(pricingTableId: string) {
    const url = `${this.spackle.apiBase}/pricing_tables/${pricingTableId}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.spackle.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(
        `spackle: pricing table not found status: (${response.status})`,
      )
    }

    const data: PricingTableData = await response.json()
    return new PricingTable(pricingTableId, data)
  }
}
