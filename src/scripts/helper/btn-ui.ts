export const hideBtn = (btnSelector: string): void => {
  const expandBtn = document.getElementById(btnSelector)
  if (expandBtn !== null) expandBtn.style.display = 'none'
}

export const showBtn = (btnSelector: string): void => {
  const expandBtn = document.getElementById(btnSelector)
  if (expandBtn !== null) expandBtn.style.display = 'inline-flex'
}
