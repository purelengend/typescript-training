import {
  FOOD_NAME_WARNING_MSG,
  FOOD_PRICE_WARNING_MSG,
  FOOD_IMG_WARNING_MSG,
  FOOD_QUANTITY_WARNING_MSG
} from '../constants/food'
import { DEFAULT_FORM_INDEX } from '../constants/form'

/**
 * @function isValidName
 *
 * Check if the input string contains two trailing spaces consecutive or trailing spaces at the begin/end of the name.
 *
 * @param input
 */
function isValidName(input: string): boolean {
  return input.length !== 0 && !/^\s| {2,}|\s$/.test(input)
}

/**
 * @function isValidNumber
 *
 * Check if the input number is greater than 0.
 *
 * @param input
 */
function isValidNumber(input: number): boolean {
  return input > 0
}

/**
 * @function isValidInteger
 *
 * Check if the input number is an integer and greater than 0.
 *
 * @param input
 */
function isValidInteger(input: number): boolean {
  return Number.isInteger(input) && input > 0
}

/**
 * @function isValidImageUrl
 *
 * Check if the input image url is a valid URL with supported format extensions: 'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
    'q=80'.
 *
 * @param input
 */
function isValidImageUrl(url: string): boolean {
  const imageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
    'q=80'
  ]

  const urlLower = url.toLowerCase()
  return imageExtensions.some(
    extension =>
      urlLower.endsWith('.' + extension) || urlLower.endsWith('&' + extension)
  )
}

/**
 * @function appendErrorElement
 *
 * Append the error DOM element with input message next to the input target DOM.
 * The input parent param of the input target DOM is necessary to check whether there is already an error DOM element.
 *
 * @param target
 * @param parent
 * @param element
 * @param message
 */
function appendErrorElement(
  target: HTMLElement,
  parent: HTMLElement,
  element: HTMLElement,
  message: string
): boolean {
  const lastChild = parent.lastElementChild as HTMLElement
  if (!lastChild.classList.contains('mutation-warning')) {
    element.textContent = message
    target.after(element)
  }
  return false
}

/**
 * @function removeErrorElement
 *
 * Remove the error DOM element of the target parent DOM.
 *
 * @param targetParent
 */

function removeErrorElement(targetParent: HTMLElement): number {
  const lastChild = targetParent.lastElementChild as HTMLElement
  if (lastChild.classList.contains('mutation-warning')) {
    targetParent.removeChild(lastChild)
  }
  return 1
}

/**
 * @function validateField
 *
 * Validate the input field value with the input validation function and append error DOM element if the value is not valid, otherwise remove the error element.
 *
 * @param fieldName
 * @param fieldValue
 * @param validationFunction
 * @param warningMessage
 */
const validateField = <T>(
  fieldName: string,
  fieldValue: T,
  validationFunction: (value: T) => boolean,
  warningMessage: string
): number => {
  const target = document.getElementById(fieldName) as HTMLElement
  const warningParagraph = document.createElement('p')
  warningParagraph.classList.add('mutation-warning')

  if (!validationFunction(fieldValue)) {
    appendErrorElement(
      target,
      target.parentNode as HTMLElement,
      warningParagraph,
      warningMessage
    )
    return 0
  } else {
    return removeErrorElement(target.parentNode as HTMLElement)
  }
}

/**
 * @function validateField
 *
 * Validate all fields of the input form. Return true if all fields are valid, otherwise return false.
 *
 * @param inputForm
 */
export const validateForm = (inputForm: HTMLFormElement): boolean => {
  const formData = new FormData(inputForm)
  let valid = DEFAULT_FORM_INDEX

  for (const item of formData) {
    switch (item[0]) {
      case 'food':
        valid += validateField(
          item[0],
          item[1] as string,
          isValidName,
          FOOD_NAME_WARNING_MSG
        )
        break
      case 'price':
        valid += validateField(
          item[0],
          Number(item[1]),
          isValidNumber,
          FOOD_PRICE_WARNING_MSG
        )
        break
      case 'image':
        valid += validateField(
          item[0],
          item[1] as string,
          isValidImageUrl,
          FOOD_IMG_WARNING_MSG
        )
        break
      case 'quantity':
        valid += validateField(
          item[0],
          Number(item[1]),
          isValidInteger,
          FOOD_QUANTITY_WARNING_MSG
        )
        break
      default:
        break
    }
  }

  const totalInputAmount = Array.from(formData.entries()).length
  return valid === totalInputAmount
}

/**
 * @function clearErrorMessages
 *
 * Clear all the error messages DOM elements
 *
 */
export const clearErrorMessages = (): void => {
  const errorMessages = document.querySelectorAll('.mutation-warning')
  errorMessages.forEach(message => {
    message.remove()
  })
}
