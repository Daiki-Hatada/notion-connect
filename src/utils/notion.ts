import { IgnorableError } from "../error"
import { UpdatePageBodyValue } from "../types/notion.types"

const regex = /^https:\/\/(www.)?notion.so\/.*$/

export const urlToPageId = (url: string): string => {
  const path = (() => {
    if (url.match(regex)) {
      const urlObj = new URL(url)
      return urlObj.pathname
    } else {
      return url.split('?')[0]
    }
  })()
  const pageId = path.split('/').pop()?.slice(-32)
  if (!pageId) throw new IgnorableError('Page ID not found.')
  return pageId
}

export const notionUrlRegex = /(?<=https:\/\/(www.)?notion.so\/)(.*)/

export const composeUpdatePageBodyValue = (input: {
  property: string
  propertyType: string
  value: string
}): UpdatePageBodyValue => {
  switch (input.propertyType) {
    case 'title':
      return {
        [input.property]: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: input.value,
              },
            },
          ],
        }
      } as const
    case 'rich_text':
      return {
        [input.property]: {
          type: 'rich_text',
          rich_text: [
            {
              type: 'text',
              text: {
                content: input.value,
              },
            },
          ],
        }
      } as const
    case 'status':
      return {
        [input.property]: {
          type: 'status',
          status: {
            name: input.value,
          },
        }
      } as const
    default:
      throw new Error(`Invalid property type: ${input.propertyType}`)
  }
}
