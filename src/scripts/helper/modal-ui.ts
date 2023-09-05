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
  form.editid.value = data.id
  form.editname.value = data.name
  form.editprice.value = data.price
  form.editimage.value = data.imageUrl
  form.editquantity.value = data.quantity
}
