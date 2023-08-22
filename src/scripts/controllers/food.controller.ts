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
    this.foodView.bindAddFood(this.handleAddFood)
    this.foodService.bindFoodListChanged(this.onFoodListChanged)
    this.onFoodListChanged(this.foodService.foods)
  }

  onFoodListChanged = (foods: Food[]): void => {
    this.foodView.displayFoods(foods)
  }

  handleAddFood(food: Food): void {
    void this.foodService.addFood(food)
  }
}
