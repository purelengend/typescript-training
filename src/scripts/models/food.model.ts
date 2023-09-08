import {
  SEARCH_KEYWORD,
  FILTER_ATTRIBUTE,
  DEFAULT_LIMITATION,
  DEFAULT_PAGINATION
} from '../constants/filter'
import { hideElement, showElement } from '../helpers/dom-element-ui'
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

  /**
   * Initializes the FoodModel and loads the food data.
   */
  constructor() {
    void this.loadFoods()
  }

  /**
   * Binds a callback function to listen for changes in the food list.
   *
   * @param {Function} callback - A callback function that accepts an array of foods.
   */
  bindFoodListChanged(callback: (foods: Food[]) => void): void {
    this.onFoodListChanged = callback
  }

  /**
   * Updates the internal food list and checks whether to show or hide the "expand" element.
   *
   * @private
   * @param {Food[]} foods - The array of food items to update the model with.
   */
  private _commitAndCheckExpand(foods: Food[]): void {
    this.foods = foods
    this.onFoodListChanged(this.foods)

    if (foods.length < DEFAULT_LIMITATION) {
      hideElement('#expand')
    } else {
      showElement('#expand')
    }
  }

  /**
   * Updates the internal URL path based on current search and sort criteria.
   *
   * @private
   */
  private _updatePath(): void {
    this.path = `?${this.name}&${this.sort}&page=${this.page}&limit=${this.limit}`
  }

  /**
   * Loads the list of foods from the server.
   *
   * @async
   */
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

  /**
   * Gets a food item by its ID.
   *
   * @param {string} id - The ID of the food item to retrieve.
   * @param {CallbackItem[] | undefined} callbackList - A list of callback items to invoke on success.
   * @param {CallbackItem[] | undefined} callbackErrorList - A list of callback items to invoke on error.
   */
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

  /**
   * Gets food items by name.
   *
   * @param {string} name - The name of the food items to retrieve.
   * @param {CallbackItem[] | undefined} callbackList - A list of callback items to invoke on success.
   * @param {CallbackItem[] | undefined} callbackErrorList - A list of callback items to invoke on error.
   */
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

  /**
   * Sorts food items.
   *
   * @param {string} filter - The filter/sort criteria for sorting the food items.
   * @param {CallbackItem[] | undefined} callbackList - A list of callback items to invoke on success.
   * @param {CallbackItem[] | undefined} callbackErrorList - A list of callback items to invoke on error.
   */
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

  /**
   * Expands the list of food items.
   *
   * @param {CallbackItem[] | undefined} callbackList - A list of callback items to invoke on success.
   * @param {CallbackItem[] | undefined} callbackErrorList - A list of callback items to invoke on error.
   */
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
          hideElement('#expand')
        }
        invokeCallback(callbackList)
      }
    } catch (error) {
      invokeCallback(callbackErrorList)
    }
  }

  /**
   * Handles food mutation (add or edit).
   *
   * @param {Food} food - The food item to be added or edited.
   * @param {CallbackItem[] | undefined} callbackList - A list of callback items to invoke on success.
   * @param {CallbackItem[] | undefined} callbackErrorList - A list of callback items to invoke on error.
   */
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

  /**
   * Adds a new food item.
   *
   * @param {Omit<Food, 'id'>} food - The food item to be added.
   * @param {CallbackItem[] | undefined} callbackList - A list of callback items to invoke on success.
   * @param {CallbackItem[] | undefined} callbackErrorList - A list of callback items to invoke on error.
   */
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

  /**
   * Edits an existing food item.
   *
   * @param {Omit<Food, 'createdAt'>} food - The food item to be edited.
   * @param {CallbackItem[] | undefined} callbackList - A list of callback items to invoke on success.
   * @param {CallbackItem[] | undefined} callbackErrorList - A list of callback items to invoke on error.
   */
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

  /**
   * Deletes a food item by its ID.
   *
   * @param {string} id - The ID of the food item to delete.
   * @param {CallbackItem[] | undefined} callbackList - A list of callback items to invoke on success.
   * @param {CallbackItem[] | undefined} callbackErrorList - A list of callback items to invoke on error.
   */
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
