export const showSpinner = (spinnerSelector: string): void => {
  const spinner = document.getElementById(spinnerSelector) as HTMLElement
  spinner.style.display = 'block'
}

export const hideSpinner = (spinnerSelector: string): void => {
  const spinner = document.getElementById(spinnerSelector) as HTMLElement
  spinner.style.display = 'none'
}
