import { Client } from '@notionhq/client'

export class Notion {
  static #client: Client | undefined = undefined

  static initClient(token: string) {
    Notion.#client = new Client({
      auth: token,
    })
  }

  static get client() {
    if (Notion.#client === undefined) throw new Error('Notion client not initialized.')
    return Notion.#client
  }

  constructor(token: string) {
    Notion.initClient(token)
    return this
  }

  get client() {
    return Notion.client
  }
}
