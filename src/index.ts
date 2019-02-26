import * as SquareConnect from 'square-connect'

export type CatalogCategory = SquareConnect.CatalogCategory

interface IdMap{
  [nodeId: string]: string
}

const defaultClient = SquareConnect.ApiClient.instance
const categoryMappings: IdMap = {}
const itemMappings: IdMap = {}
const modifierMappings: IdMap = {}
const Categories: SquareConnect.CatalogCategory[] = []
const Items: SquareConnect.CatalogItem[] = []
const Modifiers: SquareConnect.CatalogModifierList[] = []
const Discounts: SquareConnect.CatalogDiscount[] = []
const categoryItems: {[categoryId: string]: string[]} = {}
const modifierItems: {[modifierId: string]: string[]} = {}

export interface GatsbySourceSquareConfig{
  token: string
  plugins?: any
}

interface SourceNodesGatsby{
  actions: {
    createNode: (node: any) => void
  }
  createNodeId: (identifier: string) => string
  createContentDigest: (object: any) => string
}

export const sourceNodes = async (gatsby: SourceNodesGatsby, config: GatsbySourceSquareConfig) => {
  const {actions, createNodeId, createContentDigest} = gatsby

  const {createNode} = actions

  const createCategoryNode = (category: SquareConnect.CatalogCategory) => {
    category.items___NODE = categoryItems[category.id]

    const nodeData = Object.assign({}, category, {
      id: categoryMappings[category.id],
      categoryId: category.id,
      parent: null,
      children: [],
      internal: {
        type: `SquareCategory`,
        content: JSON.stringify(category),
        contentDigest: createContentDigest(category)
      }
    })

    createNode(nodeData)
  }

  const createItemNode = (item: SquareConnect.CatalogItem) => {
     item.category___NODE = categoryMappings[item.item_data.category_id]
     item.modifiers___NODE = (item.item_data.modifier_list_info ? item.item_data.modifier_list_info : []).map((entry) => {
       return modifierMappings[entry.modifier_list_id]
     })

     const nodeData = Object.assign({}, item, {
      id: itemMappings[item.id],
      itemId: item.id,
      parent: null,
      children: [],
      internal: {
        type: `SquareItem`,
        content: JSON.stringify(item),
        contentDigest: createContentDigest(item)
      }
    })

    createNode(nodeData)
  }

  const createModifierNode = (modifier: SquareConnect.CatalogModifierList) => {
    modifier.items___NODE = modifierItems[modifier.id]

    const nodeData = Object.assign({}, modifier, {
      id: modifierMappings[modifier.id],
      modifierId: modifier.id,
      parent: null,
      children: [],
      internal: {
        type: `SquareModifierList`,
        content: JSON.stringify(modifier),
        contentDigest: createContentDigest(modifier)
      }
    })

    createNode(nodeData)
  }

  const createDiscountNode = (discount: SquareConnect.CatalogDiscount) => {
    const nodeData = Object.assign({}, discount, {
      id: createNodeId(`square-discount-${discount.id}`),
      discountId: discount.id,
      parent: null,
      children: [],
      internal: {
        type: `SquareDiscount`,
        content: JSON.stringify(discount),
        contentDigest: createContentDigest(discount)
      }
    })

    createNode(nodeData)
  }

  delete config.plugins

  let oauth2 = defaultClient.authentications['oauth2']
  oauth2.accessToken = config.token

  const apiInstance = new SquareConnect.CatalogApi()

  let entries = await apiInstance.listCatalog({})

  entries.objects.forEach((object) => {
    switch(object.type){
      case 'CATEGORY':
        Categories.push(object)
        categoryMappings[object.id] = createNodeId(`square-category-${object.id}`)
      break
      case 'ITEM':
        Items.push(object)

        itemMappings[object.id] = createNodeId(`square-item-${object.id}`)

        if(!categoryItems[object.item_data.category_id]){
          categoryItems[object.item_data.category_id] = []
        }

        categoryItems[object.item_data.category_id].push(itemMappings[object.id])

        if(object.item_data.modifier_list_info){
          object.item_data.modifier_list_info.forEach((entry) => {
            if(!modifierItems[entry.modifier_list_id]){
              modifierItems[entry.modifier_list_id] = []
            }

            modifierItems[entry.modifier_list_id].push(object.id)
          })
        }
      break
      case 'MODIFIER_LIST':
        Modifiers.push(object)

        modifierMappings[object.id] = createNodeId(`square-modifier-list-${object.id}`)
      break
      case 'DISCOUNT':
        Discounts.push(object)

        createDiscountNode(object)
      break
    }
  })

  Categories.forEach(createCategoryNode)
  Items.forEach(createItemNode)
  Modifiers.forEach(createModifierNode)
}