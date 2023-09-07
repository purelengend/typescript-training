import { DEFAULT_FOOD_ID_VALUE, EMPTY_MSG } from '../constants/food'
import {
  TOAST_ADD_MSG,
  TOAST_DELETE_MSG,
  TOAST_EDIT_MSG,
  TOAST_ERROR_MSG,
  Toast
} from '../constants/toast'
import { clearErrorMessages, validateForm } from '../helpers/form-validation'
import {
  openDeleteModal,
  openEditModalForm,
  resetForm
} from '../helpers/modal-ui'
import { showToast } from '../helpers/toast-ui'
import { type CallbackItem } from '../types/callback.type'
import { type Food } from '../types/food.type'
import editIcon from '../../assets/icons/edit-icon.svg'
import crossIcon from '../../assets/icons/cross-icon.svg'
import { productTemplate } from '../templates/product-card'
import { hideElementById } from '../helpers/dom-element-ui'

/**
 * @class FoodView
 *
 * Visual representation of the model.
 */

export class FoodView {
  public foodList: HTMLElement
  public addCard: HTMLElement
  public expand: HTMLElement
  public mutationModal: HTMLElement
  public mutationModalTitle: HTMLElement
  public closeMutationBtn: HTMLElement
  public mutationForm: HTMLFormElement
  public spin: HTMLElement
  public deleteModal: HTMLElement
  public deleteForm: HTMLFormElement
  public closeDeleteBtn: HTMLElement
  public editModal: HTMLElement
  public searchInput: HTMLInputElement
  public sort: HTMLSelectElement
  public loadingModal: HTMLElement
  public header: HTMLElement

  constructor() {
    this.foodList = this.getElement('#food-list')
    this.addCard = this.getElement('#add-card')
    this.expand = this.getElement('#expand')
    this.mutationModal = this.getElement('#mutation-modal')
    this.mutationModalTitle = this.getElement('#mutation-title')
    this.closeMutationBtn = this.getElement('#close-mutation-btn')
    // this.addForm = this.getElement('#add-form') as HTMLFormElement
    this.spin = this.getElement('#spin')
    this.deleteModal = this.getElement('#delete-modal')
    this.deleteForm = this.getElement('#delete-form') as HTMLFormElement
    this.closeDeleteBtn = this.getElement('#close-delete-btn')
    this.editModal = this.getElement('#mutation-modal')
    this.searchInput = this.getElement('#search') as HTMLInputElement
    this.sort = this.getElement('#sort') as HTMLSelectElement
    this.loadingModal = this.getElement('#loading-modal')
    this.header = this.getElement('#header')
    this.mutationForm = this.getElement('#mutation-form') as HTMLFormElement

    this._initEventListener()
  }

  _initEventListener = (): void => {
    this.addCard.addEventListener('click', () => {
      this.mutationModalTitle.textContent = 'Create a new food'
      this.mutationModal.style.display = 'inline-flex'
    })

    // this.mutationForm.addEventListener('submit', () => {
    //   this.mutationModal.style.display = 'none'
    //   clearErrorMessages()
    //   resetForm('mutation-form')
    // })

    this.closeMutationBtn.addEventListener('click', () => {
      this.mutationModal.style.display = 'none'
      clearErrorMessages()
      resetForm('mutation-form')
    })
    this.closeDeleteBtn.addEventListener('click', () => {
      this.deleteModal.style.display = 'none'
    })

    this.header.addEventListener('click', e => {
      e.preventDefault()
      window.location.reload()
    })
  }

  // Retrieve an element from the DOM
  getElement(selector: string): HTMLElement {
    const element = document.querySelector(selector)
    return element as HTMLElement
  }

  displaySpinner(): void {
    this.spin.style.display = 'block'
  }

  displayLoadingModal(): void {
    this.loadingModal.style.display = 'inline-flex'
  }

  hideLoadingModal(): void {
    this.loadingModal.style.display = 'none'
  }

  displayFoods = (foods: Food[]): void => {
    if (this.foodList.lastElementChild !== null) {
      while (this.foodList.lastElementChild.id !== 'add-card') {
        this.foodList.removeChild(this.foodList.lastElementChild)
      }
    }
    if (foods.length > 0) {
      foods.forEach(food => {
        // Create nodes
        const productCard = document.createElement('div')
        productCard.classList.add('d-flex-center', 'd-flex-col', 'product-card')
        productCard.innerHTML = productTemplate(crossIcon, editIcon, food)
        // Append nodes
        this.foodList.append(productCard)
      })
    } else {
      const emptyMessage = document.createElement('div')
      emptyMessage.classList.add('d-flex', 'empty-message')
      emptyMessage.textContent = EMPTY_MSG
      this.foodList.append(emptyMessage)
    }
    this.spin.style.display = 'none'
  }

