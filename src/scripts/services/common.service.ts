import { BASE_URL, RESOURCE } from '../constants/api'
import { type CallbackItem } from '../types/callback.type'
import { type Food } from '../types/food.type'
/**
 * @function request
 *
 * Make request with input method and input query path to the server.
 *
 * @param method
 * @param path - optional
 */
export async function request<TResponse>(
  method: string,
  path?: string
): Promise<TResponse | undefined> {
  const response = await fetch(`${BASE_URL}${RESOURCE.food}${path ?? ''}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) return await response.json()
  else throw new Error()
}

/**
 * @function requestWithBody
 *
 * Make a request with input method, input query path and input data of the body to the server.
 *
 * @param method
 * @param data - optional
 * @param path - optional
 */
export async function requestWithBody<TResponse>(
  method: string,
  data?: any,
  path?: string
): Promise<TResponse | undefined> {
  const response = await fetch(`${BASE_URL}${RESOURCE.food}${path ?? ''}`, {
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
