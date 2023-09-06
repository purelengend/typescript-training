export const hideElementById = (selector: string): void => {
  const element = document.getElementById(selector)
  if (element !== null) element.style.display = 'none'
}

export const showElementById = (selector: string): void => {
  const element = document.getElementById(selector)
  if (element !== null) element.style.display = 'inline-flex'
}
