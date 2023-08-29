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
    this.foodView.displayFoods(foods.reverse())
  }

  handleAddFood = (
    food: Omit<Food, 'id'>,
    callbackList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.addFood(food, callbackList)
  }

  handleDeleteFood = (
    id: string,
    callbackList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.deleteFood(id, callbackList)
  }

  handleGetFoodById = (
    id: string,
    callbackList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.getFoodById(id, callbackList)
  }

  handleEditFood = (
    food: Food,
    callbackList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.editFood(food, callbackList)
  }

  handleGetFoodByName = (
    name: string,
    callbackList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.getFoodByName(name, callbackList)
  }

  handleSortFood = (
    filter: string,
    callbackList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.sortFood(filter, callbackList)
  }
}
