import { BASE_URL, RESOURCE } from '../constants'
import { type CallbackItem } from '../models/callback.model'
import { type Food } from '../models/food.model'

async function requestQuery<TResponse>(
  method: string,
  path?: string
): Promise<TResponse | undefined> {
  try {
    const response = await fetch(`${BASE_URL}${RESOURCE}${path ?? ''}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error when sending request:', error)
  }
}

async function requestBody<TResponse>(
  method: string,
  data?: any,
  path?: string
): Promise<TResponse | undefined> {
  try {
    const response = await fetch(`${BASE_URL}${RESOURCE}${path ?? ''}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error when sending request:', error)
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
  public name: string = 'name='
  public sort: string = 'orderby='
  public path: string = `?${this.name}&${this.sort}`
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
    this.path = `?${this.name}&${this.sort}`
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
    return await requestQuery<Food[]>('GET', this.path)
  }

  async getFoodById(
    id: string,
    callbackList: CallbackItem[] | undefined
  ): Promise<void> {
    const currentFood = await requestQuery<Food>('GET', `/${id}`)
    if (currentFood !== undefined) {
      if (callbackList !== undefined) {
        callbackList.forEach(item => {
          const { callback, argument = undefined } = item
          if (argument !== undefined) callback(...argument, currentFood)
        })
      }
    }
  }

  async getFoodByName(
    name: string,
    callbackList: CallbackItem[] | undefined
  ): Promise<void> {
    this.name = name
    this._updatePath()
    const foodByNameList = await requestQuery<Food[]>('GET', `${this.path}`)
    if (foodByNameList !== undefined) {
      this._commit(foodByNameList)
      if (callbackList !== undefined) {
        callbackList.forEach(item => {
          const { callback, argument } = item
          if (argument !== undefined) callback(...argument)
        })
      }
    }
  }

  async sortFood(
    filter: string,
    callbackList: CallbackItem[] | undefined
  ): Promise<void> {
    this.sort = filter
    this._updatePath()
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
  }

  async addFood(
    food: Omit<Food, 'id'>,
    callbackList: CallbackItem[] | undefined
  ): Promise<void> {
    const addedFood = await requestBody<Food>('POST', food)
    if (addedFood !== undefined) {
      const updatedFoodlist = await requestQuery<Food[]>('GET', `${this.path}`)
      updatedFoodlist != null && this._commit(updatedFoodlist)
    }
    if (callbackList !== undefined) {
      callbackList.forEach(item => {
        const { callback, argument } = item
        if (argument !== undefined) callback(...argument)
      })
    }
  }

  async editFood(
    food: Food,
    callbackList: CallbackItem[] | undefined
  ): Promise<void> {
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
      this._commit(updatedFoodlist.reverse())
    }
    if (callbackList !== undefined) {
      callbackList.forEach(item => {
        const { callback, argument } = item
        if (argument !== undefined) callback(...argument)
      })
    }
  }

  async deleteFood(
    id: string,
    callbackList: CallbackItem[] | undefined
  ): Promise<void> {
    const deletedFood = await requestQuery<Food>('DELETE', `${id}`)
    if (deletedFood !== undefined) {
      const updatedFoodlist = this.foods.filter(
        food => food.id !== deletedFood.id
      )
      this._commit(updatedFoodlist.reverse())
    }
    if (callbackList !== undefined) {
      callbackList.forEach(item => {
        const { callback, argument } = item
        if (argument !== undefined) callback(...argument)
      })
    }
  }
}
