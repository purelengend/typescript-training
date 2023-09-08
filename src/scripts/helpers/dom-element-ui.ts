/**
 * @function hideElement
 *
 * Hide the element with input id selector.
 *
 * @param selector
 */
export const hideElement = (selector: string): void => {
  const element = document.querySelector(selector) as HTMLElement
  if (element !== null) element.style.display = 'none'
}

/**
 * @function showElement
 *
 * Show the element with input id selector.
 *
 * @param selector
 */
export const showElement = (selector: string): void => {
  const element = document.querySelector(selector) as HTMLElement
  if (element !== null) element.style.display = 'inline-flex'
}
