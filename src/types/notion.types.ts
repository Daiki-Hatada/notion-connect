import { Client } from '@notionhq/client'

export type UpdatePageBodyValue = Parameters<typeof Client.prototype.pages.update>[0]['properties']
export type UpdatePageBodyContent<K extends keyof UpdatePageBodyValue> = UpdatePageBodyValue[K]
