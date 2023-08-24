export const showToast = (
  message: string,
  displayTime: number = 2500
): void => {
  const toastContainer = document.getElementById('toast-container')
  const toastMessage = document.getElementById('toast-message')

  if (toastContainer != null && toastMessage != null) {
    toastMessage.textContent = message
    toastContainer.style.opacity = '1'
    setTimeout(() => {
      toastContainer.style.opacity = '0'
    }, displayTime)
  }
}
