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
