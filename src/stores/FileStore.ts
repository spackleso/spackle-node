import Store from './Store'
import * as fs from 'fs/promises'

class FileStore implements Store {
  private path: string

  constructor(path: string) {
    this.path = path
  }

  public bootstrap() {
    return Promise.resolve()
  }

  public async getCustomerData(key: string): Promise<any> {
    let data
    try {
      const content = await fs.readFile(this.path, { encoding: 'utf8' })
      data = JSON.parse(content)
    } catch (error) {
      data = {}
    }

    if (data[key]) {
      return data[key]
    }

    return Promise.reject(new Error('spackle: customer not found'))
  }

  public async setCustomerData(key: string, value: any): Promise<void> {
    let data: any
    try {
      const content = await fs.readFile(this.path, { encoding: 'utf8' })
      data = JSON.parse(content)
    } catch (error) {
      console.error(error)
      data = {}
    }

    data[key] = value
    return fs.writeFile(this.path, JSON.stringify(data), { encoding: 'utf8' })
  }
}

export default FileStore
