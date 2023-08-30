export const hideExpandBtn = (): void => {
  const expandBtn = document.getElementById('expand')
  if (expandBtn !== null) expandBtn.style.display = 'none'
}

export const showExpandBtn = (): void => {
  const expandBtn = document.getElementById('expand')
  if (expandBtn !== null) expandBtn.style.display = 'inline-flex'
}
