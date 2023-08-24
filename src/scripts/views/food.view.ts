import { TOAST_ADD_MSG, TOAST_DELETE_MSG } from '../constants'
import {
  closeModal,
  openDeleteModal,
  openEditModalForm,
  resetForm
} from '../helper/modal-ui'
import { showToast } from '../helper/toast-ui'
import { type CallbackItem } from '../models/callback.model'
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
  public editModal: HTMLElement
  public closeEditBtn: HTMLElement
  public editForm: HTMLFormElement

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
    this.editModal = this.getElement('#edit-modal')
    this.closeEditBtn = this.getElement('#close-edit-btn')
    this.editForm = this.getElement('#edit-form') as HTMLFormElement
    this._initEventListenter()
  }

  _initEventListenter(): void {
    this.addCard.addEventListener('click', () => {
      this.addModal.style.visibility = 'visible'
    })

    this.closeAddBtn.addEventListener('click', () => {
      this.addModal.style.visibility = 'hidden'
      resetForm('add-form')
    })

    this.closeDeleteBtn.addEventListener('click', () => {
      this.deleteModal.style.visibility = 'hidden'
    })

    this.closeEditBtn.addEventListener('click', () => {
      this.editModal.style.visibility = 'hidden'
      resetForm('edit-form')
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

      <button class="d-flex-center product-mutation mutation" data-id="${food.id}">
        <img
          src="./assets/icons/edit-icon.svg"
          alt="Edit Icon"
          class="primary-icon mutation"
          data-id="${food.id}"
        />
        <p class="mutation-content mutation" data-id="${food.id}">Edit dish</p>
      </button>`
      // Append nodes
      this.foodList.append(productCard)
    })
    this.spin.style.display = 'none'
  }

  bindAddFood(
    handler: (input: Omit<Food, 'id'>, callbackList?: CallbackItem[]) => void
  ): void {
    this.addForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const food: Omit<Food, 'id'> = {
        name: this.food.value,
        price: this.price.value,
        imageUrl: this.image.value,
        quantity: this.quantity.value
      }
      const callbackList: CallbackItem[] = [
        {
          callback: closeModal,
          argument: ['add-modal']
        },
        {
          callback: resetForm,
          argument: ['add-form']
        },
        {
          callback: showToast,
          argument: [TOAST_ADD_MSG, 2500]
        }
      ]
      handler(food, callbackList)
    })
  }

  bindDeleteFood(
    handler: (input: string, callbackList?: CallbackItem[]) => void
  ): void {
    this.foodList.addEventListener('click', function (e) {
      e.preventDefault()
      const target = e.target as HTMLElement
      if (target.className.includes('delete-btn')) {
        if (target.dataset.id !== undefined) {
          openDeleteModal('delete-modal', 'hidden-delete-id', target.dataset.id)
        }
      }
    })

    this.deleteForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const callbackList: CallbackItem[] = [
        {
          callback: closeModal,
          argument: ['delete-modal']
        },
        {
          callback: showToast,
          argument: [TOAST_DELETE_MSG, 2500]
        }
      ]
      handler(this['hidden-delete-id'].value, callbackList)
    })
  }

  bindEditForm(
    handler: (input: string, callbackFunction?: CallbackItem) => void
  ): void {
    this.foodList.addEventListener('click', function (e) {
      const target = e.target as HTMLElement
      if (target.className.includes('mutation')) {
        if (target.dataset.id !== undefined) {
          handler(target.dataset.id, {
            callback: openEditModalForm,
            argument: ['edit-modal', 'edit-form']
          })
        }
      }
    })
  }

  bindEditFood(
    handler: (input: Food, callbackList?: CallbackItem[]) => void
  ): void {
    this.editForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const editFood: Food = {
        id: this.editid.value,
        name: this.editname.value,
        price: this.editprice.value,
        imageUrl: this.editimage.value,
        quantity: this.editquantity.value
      }
      const callbackList: CallbackItem[] = [
        {
          callback: closeModal,
          argument: ['edit-modal']
        },
        {
          callback: showToast,
          argument: [TOAST_ADD_MSG, 2500]
        }
      ]
      handler(editFood, callbackList)
    })
  }
}
