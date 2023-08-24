import { closeModal } from '../helper/modal-ui'
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
  }

  onFoodListChanged = (foods: Food[]): void => {
    this.foodView.displayFoods(foods)
  }

  handleAddFood = (food: Omit<Food, 'id'>): void => {
    void this.foodService.addFood(food, closeModal, 'add-modal')
  }

  handleDeleteFood = (id: string): void => {
    void this.foodService.deleteFood(id, closeModal, 'delete-modal')
  }

  // void this.foodService.deleteFood(id)
}
