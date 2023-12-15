import { input } from './github'
import { Notion } from './libs/notion'
import { notionUrlRegex, urlToPageId } from './utils/notion'
import * as github from '@actions/github'

async function main() {
  const notion = new Notion(input.notionToken)
  const octokit = github.getOctokit(input.token)
  const pullRequest = await octokit.rest.pulls.get().then(({ data }) => data)
  const comments = await octokit.rest.pulls
    .listReviewComments({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: pullRequest.number,
    })
    .then(({ data }) => data.map(({ body }) => body))
  const urlCandidates = [pullRequest.body, ...comments].flatMap((body) => {
    const match = body?.match(notionUrlRegex)
    return match && match[0] ? match[0] : []
  })
  if (!urlCandidates || !urlCandidates[0]) throw new Error('Notion URL not found.')
  const pageId = urlToPageId(urlCandidates[0])
  await notion.client.pages.update({
    page_id: pageId,
    properties: {
      [input.property]: {
        type: 'select',
        select: {
          name: input.value,
        },
      },
    },
  })
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
