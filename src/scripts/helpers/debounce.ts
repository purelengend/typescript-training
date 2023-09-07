/**
 * @function debounce
 *
 * Delay an input function with input milliseconds.
 *
 * @param fn
 * @param ms
 */
export const debounce = (fn: () => void, ms = 1500): (() => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: []): void {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, ms)
  }
}
