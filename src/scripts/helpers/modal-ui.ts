import { type Food } from '../types/food.type'

/**
 * @function openDeleteModal
 *
 * Open the delete modal which contains the hidden id field.
 *
 * @param modalSelector
 * @param hiddenSelector
 * @param id
 */
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

/**
 * @function resetForm
 *
 * Clear value of all fields of the input form selector.
 *
 * @param selector
 */
export const resetForm = (formSelector: string): void => {
  const form = document.getElementById(formSelector) as HTMLFormElement
  form.reset()
}

/**
 * @function openEditModalForm
 *
 * Open the edit modal and fill all fields with input data.
 *
 * @param modalSelector
 * @param formSelector
 * @param data
 */
export const openEditModalForm = (
  modalSelector: string,
  formSelector: string,
  data: Food
): void => {
  const modal = document.querySelector(modalSelector) as HTMLElement
  const form = document.querySelector(formSelector) as HTMLFormElement
  modal.style.display = 'inline-flex'
  form['food-id'].value = data.id
  form.food.value = data.name
  form.price.value = data.price
  form.image.value = data.imageUrl
  form.quantity.value = data.quantity
  form['created-at'].value = data.createdAt
}
