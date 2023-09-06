/**
 * @function showToast
 *
 * Show the toast base on the input toast type with the input message and input display time.
 *
 * @param message
 * @param displayTime
 * @param type
 */
export const showToast = (
  message: string,
  displayTime: number = 2500,
  type: string
): void => {
  const toastContainer = document.getElementById(`toast-${type}`)
  const toastMessage = document.getElementById(`toast-${type}-message`)

  if (toastContainer != null && toastMessage != null) {
    toastMessage.textContent = message
    toastContainer.style.visibility = 'visible'
    toastContainer.style.opacity = '1'
    setTimeout(() => {
      toastContainer.style.opacity = '0'
      toastContainer.style.visibility = 'hidden'
    }, displayTime)
  }
}
