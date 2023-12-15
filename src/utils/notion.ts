export const urlToPageId = (url: string): string => {
  const regex = /^https:\/\/www.notion.so\/.*$/
  if (!url.match(regex)) throw new Error('Invalid Notion URL.')
  const urlObj = new URL(url)
  const pageId = urlObj.pathname.split('/').pop()
  if (!pageId) throw new Error('Page ID not found.')
  return pageId
}

export const notionUrlRegex = /(?<=^https:\/\/(www.)?notion.so\/)(.*)/
