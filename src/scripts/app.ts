import { FoodController } from './controllers/food.controller'
import { FoodService } from './services.ts/food.services'
import { FoodView } from './views/food.view'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-new
new FoodController(new FoodService(), new FoodView())
