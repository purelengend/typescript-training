import {
  SEARCH_KEYWORD,
  FILTER_ATTRIBUTE,
  DEFAULT_LIMITATION,
  DEFAULT_PAGINATION
} from '../constants/filter'
import { hideExpandBtn } from '../helper/expand-ui'
import { type CallbackItem } from '../models/callback.model'
import { type Food } from '../models/food.model'
import { requestQuery, requestBody } from './common.service'

/**
 * @class Service
 *
 ** Manages the data of the application.
 */
export class FoodService {
  public foods: Food[] = []
  private onFoodListChanged: (...args: any[]) => void = () => {}
  public name: string = SEARCH_KEYWORD
  public sort: string = FILTER_ATTRIBUTE
  public limit: number = DEFAULT_LIMITATION
  public page: number = DEFAULT_PAGINATION
  public path: string = `?${this.name}&${this.sort}&page=${this.page}&limit=${this.limit}`
  constructor() {
    void this.loadFoods()
  }

  bindFoodListChanged(callback: (...args: any[]) => void): void {
    this.onFoodListChanged = callback
  }

  private _commit(foods: Food[]): void {
    this.foods = foods
    this.onFoodListChanged(this.foods)
  }

  private _updatePath(): void {
    this.path = `?${this.name}&${this.sort}&page=${this.page}&limit=${this.limit}`
  }

  async loadFoods(): Promise<void> {
    try {
      const foodList = await this.getAllFoods()
      if (foodList !== undefined) {
        this.foods = foodList
        this._commit(foodList)
      }
    } catch (error) {
      console.error('Error when loading foods:', error)
    }
  }

  async getAllFoods(): Promise<Food[] | undefined> {
    return await requestQuery<Food[]>('GET', this.path)
  }

  async getFoodById(
    id: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): Promise<void> {
    try {
      const currentFood = await requestQuery<Food>('GET', `/${id}`)
      if (currentFood !== undefined) {
        if (callbackList !== undefined) {
          callbackList.forEach(item => {
            const { callback, argument = undefined } = item
            if (argument !== undefined) callback(...argument, currentFood)
          })
        }
      }
    } catch (error) {
      if (callbackErrorList !== undefined) {
        callbackErrorList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
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
        this._commit(foodByNameList)
        console.log(foodByNameList)
        if (foodByNameList.length < DEFAULT_LIMITATION) hideExpandBtn()
        if (callbackList !== undefined) {
          callbackList.forEach(item => {
            const { callback, argument } = item
            if (argument !== undefined) callback(...argument)
          })
        }
      }
    } catch (error) {
      if (callbackErrorList !== undefined) {
        callbackErrorList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
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
        this._commit(filteredFoodList)
        if (callbackList !== undefined) {
          callbackList.forEach(item => {
            const { callback, argument } = item
            if (argument !== undefined) callback(...argument)
          })
        }
      }
    } catch (error) {
      if (callbackErrorList !== undefined) {
        callbackErrorList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
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
        if (expandedFoodList.length === DEFAULT_LIMITATION) {
          const updatedFoodlist = [...this.foods, ...expandedFoodList]
          this._commit(updatedFoodlist)
        } else {
          const updatedFoodlist = [...this.foods, ...expandedFoodList]
          this._commit(updatedFoodlist)
          hideExpandBtn()
        }
        if (callbackList !== undefined) {
          callbackList.forEach(item => {
            const { callback, argument } = item
            if (argument !== undefined) callback(...argument)
          })
        }
      }
    } catch (error) {
      if (callbackErrorList !== undefined) {
        callbackErrorList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
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
        const updatedFoodlist = await requestQuery<Food[]>(
          'GET',
          `${this.path}`
        )
        updatedFoodlist != null && this._commit(updatedFoodlist)
      }
      if (callbackList !== undefined) {
        callbackList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
    } catch (error) {
      if (callbackErrorList !== undefined) {
        callbackErrorList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
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
        this._commit(updatedFoodlist)
      }
      if (callbackList !== undefined) {
        callbackList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
    } catch (error) {
      if (callbackErrorList !== undefined) {
        callbackErrorList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
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
        const updatedFoodlist = this.foods.filter(
          food => food.id !== deletedFood.id
        )
        this._commit(updatedFoodlist)
      }
      if (callbackList !== undefined) {
        callbackList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
    } catch (error) {
      if (callbackErrorList !== undefined) {
        callbackErrorList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
    }
  }
}
