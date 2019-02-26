import {sourceNodes} from './index'

const nodes: {[nodeId: string]: any} = {}

const actions = {
  createNode: (node: any) => {
    nodes[node.id] = node
  }
}

const createNodeId = (id: string) => id
const createContentDigest = (content: any) => JSON.stringify(content)

describe('Source Nodes', () => {
  it('should source nodes', async () => {
    expect(Object.keys(nodes).length).toBe(0)
    await sourceNodes({actions, createNodeId, createContentDigest}, {token: process.env['GSSC_TOKEN']})
    expect(Object.keys(nodes).length).not.toBe(0)
  })
})