import {
  SEARCH_KEYWORD,
  FILTER_ATTRIBUTE,
  DEFAULT_LIMITATION,
  DEFAULT_PAGINATION
} from '../constants/filter'
import { hideElementById, showElementById } from '../helpers/dom-element-ui'
import { type CallbackItem } from '../types/callback.type'
import { type Food } from '../types/food.type'
import {
  requestQuery,
  requestBody,
  invokeCallback
} from '../services/common.service'

/**
 * @class Service
 *
 ** Manages the data of the application.
 */
export class FoodModel {
  public foods: Food[] = []
  private onFoodListChanged: (foods: Food[]) => void = () => {}
  public name: string = SEARCH_KEYWORD
  public sort: string = FILTER_ATTRIBUTE
  public limit: number = DEFAULT_LIMITATION
  public page: number = DEFAULT_PAGINATION
  public path: string = `?${this.name}&${this.sort}&page=${this.page}&limit=${this.limit}`
  constructor() {
    void this.loadFoods()
  }

  bindFoodListChanged(callback: (foods: Food[]) => void): void {
    this.onFoodListChanged = callback
  }

  private _commitAndCheckExpand(foods: Food[]): void {
    this.foods = foods
    this.onFoodListChanged(this.foods)

    if (foods.length < DEFAULT_LIMITATION) {
      hideElementById('expand')
    } else {
      showElementById('expand')
    }
  }

  private _updatePath(): void {
    this.path = `?${this.name}&${this.sort}&page=${this.page}&limit=${this.limit}`
  }

  async loadFoods(): Promise<void> {
    try {
      const foodList = await requestQuery<Food[]>('GET', this.path)
      if (foodList !== undefined) {
        this.foods = foodList
        this._commitAndCheckExpand(foodList)
      }
    } catch (error) {
      console.error('Error when loading foods:', error)
    }
  }

  async getFoodById(
    id: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    try {
      const currentFood = await requestQuery<Food>('GET', `/${id}`)
      if (currentFood !== undefined) {
        invokeCallback(callbackList, currentFood)
      }
    } catch (error) {
      invokeCallback(callbackErrorList)
    }
  }

  async getFoodByName(
    name: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    this.name = name
    this.page = DEFAULT_PAGINATION
    this._updatePath()
    try {
      const foodByNameList = await requestQuery<Food[]>('GET', `${this.path}`)
      if (foodByNameList !== undefined) {
        this._commitAndCheckExpand(foodByNameList)
        invokeCallback(callbackList)
      }
    } catch (error) {
      invokeCallback(callbackErrorList)
    }
  }

  async sortFood(
    filter: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    this.sort = filter
    this.page = DEFAULT_PAGINATION
    this._updatePath()
    try {
      const filteredFoodList = await requestQuery<Food[]>('GET', `${this.path}`)
      if (filteredFoodList !== undefined) {
        this._commitAndCheckExpand(filteredFoodList)
        invokeCallback(callbackList)
      }
    } catch (error) {
      invokeCallback(callbackErrorList)
    }
  }

  async expandFood(
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    this.page += DEFAULT_PAGINATION
    this._updatePath()
    try {
      const expandedFoodList = await requestQuery<Food[]>('GET', `${this.path}`)
      if (expandedFoodList !== undefined) {
        const updatedFoodlist = [...this.foods, ...expandedFoodList]
        this._commitAndCheckExpand(updatedFoodlist)
        if (expandedFoodList.length < DEFAULT_LIMITATION) {
          hideElementById('expand')
        }
        invokeCallback(callbackList)
      }
    } catch (error) {
      invokeCallback(callbackErrorList)
    }
  }

  async addFood(
    food: Omit<Food, 'id'>,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    try {
      const addedFood = await requestBody<Food>('POST', food)
      if (addedFood !== undefined) {
        this.page = DEFAULT_PAGINATION
        this._updatePath()
        const updatedFoodlist = await requestQuery<Food[]>(
          'GET',
          `${this.path}`
        )
        if (updatedFoodlist != null) {
          this._commitAndCheckExpand(updatedFoodlist)
        }
      }
      invokeCallback(callbackList)
    } catch (error) {
      invokeCallback(callbackErrorList)
    }
  }

  async editFood(
    food: Food,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    try {
      const updatedFood = await requestBody<Food>('PUT', food, `${food.id}`)
      if (updatedFood !== undefined) {
        const updatedFoodlist = [...this.foods]
        const updatedFoodIndex = updatedFoodlist.findIndex(
          food => food.id === updatedFood.id
        )
        updatedFoodlist[updatedFoodIndex].id = updatedFood.id
        updatedFoodlist[updatedFoodIndex].name = updatedFood.name
        updatedFoodlist[updatedFoodIndex].price = updatedFood.price
        updatedFoodlist[updatedFoodIndex].imageUrl = food.imageUrl
        updatedFoodlist[updatedFoodIndex].quantity = food.quantity
        this._commitAndCheckExpand(updatedFoodlist)
      }
      invokeCallback(callbackList)
    } catch (error) {
      invokeCallback(callbackErrorList)
    }
  }

  async deleteFood(
    id: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    try {
      const deletedFood = await requestQuery<Food>('DELETE', `${id}`)
      if (deletedFood !== undefined) {
        this.page = DEFAULT_PAGINATION
        this._updatePath()
        const updatedFoodlist = await requestQuery<Food[]>(
          'GET',
          `${this.path}`
        )
        if (updatedFoodlist != null) {
          this._commitAndCheckExpand(updatedFoodlist)
        }
      }
      invokeCallback(callbackList)
    } catch (error) {
      invokeCallback(callbackErrorList)
    }
  }
}
