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
  request,
  requestWithBody,
  invokeCallback
} from '../services/common.service'
import { DEFAULT_FOOD_ID_VALUE } from '../constants/food'

/**
 * @class FoodModel
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
      const foodList = await request<Food[]>('GET', this.path)
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
      const currentFood = await request<Food>('GET', `/${id}`)
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
      const foodByNameList = await request<Food[]>('GET', `${this.path}`)
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
      const filteredFoodList = await request<Food[]>('GET', `${this.path}`)
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
      const expandedFoodList = await request<Food[]>('GET', `${this.path}`)
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

  async mutationFood(
    food: Food,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    if (food.id === DEFAULT_FOOD_ID_VALUE) {
      const addFoodDTO: Omit<Food, 'id'> = {
        name: food.name,
        price: food.price,
        imageUrl: food.imageUrl,
        quantity: food.quantity,
        createdAt: food.createdAt
      }
      await this.addFood(addFoodDTO, callbackList, callbackErrorList)
    } else {
      await this.editFood(food, callbackList, callbackErrorList)
    }
  }

  async addFood(
    food: Omit<Food, 'id'>,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    try {
      const addedFood = await requestWithBody<Food>('POST', food)
      if (addedFood !== undefined) {
        this.page = DEFAULT_PAGINATION
        this._updatePath()
        const updatedFoodlist = await request<Food[]>('GET', `${this.path}`)
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
    food: Omit<Food, 'createdAt'>,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    try {
      const updatedFood = await requestWithBody<Omit<Food, 'createdAt'>>(
        'PUT',
        food,
        `${food.id}`
      )
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
      const deletedFood = await request<Food>('DELETE', `${id}`)
      if (deletedFood !== undefined) {
        this.page = DEFAULT_PAGINATION
        this._updatePath()
        const updatedFoodlist = await request<Food[]>('GET', `${this.path}`)
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
