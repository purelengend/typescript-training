import {
  FOOD_IMG_WARNING_MSG,
  FOOD_NAME_WARNING_MSG,
  FOOD_PRICE_WARNING_MSG,
  FOOD_QUANTITY_WARNING_MSG
} from '../constants'

// import { type Food } from '../models/food.model'
function isValidName(input: string): boolean {
  return input.length !== 0 && !/^\s| {2,}|\s$/.test(input)
}

function isValidNumber(input: number): boolean {
  return input > 0
}

function isValidImageUrl(url: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']

  const urlLower = url.toLowerCase()
  return imageExtensions.some(extension => urlLower.endsWith('.' + extension))
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

export const validateAddFood = (inputForm: HTMLFormElement): boolean => {
  const formData = new FormData(inputForm)
  let valid = 0
  for (const item of formData) {
    const target = document.getElementById(item[0]) as HTMLElement
    const warningParagraph = document.createElement('p')
    warningParagraph.classList.add('mutation-warning')
    switch (item[0]) {
      case 'food':
        if (!isValidName(item[1] as string)) {
          appendErrorElement(
            target,
            target.parentNode as HTMLElement,
            warningParagraph,
            FOOD_NAME_WARNING_MSG
          )
        } else {
          valid += removeErrorElement(target.parentNode as HTMLElement)
        }
        break
      case 'price':
        if (!isValidNumber(Number(item[1]))) {
          appendErrorElement(
            target,
            target.parentNode as HTMLElement,
            warningParagraph,
            FOOD_PRICE_WARNING_MSG
          )
        } else {
          valid += removeErrorElement(target.parentNode as HTMLElement)
        }
        break
      case 'image':
        if (!isValidImageUrl(item[1] as string)) {
          appendErrorElement(
            target,
            target.parentNode as HTMLElement,
            warningParagraph,
            FOOD_IMG_WARNING_MSG
          )
        } else {
          valid += removeErrorElement(target.parentNode as HTMLElement)
        }
        break
      case 'quantity':
        if (!isValidNumber(Number(item[1]))) {
          appendErrorElement(
            target,
            target.parentNode as HTMLElement,
            warningParagraph,
            FOOD_QUANTITY_WARNING_MSG
          )
        } else {
          valid += removeErrorElement(target.parentNode as HTMLElement)
        }
        break
      default:
        break
    }
  }

  const totalInputAmount = Array.from(formData.entries()).length
  return valid === totalInputAmount
}

export const validateEditFood = (inputForm: HTMLFormElement): boolean => {
  const formData = new FormData(inputForm)
  let valid = 1
  for (const item of formData) {
    const target = document.getElementById(item[0]) as HTMLElement
    const warningParagraph = document.createElement('p')
    warningParagraph.classList.add('mutation-warning')
    switch (item[0]) {
      case 'editname':
        if (!isValidName(item[1] as string)) {
          appendErrorElement(
            target,
            target.parentNode as HTMLElement,
            warningParagraph,
            FOOD_NAME_WARNING_MSG
          )
        } else {
          valid += removeErrorElement(target.parentNode as HTMLElement)
        }
        break
      case 'editprice':
        if (!isValidNumber(Number(item[1]))) {
          appendErrorElement(
            target,
            target.parentNode as HTMLElement,
            warningParagraph,
            FOOD_PRICE_WARNING_MSG
          )
        } else {
          valid += removeErrorElement(target.parentNode as HTMLElement)
        }
        break
      case 'editimage':
        if (!isValidImageUrl(item[1] as string)) {
          appendErrorElement(
            target,
            target.parentNode as HTMLElement,
            warningParagraph,
            FOOD_IMG_WARNING_MSG
          )
        } else {
          valid += removeErrorElement(target.parentNode as HTMLElement)
        }
        break
      case 'editquantity':
        if (!isValidNumber(Number(item[1]))) {
          appendErrorElement(
            target,
            target.parentNode as HTMLElement,
            warningParagraph,
            FOOD_QUANTITY_WARNING_MSG
          )
        } else {
          valid += removeErrorElement(target.parentNode as HTMLElement)
        }
        break
      default:
        break
    }
  }

  const totalInputAmount = Array.from(formData.entries()).length
  return valid === totalInputAmount
}
