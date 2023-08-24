import { BASE_URL } from '../constants'
import { type Food } from '../models/food.model'
import { type InputAddFood } from '../models/form.model'

async function request<TResponse>(
  method: string,
  data?: InputAddFood
): Promise<TResponse> {
  const response = await fetch(BASE_URL, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (response.ok) {
    return await response.json()
  } else {
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
    this.onFoodListChanged(foods)
  }

  async loadFoods(): Promise<void> {
    try {
      const foodList = await this.getAllFoods()
      this.foods = foodList
      this._commit(foodList)
    } catch (error) {
      console.error('Error loading foods:', error)
    }
  }

  async getAllFoods(): Promise<Food[]> {
    return await request<Food[]>('GET')
  }

  async addFood(
    food: Food,
    callback?: (...args: any[]) => void,
    argument?: any
  ): Promise<void> {
    const addedFood = await request<Food>('POST', food)
    this._commit([addedFood])
    if (callback !== undefined) callback(argument)
  }
}
