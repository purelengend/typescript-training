import { type Food } from '../types/food.type'

export const closeModal = (selector: string): void => {
  const modal = document.getElementById(selector) as HTMLElement
  modal.style.display = 'none'
}

export const openDeleteModal = (
  modalSelector: string,
  hiddenSelector: string,
  id: string
): void => {
  const modal = document.getElementById(modalSelector) as HTMLElement
  const hiddenField = document.getElementById(
    hiddenSelector
  ) as HTMLInputElement
  modal.style.display = 'inline-flex'
  hiddenField.value = id
}

export const resetForm = (selector: string): void => {
  const form = document.getElementById(selector) as HTMLFormElement
  form.reset()
}

export const openEditModalForm = (
  modalSelector: string,
  formSelector: string,
  data: Food
): void => {
  const modal = document.getElementById(modalSelector) as HTMLElement
  const form = document.getElementById(formSelector) as HTMLFormElement
  modal.style.display = 'inline-flex'
  form['edit-id'].value = data.id
  form['edit-name'].value = data.name
  form['edit-price'].value = data.price
  form['edit-image'].value = data.imageUrl
  form['edit-quantity'].value = data.quantity
}
