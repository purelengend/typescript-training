import { type Food } from '../models/food.model'

export class FoodView {
  public foodList: HTMLElement
  // private form: HTMLElement;
  // private submitButton: HTMLElement;
  // private inputName: HTMLInputElement;
  // private inputAge: HTMLInputElement;
  // private title: HTMLElement;
  // private userList: HTMLElement;
  // private _temporaryAgeText: string;
  constructor() {
    this.foodList = this.getElement('#food-list')
  }

  // Retrieve an element from the DOM
  getElement(selector: string): HTMLElement {
    const element = document.querySelector(selector)
    return element as HTMLElement
  }

  displayFoods(foods: Food[]): void {
    if (foods.length !== 0) {
      // Create nodes
      foods.forEach(food => {
        const foodCard = ` <div class="d-flex-center d-flex-col product-card">
        <img
          src="./assets/icons/cross-icon.svg"
          alt="Cross Icon"
          class="secondary-icon"
        />
        <div class="d-flex-col product-wrapper">
          <img
            src="${food.imageUrl}"
            alt="Pizza Pepperonis"
            class="primary-product"
          />
          <div class="d-flex-col product-content-wrapper">
            <p class="product-name">${food.name}</p>
            <div class="d-flex-center product-detail">
              $ ${food.price}
              <div class="separate"></div>
              ${food.quantity} Bowls
            </div>
          </div>
        </div>

        <button class="d-flex-center product-mutation">
          <img
            src="./assets/icons/edit-icon.svg"
            alt="Edit Icon"
            class="primary-icon"
          />
          <p class="mutation-content">Edit dish</p>
        </button>
      </div>`

        // Append nodes
        this.foodList.innerHTML += foodCard
      })
    }
  }
}
