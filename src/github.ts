import { getInput } from '@actions/core'

export const input = {
  get token() {
    return getInput('token', { required: true })
  },
  get notionToken() {
    return getInput('notion-token', { required: true })
  },
  get property() {
    return getInput('property', { required: true })
  },
  get propertyType() {
    return getInput('property-type', { required: true })
  },
  get value() {
    return getInput('value', { required: true })
  },
}
