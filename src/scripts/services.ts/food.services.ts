import { type Food } from '../models/food.model'

async function request<TResponse>(
  url: string,
  config: RequestInit = {}
): Promise<TResponse> {
  return await fetch(url, config)
    .then(async response => await response.json())
    .then(data => data as TResponse)
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
    try {
      const response = await request<Food[]>(
        'https://64dd9b60825d19d9bfb14952.mockapi.io/foods',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      return response
    } catch (error) {
      console.error('API error:', error)
      throw error
    }
  }

  async addFood(food: Food): Promise<void> {
    try {
      const response = await request<Food>(
        'https://64dd9b60825d19d9bfb14952.mockapi.io/foods',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(food)
        }
      )
      this.foods.push(response)
      this._commit(this.foods)
    } catch (error) {
      console.error('API error:', error)
      throw error
    }
  }
}
