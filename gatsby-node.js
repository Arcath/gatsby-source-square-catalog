exports.sourceNodes = require('./lib/index').sourceNodes

/*const SquareConnect = require('square-connect')
//const defaultClient = SquareConnect.ApiClient.instance

exports.sourceNodes = (
  {actions, createNodeId, createContentDigest},
  configOptions
) => {
  const {createNode} = actions

  delete configOptions.plugins

  let oauth2 = defaultClient.authentications['oauth2']
  oauth2.accessToken = configOptions.token

  const apiInstance = new SquareConnect.CatalogApi()

  const opts = {}

  const createCategoryNode = function(object, nodeId, itemIds){
    object.items___NODE = itemIds

    const nodeContent = JSON.stringify(object)
    const nodeData = Object.assign({}, object, {
      id: nodeId,
      categoryId: object.id,
      parent: null,
      children: [],
      internal: {
        type: `SquareCategory`,
        content: nodeContent,
        contentDigest: createContentDigest(object)
      }
    })

    return nodeData
  }

  const createItemNode = function(object, category){
    if(category){
      object.category___NODE = category
    }

    const nodeId = createNodeId(`square-item-${object.id}`)
    const nodeContent = JSON.stringify(object)
    const nodeData = Object.assign({}, object, {
      id: nodeId,
      itemId: object.id,
      parent: null,
      children: [],
      internal: {
        type: `SquareItem`,
        content: nodeContent,
        contentDigest: createContentDigest(object)
      }
    })

    return nodeData
  }

  return apiInstance.listCatalog(opts).then(function(data){
    let categories = []
    let items = []

    data.objects.forEach(function(object){
      switch(object.type){
        case 'CATEGORY':
          categories.push(object)
        break
        case 'ITEM':
          items.push(object)
        break
      }
    })

    let categoryMappings = {}
    let categoryItems = {}
    categories.forEach(function(category){
      categoryMappings[category.id] = createNodeId(`square-category-${category.id}`)
      categoryItems[category.id] = []
    })

    items.forEach(function(item){
      let itemNode = createItemNode(item, categoryMappings[item.item_data.category_id])
      
      if(categoryItems[item.item_data.category_id]){
        categoryItems[item.item_data.category_id].push(itemNode.id)
      }

      createNode(itemNode)
    })

    categories.forEach(function(category){
      let categoryNode = createCategoryNode(category, categoryMappings[category.id], categoryItems[category.id])

      createNode(categoryNode)
    })
  })
}
*/