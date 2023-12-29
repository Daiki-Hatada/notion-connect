import { IgnorableError } from './error';
import { input } from './github'
import { Notion } from './libs/notion'
import {notionUrlRegex, urlToPageId, composeUpdatePageBodyValue} from './utils/notion';
import * as github from '@actions/github'

async function main() {
  if (!github.context.payload.pull_request) {
    throw new Error('This action is only available on pull_request event.')
  }
  const notion = new Notion(input.notionToken)
  const octokit = github.getOctokit(input.token)
  const pullRequestBody = github.context.payload.pull_request.body
  const comments = await octokit.rest.issues.listComments({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.pull_request.number,
    })
    .then(({ data }) => data.map(({ body }) => body))
  const urlCandidates = [pullRequestBody, ...comments].flatMap((body) => {
    const match = body?.match(notionUrlRegex)
    return match?.[0] ? match[0] : []
  })
  if (!urlCandidates || !urlCandidates[0]) throw new IgnorableError('Notion URL not found.')
  const pageId = urlToPageId(urlCandidates[0])
  const value = composeUpdatePageBodyValue(input)
  await notion.client.pages.update({
    page_id: pageId,
    properties: value,
  })
}

async function run() {
  main().catch((err) => {
    if (!(err instanceof IgnorableError)) {
      console.warn(err)
      throw err
    }
  })
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
