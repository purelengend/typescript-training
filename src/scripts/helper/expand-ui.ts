export const hideExpandBtn = (): void => {
  const expandBtn = document.getElementById('expand')
  if (expandBtn !== null) expandBtn.style.display = 'none'
}
