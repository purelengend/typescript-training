import { type Food } from '../models/food.model'
import { type FoodService } from '../services.ts/food.services'
import { type FoodView } from '../views/food.view'

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
export class FoodController {
  constructor(
    private readonly foodService: FoodService,
    private readonly foodView: FoodView
  ) {
    this.foodService.bindFoodListChanged(this.onFoodListChanged)
    this.onFoodListChanged(this.foodService.foods)
  }

  onFoodListChanged = (foods: Food[]): void => {
    this.foodView.displayFoods(foods)
  }
}
