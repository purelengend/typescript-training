import { type Food } from '../models/food.model'
import { type InputAddFood } from '../models/form.model'
/**
 * @class View
 *
 * Visual representation of the model.
 */

export class FoodView {
  public foodList: HTMLElement
  public addCard: HTMLElement
  public expand: HTMLElement
  public addModal: HTMLElement
  public closeAddBtn: HTMLElement
  public addForm: HTMLFormElement
  // private submitButton: HTMLElement;
  // private inputName: HTMLInputElement;
  // private inputAge: HTMLInputElement;
  // private title: HTMLElement;
  // private userList: HTMLElement;
  // private _temporaryAgeText: string;
  constructor() {
    this.foodList = this.getElement('food-list')
    this.addCard = this.getElement('add-card')
    this.expand = this.getElement('expand')
    this.addModal = this.getElement('add-modal')
    this.closeAddBtn = this.getElement('close-add-btn')
    this.addForm = this.getElement('add-form') as HTMLFormElement

    this._initEventListenter()
  }

  _initEventListenter(): void {
    this.addCard.addEventListener('click', () => {
      this.addModal.style.visibility = 'visible'
    })

    this.closeAddBtn.addEventListener('click', () => {
      this.addModal.style.visibility = 'hidden'
    })

    this.expand.addEventListener('click', () => {
      console.log('clicked')
    })
  }

  // Retrieve an element from the DOM
  getElement(selector: string): HTMLElement {
    const element = document.getElementById(selector)
    return element as HTMLElement
  }

  displayFoods(foods: Food[]): void {
    if (foods.length !== 0) {
      foods.forEach(food => {
        // Create nodes
        const productCard = document.createElement('div')
        productCard.classList.add('d-flex-center', 'd-flex-col', 'product-card')
        productCard.innerHTML = ` <img
        src="./assets/icons/cross-icon.svg"
        alt="Cross Icon"
        class="secondary-icon"
      />
      <div class="d-flex-col product-wrapper">
        <img
          src="${food.imageUrl}"
          alt="${food.name}"
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
      </button>`
        // Append nodes
        this.foodList.append(productCard)
      })
    }
  }

  closeAddForm(): void {
    this.closeAddBtn.click()
  }

  bindAddFood(handler: (input: InputAddFood) => void): void {
    this.addForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const food: InputAddFood = {
        name: this.food.value,
        price: this.price.value,
        imageUrl: this.image.value,
        quantity: this.quantity.value
      }
      handler(food)
    })
  }
}
