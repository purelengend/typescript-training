import { type CallbackItem } from '../models/callback.model'
import { type Food } from '../models/food.model'
import { type FoodService } from '../services.ts/food.services'
import { type FoodView } from '../views/food.view'

/**
 * @class Controller
 *
 * Links the food input and the view output.
 *
 * @param foodService
 * @param foodView
 */
export class FoodController {
  constructor(
    public readonly foodService: FoodService,
    public readonly foodView: FoodView
  ) {
    this.onFoodListChanged(this.foodService.foods)
    this.foodService.bindFoodListChanged(this.onFoodListChanged)
    this.foodView.bindAddFood(this.handleAddFood)
    this.foodView.bindDeleteFood(this.handleDeleteFood)
    this.foodView.bindEditForm(this.handleGetFoodById)
    this.foodView.bindEditFood(this.handleEditFood)
    this.foodView.bindSearchFood(this.handleGetFoodByName)
    this.foodView.displaySpinner()
    this.foodView.bindSortFood(this.handleSortFood)
  }

  onFoodListChanged = (foods: Food[]): void => {
    this.foodView.displayFoods(foods)
  }

  handleAddFood = (
    food: Omit<Food, 'id'>,
    callbackList: CallbackItem[] | undefined
  ): void => {
    void this.foodService.addFood(food, callbackList)
  }

  handleDeleteFood = (
    id: string,
    callbackList: CallbackItem[] | undefined
  ): void => {
    void this.foodService.deleteFood(id, callbackList)
  }

  handleGetFoodById = (
    id: string,
    callbackFunction: CallbackItem | undefined
  ): void => {
    void this.foodService.getFoodById(id, callbackFunction)
  }

  handleEditFood = (
    food: Food,
    callbackList: CallbackItem[] | undefined
  ): void => {
    void this.foodService.editFood(food, callbackList)
  }

  handleGetFoodByName = (name: string): void => {
    void this.foodService.getFoodByName(name)
  }

  handleSortFood = (filter: string): void => {
    void this.foodService.sortFood(filter)
  }
}
