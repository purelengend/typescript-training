/**
 * @function showSpinner
 *
 * Show the spinner with the input id selector.
 *
 * @param spinnerSelector
 */
export const showSpinner = (spinnerSelector: string): void => {
  const spinner = document.getElementById(spinnerSelector) as HTMLElement
  spinner.style.display = 'block'
}

/**
 * @function hideSpinner
 *
 * Hide the spinner with the input id selector.
 *
 * @param selector
 */
export const hideSpinner = (spinnerSelector: string): void => {
  const spinner = document.getElementById(spinnerSelector) as HTMLElement
  spinner.style.display = 'none'
}
