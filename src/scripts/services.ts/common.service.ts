import { BASE_URL, RESOURCE } from '../constants/api'
import { type CallbackItem } from '../models/callback.model'
import { type Food } from '../models/food.model'

export async function requestQuery<TResponse>(
  method: string,
  path?: string
): Promise<TResponse | undefined> {
  const response = await fetch(`${BASE_URL}${RESOURCE}${path ?? ''}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) return await response.json()
  else throw new Error()
}

export async function requestBody<TResponse>(
  method: string,
  data?: any,
  path?: string
): Promise<TResponse | undefined> {
  const response = await fetch(`${BASE_URL}${RESOURCE}${path ?? ''}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (response.ok) return await response.json()
  else throw new Error()
}

export function invokeCallback(
  callbackList: CallbackItem[] | undefined,
  optionalArgument?: Food
): void {
  if (callbackList !== undefined) {
    callbackList.forEach(item => {
      const { callback, argument } = item
      if (argument !== undefined) callback(...argument, optionalArgument)
    })
  }
}
