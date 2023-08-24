export const closeModal = (selector: string): void => {
  const modal = document.getElementById(selector) as HTMLElement
  modal.style.visibility = 'hidden'
}

export const openDeleteModal = (
  modalSelect: string,
  hiddenSelector: string,
  id: string
): void => {
  const modal = document.getElementById(modalSelect) as HTMLElement
  const hiddenField = document.getElementById(
    hiddenSelector
  ) as HTMLInputElement
  modal.style.visibility = 'visible'
  hiddenField.value = id
}
