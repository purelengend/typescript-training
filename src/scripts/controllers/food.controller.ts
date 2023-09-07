import { type CallbackItem } from '../types/callback.type'
import { type Food } from '../types/food.type'
import { type FoodModel } from '../models/food.model'
import { type FoodView } from '../views/food.view'

/**
 * @class Controller
 *
 * Links the food input and the view output.
 *
 * @param FoodModel
 * @param foodView
 */
export class FoodController {
  constructor(
    public readonly FoodModel: FoodModel,
    public readonly foodView: FoodView
  ) {
    // this.onFoodListChanged(this.FoodModel.foods)
    this.FoodModel.bindFoodListChanged(this.onFoodListChanged)
    this.foodView.bindMutationFood(this.handleMutationFood)
    this.foodView.bindDeleteFood(this.handleDeleteFood)
    this.foodView.bindEditForm(this.handleGetFoodById)
    this.foodView.bindSearchFood(this.handleGetFoodByName)
    this.foodView.displaySpinner()
    this.foodView.bindSortFood(this.handleSortFood)
    this.foodView.bindExpandFood(this.handleExpandFood)
  }

  onFoodListChanged = (foods: Food[]): void => {
    this.foodView.displayFoods(foods)
  }

  handleMutationFood = (
    food: Food,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.FoodModel.mutationFood(food, callbackList, callbackErrorList)
  }

  handleDeleteFood = (
    id: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.FoodModel.deleteFood(id, callbackList, callbackErrorList)
  }

  handleGetFoodById = (
    id: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.FoodModel.getFoodById(id, callbackList, callbackErrorList)
  }

  handleEditFood = (
    food: Omit<Food, 'createdAt'>,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.FoodModel.editFood(food, callbackList, callbackErrorList)
  }

  handleGetFoodByName = (
    name: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.FoodModel.getFoodByName(name, callbackList, callbackErrorList)
  }

  handleSortFood = (
    filter: string,
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.FoodModel.sortFood(filter, callbackList, callbackErrorList)
  }

  handleExpandFood = (
    callbackList: CallbackItem[] | undefined,
    callbackErrorList: CallbackItem[] | undefined
  ): void => {
    this.foodView.displayLoadingModal()
    void this.FoodModel.expandFood(callbackList, callbackErrorList)
  }
}
