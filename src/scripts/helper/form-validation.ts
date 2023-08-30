import {
  FOOD_NAME_WARNING_MSG,
  FOOD_PRICE_WARNING_MSG,
  FOOD_IMG_WARNING_MSG,
  FOOD_QUANTITY_WARNING_MSG
} from '../constants/food'

// import { type Food } from '../models/food.model'
function isValidName(input: string): boolean {
  return input.length !== 0 && !/^\s| {2,}|\s$/.test(input)
}

function isValidNumber(input: number): boolean {
  return input > 0
}

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

function removeErrorElement(targetParent: HTMLElement): number {
  const lastChild = targetParent.lastElementChild as HTMLElement
  if (lastChild.classList.contains('mutation-warning')) {
    targetParent.removeChild(lastChild)
  }
  return 1
}

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

export const validateForm = (
  inputForm: HTMLFormElement,
  initFieldIndex: number
): boolean => {
  const formData = new FormData(inputForm)
  let valid = initFieldIndex

  for (const item of formData) {
    switch (item[0]) {
      case 'food':
      case 'editname':
        valid += validateField(
          item[0],
          item[1] as string,
          isValidName,
          FOOD_NAME_WARNING_MSG
        )
        break
      case 'price':
      case 'editprice':
        valid += validateField(
          item[0],
          Number(item[1]),
          isValidNumber,
          FOOD_PRICE_WARNING_MSG
        )
        break
      case 'image':
      case 'editimage':
        valid += validateField(
          item[0],
          item[1] as string,
          isValidImageUrl,
          FOOD_IMG_WARNING_MSG
        )
        break
      case 'quantity':
      case 'editquantity':
        valid += validateField(
          item[0],
          Number(item[1]),
          isValidNumber,
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
