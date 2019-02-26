declare module 'square-connect'{
  export const ApiClient: ApiClient

  export class CatalogApi{
    listCatalog: (options: {}) => Promise<CatalogReturn>
  }

  interface ApiClient{
    instance: {
      authentications: {[type: string]: {
        accessToken: string
      }}
    }
  }

  interface CatalogReturn{
    objects: CatalogObject[]
  }

  type CatalogObject = 
    CatalogItem |
    CatalogCategory |
    CatalogModifierList |
    CatalogDiscount

  interface CatalogEntry{
    id: string
    type: 'CATEGORY' | 'ITEM' | 'MODIFIER_LIST' | 'MODIFIER' | 'DISCOUNT' | 'ITEM_VARIATION'
    updated_at: string
    version: number
    is_deleted: boolean
    present_at_all_locations: boolean
  }

  interface CatalogCategory extends CatalogEntry{
    type: 'CATEGORY'
    items___NODE?: string[]
  }

  interface CatalogItem extends CatalogEntry{
    type: 'ITEM'
    category___NODE?: string
    modifiers___NODE?: string[]
    item_data: {
      name: string
      description: string
      label_color: string
      available_online: boolean
      available_for_pickup: boolean
      available_electronically: boolean
      category_id: string
      modifier_list_info?: {
        modifier_list_id: string
        min_selected_modifiers: number
        max_selected_modifiers: number
        enabled: boolean
      }[]
      variations: CatalogVariation[]
    }
  }

  interface CatalogModifierList extends CatalogEntry{
    type: 'MODIFIER_LIST'
    items___NODE: string[]
    modifier_list_data: {
      name: string,
      selection_type: 'MULTIPLE' | 'SINGLE'
      modifiers: CatalogModifier[]
    }
  }

  interface CatalogModifier extends CatalogEntry{
    type: 'MODIFIER'
    modifier_data: {
      name: string
      price_money: CatalogPrice
      on_by_default: boolean
      ordinal: number
    }
  }

  interface CatalogPrice{
    amount: number
    currency: string
  }

  interface CatalogVariation extends CatalogEntry{
    type: 'ITEM_VARIATION'
    item_variation_data: {
      item_id: string
      name: string
      sku: string
      ordinal: 1
      pricing_type: 'VARIABLE_PRICING'
    }
  }

  interface CatalogDiscount extends CatalogEntry{
    type: 'DISCOUNT'
    discount_data: {
      name: string
      discount_type: 'FIXED_PERCENTAGE'
      percentage: string
      pin_required: boolean
    }
  }
}