import { input } from './github'
import { Notion } from './libs/notion'
import { notionUrlRegex, urlToPageId } from './utils/notion'
import * as github from '@actions/github'

async function main() {
  if (!github.context.payload.pull_request?.number) {
    throw new Error('This action is only available on pull_request event.')
  }
  const notion = new Notion(input.notionToken)
  const octokit = github.getOctokit(input.token)
  const pullRequestBody = github.context.payload.pull_request.body
  const comments = await octokit.rest.pulls
    .listReviewComments({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
    })
    .then(({ data }) => data.map(({ body }) => body))
  const urlCandidates = [pullRequestBody, ...comments].flatMap((body) => {
    console.log({ body })
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
