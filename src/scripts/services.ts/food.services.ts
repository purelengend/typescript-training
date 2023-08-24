import { BASE_URL } from '../constants'
import { type CallbackItem } from '../models/callback.model'
import { type Food } from '../models/food.model'

async function requestQuery<TResponse>(
  method: string,
  path?: string
): Promise<TResponse | undefined> {
  try {
    const response = await fetch(`${BASE_URL}${path ?? ''}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) return await response.json()
  } catch (error) {
    throw new Error('Error while sending request')
  }
}

async function requestParam<TResponse>(
  method: string,
  data?: any
): Promise<TResponse | undefined> {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (response.ok) return await response.json()
  } catch (error) {
    throw new Error('Error while sending request')
  }
}
/**
 * @class Service
 *
 * Manages the data of the application.
 */
export class FoodService {
  public foods: Food[] = []
  private onFoodListChanged: (...args: any[]) => void = () => {}

  constructor() {
    void this.loadFoods()
  }

  bindFoodListChanged(callback: (...args: any[]) => void): void {
    this.onFoodListChanged = callback
  }

  _commit(foods: Food[]): void {
    this.foods = foods
    this.onFoodListChanged(this.foods)
  }

  async loadFoods(): Promise<void> {
    try {
      const foodList = await this.getAllFoods()
      if (foodList !== undefined) {
        this.foods = foodList
        this._commit(foodList)
      }
    } catch (error) {
      console.error('Error loading foods:', error)
    }
  }

  async getAllFoods(): Promise<Food[] | undefined> {
    return await requestQuery<Food[]>('GET')
  }

  async addFood(
    food: Omit<Food, 'id'>,
    callbackList: CallbackItem[]
  ): Promise<void> {
    const addedFood = await requestParam<Food>('POST', food)
    if (addedFood !== undefined) {
      const updatedFoodlist = [...this.foods, addedFood]
      this._commit(updatedFoodlist)
    }
    if (callbackList.length > 0) {
      callbackList.forEach(item => {
        const { callback, argument } = item
        if (argument !== undefined) callback(...argument)
      })
    }
  }

  async deleteFood(id: string, callbackList: CallbackItem[]): Promise<void> {
    const deletedFood = await requestQuery<Food>('DELETE', `/${id}`)
    if (deletedFood !== undefined) {
      const updatedFoodlist = this.foods.filter(
        food => food.id !== deletedFood.id
      )
      this._commit(updatedFoodlist)
    }
    if (callbackList.length > 0) {
      callbackList.forEach(item => {
        const { callback, argument } = item
        if (argument !== undefined) callback(...argument)
      })
    }
  }
}
