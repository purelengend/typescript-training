export const showSuccessToast = (
  message: string,
  displayTime: number = 2500
): void => {
  const toastContainer = document.getElementById('toast-success')
  const toastMessage = document.getElementById('toast-success-message')

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

export const showErrorToast = (
  message: string,
  displayTime: number = 2500
): void => {
  const toastContainer = document.getElementById('toast-error')
  const toastMessage = document.getElementById('toast-error-message')

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
