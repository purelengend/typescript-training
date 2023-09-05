import { FoodController } from './controllers/food.controller'
import { FoodModel } from './models/food.model'
import { FoodView } from './views/food.view'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-new
new FoodController(new FoodModel(), new FoodView())
