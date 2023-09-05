export interface CallbackItem {
  callback: (...args: any[]) => void
  argument?: any[]
}
