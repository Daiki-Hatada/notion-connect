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
  if (!pageId) throw new Error('Page ID not found.')
  return pageId
}

export const notionUrlRegex = /(?<=https:\/\/(www.)?notion.so\/)(.*)/
