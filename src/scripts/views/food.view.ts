import { openDeleteModal } from '../helper/modal-ui'
import { type Food } from '../models/food.model'
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
  public spin: HTMLElement
  public deleteModal: HTMLElement
  public deleteForm: HTMLFormElement
  public closeDeleteBtn: HTMLElement

  constructor() {
    this.foodList = this.getElement('#food-list')
    this.addCard = this.getElement('#add-card')
    this.expand = this.getElement('#expand')
    this.addModal = this.getElement('#add-modal')
    this.closeAddBtn = this.getElement('#close-add-btn')
    this.addForm = this.getElement('#add-form') as HTMLFormElement
    this.spin = this.getElement('#spin')
    this.deleteModal = this.getElement('#delete-modal')
    this.deleteForm = this.getElement('#delete-form') as HTMLFormElement
    this.closeDeleteBtn = this.getElement('#close-delete-btn')
    this._initEventListenter()
  }

  _initEventListenter(): void {
    this.addCard.addEventListener('click', () => {
      this.addModal.style.visibility = 'visible'
    })

    this.closeAddBtn.addEventListener('click', () => {
      this.addModal.style.visibility = 'hidden'
    })

    this.closeDeleteBtn.addEventListener('click', () => {
      this.deleteModal.style.visibility = 'hidden'
    })

    this.expand.addEventListener('click', () => {
      console.log('clicked')
    })
  }

  // Retrieve an element from the DOM
  getElement(selector: string): HTMLElement {
    const element = document.querySelector(selector)
    return element as HTMLElement
  }

  displayFoods(foods: Food[]): void {
    if (this.foodList.lastElementChild !== null) {
      while (this.foodList.lastElementChild.id !== 'add-card') {
        this.foodList.removeChild(this.foodList.lastElementChild)
      }
    }

    foods.forEach(food => {
      // Create nodes
      const productCard = document.createElement('div')
      productCard.classList.add('d-flex-center', 'd-flex-col', 'product-card')
      productCard.innerHTML = ` <img
        src="./assets/icons/cross-icon.svg"
        alt="Cross Icon"
        class="secondary-icon delete-btn"
        data-id="${food.id}"
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
    this.spin.style.display = 'none'
  }

  bindAddFood(handler: (input: Omit<Food, 'id'>) => void): void {
    this.addForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const food: Omit<Food, 'id'> = {
        name: this.food.value,
        price: this.price.value,
        imageUrl: this.image.value,
        quantity: this.quantity.value
      }
      handler(food)
    })
  }

  bindDeleteFood(handler: (input: string) => void): void {
    this.foodList.addEventListener('click', function (e) {
      e.preventDefault()
      if ((e.target as HTMLElement).className.includes('delete-btn')) {
        openDeleteModal(
          'delete-modal',
          'hidden-delete-id',
          (e.target as HTMLElement).dataset.id as string
        )
      }
    })

    this.deleteForm.addEventListener('submit', function (e) {
      e.preventDefault()
      handler(this['hidden-delete-id'].value)
    })
  }
}
