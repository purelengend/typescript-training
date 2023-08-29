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
    // this.onFoodListChanged(this.foodService.foods)
    this.foodService.bindFoodListChanged(this.onFoodListChanged)
    this.foodView.bindAddFood(this.handleAddFood)
    this.foodView.bindDeleteFood(this.handleDeleteFood)
    this.foodView.bindEditForm(this.handleGetFoodById)
    this.foodView.bindEditFood(this.handleEditFood)
    this.foodView.bindSearchFood(this.handleGetFoodByName)
    this.foodView.displaySpinner()
    this.foodView.bindSortFood(this.handleSortFood)
    this.foodView.bindExpandFood(this.handleExpandFood)
  }

  onFoodListChanged = (foods: Food[]): void => {
    this.foodView.displayFoods(foods)
  }

  handleAddFood = (
    food: Omit<Food, 'id'>,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.addFood(food, callbackList, callbackErrorList)
  }

  handleDeleteFood = (
    id: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.deleteFood(id, callbackList, callbackErrorList)
  }

  handleGetFoodById = (
    id: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.getFoodById(id, callbackList, callbackErrorList)
  }

  handleEditFood = (
    food: Food,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.editFood(food, callbackList, callbackErrorList)
  }

  handleGetFoodByName = (
    name: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.getFoodByName(name, callbackList, callbackErrorList)
  }

  handleSortFood = (
    filter: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.sortFood(filter, callbackList, callbackErrorList)
  }

  handleExpandFood = (
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.foodService.expandFood(callbackList, callbackErrorList)
  }
}
