/**
 * @function hideElementById
 *
 * Hide the element with input id selector.
 *
 * @param selector
 */
export const hideElementById = (selector: string): void => {
  const element = document.getElementById(selector)
  if (element !== null) element.style.display = 'none'
}

/**
 * @function showElementById
 *
 * Show the element with input id selector.
 *
 * @param selector
 */
export const showElementById = (selector: string): void => {
  const element = document.getElementById(selector)
  if (element !== null) element.style.display = 'inline-flex'
}