  bindMutationFood = (
    handler: (
      input: Food,
      callbackList?: CallbackItem[],
      callbackErrorList?: CallbackItem[]
    ) => void
  ): void => {
    this.mutationForm.addEventListener('submit', function (e) {
      e.preventDefault()
      let food: Food
      let mutationPopupMessage: string
      if (this['food-id'].value === DEFAULT_FOOD_ID_VALUE) {
        food = {
          id: DEFAULT_FOOD_ID_VALUE,
          name: this.food.value,
          price: Number(this.price.value),
          imageUrl: this.image.value,
          quantity: Number(this.quantity.value),
          createdAt: new Date()
        }
        mutationPopupMessage = TOAST_ADD_MSG
      } else {
        food = {
          id: this['food-id'].value,
          name: this.food.value,
          price: Number(this.price.value),
          imageUrl: this.image.value,
          quantity: Number(this.quantity.value),
          createdAt: new Date(this['created-at'].value)
        }
        mutationPopupMessage = TOAST_EDIT_MSG
      }
      const callbackList: CallbackItem[] = [
        {
          callback: hideElementById,
          argument: ['loading-modal']
        },
        {
          callback: hideElementById,
          argument: ['mutation-modal']
        },
        {
          callback: resetForm,
          argument: ['mutation-form']
        },
        {
          callback: showToast,
          argument: [mutationPopupMessage, 2500, Toast.Success]
        }
      ]

      const callbackErrorList: CallbackItem[] = [
        {
          callback: hideElementById,
          argument: ['loading-modal']
        },
        {
          callback: hideElementById,
          argument: ['mutation-modal']
        },
        {
          callback: resetForm,
          argument: ['mutation-form']
        },
        {
          callback: showToast,
          argument: [TOAST_ERROR_MSG, 2500, Toast.Error]
        }
      ]
      if (validateForm(this)) {
        handler(food, callbackList, callbackErrorList)
      }
    })
  }

  bindEditForm = (
    handler: (
      input: string,
      callbackList?: CallbackItem[],
      callbackErrorList?: CallbackItem[]
    ) => void
  ): void => {
    this.foodList.addEventListener('click', function (e) {
      const target = e.target as HTMLElement
      if (target.className.includes('mutation')) {
        if (target.dataset.id !== undefined) {
          const callbackList: CallbackItem[] = [
            {
              callback: hideElementById,
              argument: ['loading-modal']
            },
            {
              callback: openEditModalForm,
              argument: ['mutation-modal', 'mutation-form']
            }
          ]
          const callbackErrorList: CallbackItem[] = [
            {
              callback: hideElementById,
              argument: ['loading-modal']
            },
            {
              callback: showToast,
              argument: [TOAST_ERROR_MSG, 2500, Toast.Error]
            }
          ]
          handler(target.dataset.id, callbackList, callbackErrorList)
        }
      }
    })
  }

  bindDeleteFood = (
    handler: (
      input: string,
      callbackList?: CallbackItem[],
      callbackErrorList?: CallbackItem[]
    ) => void
  ): void => {
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
          callback: hideElementById,
          argument: ['loading-modal']
        },
        {
          callback: hideElementById,
          argument: ['delete-modal']
        },
        {
          callback: showToast,
          argument: [TOAST_DELETE_MSG, 2500, Toast.Success]
        }
      ]
      const callbackErrorList: CallbackItem[] = [
        {
          callback: hideElementById,
          argument: ['loading-modal']
        },
        {
          callback: hideElementById,
          argument: ['delete-modal']
        },
        {
          callback: showToast,
          argument: [TOAST_ERROR_MSG, 2500, Toast.Error]
        }
      ]
      handler(this['hidden-delete-id'].value, callbackList, callbackErrorList)
    })
  }

  bindSearchFood = (
    handler: (
      input: string,
      callbackList?: CallbackItem[],
      callbackErrorList?: CallbackItem[]
    ) => void
  ): void => {
    this.searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        const callbackList: CallbackItem[] = [
          {
            callback: hideElementById,
            argument: ['loading-modal']
          }
        ]
        const callbackErrorList: CallbackItem[] = [
          {
            callback: hideElementById,
            argument: ['loading-modal']
          },
          {
            callback: showToast,
            argument: [TOAST_ERROR_MSG, 2500, Toast.Error]
          }
        ]
        handler(`name=${this.value}`, callbackList, callbackErrorList)
      }
    })
  }

  bindSortFood = (
    handler: (
      input: string,
      callbackList?: CallbackItem[],
      callbackErrorList?: CallbackItem[]
    ) => void
  ): void => {
    this.sort.addEventListener('change', function () {
      const callbackList: CallbackItem[] = [
        {
          callback: hideElementById,
          argument: ['loading-modal']
        }
      ]
      const callbackErrorList: CallbackItem[] = [
        {
          callback: hideElementById,
          argument: ['loading-modal']
        },
        {
          callback: showToast,
          argument: [TOAST_ERROR_MSG, 2500, Toast.Error]
        }
      ]
      handler(this.value, callbackList, callbackErrorList)
    })
  }

  bindExpandFood = (
    handler: (
      callbackList?: CallbackItem[],
      callbackErrorList?: CallbackItem[]
    ) => void
  ): void => {
    this.expand.addEventListener('click', function () {
      const callbackList: CallbackItem[] = [
        {
          callback: hideElementById,
          argument: ['loading-modal']
        }
      ]
      const callbackErrorList: CallbackItem[] = [
        {
          callback: hideElementById,
          argument: ['loading-modal']
        },
        {
          callback: showToast,
          argument: [TOAST_ERROR_MSG, 2500, Toast.Error]
        }
      ]
      handler(callbackList, callbackErrorList)
    })
  }
}
