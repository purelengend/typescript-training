export const debounce = (fn: () => void, ms = 1500): (() => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: []): void {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, ms)
  }
}

// export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
//   fn: F,
//   delay: number = 1500
// ): (() => void) => {
//   let timeout: ReturnType<typeof setTimeout>
//   return function (this: any, ...args: Parameters<F>) {
//     clearTimeout(timeout)
//     timeout = setTimeout(() => {
//       fn.apply(this, args)
//     }, delay)
//   }
// }
