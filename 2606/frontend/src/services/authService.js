import { requestJson } from './httpClient'

export async function login() {
  const { data } = await requestJson('/auth/login', {
    method: 'POST',
    body: '{}',
  })

  return data
}

export async function logout() {
  await requestJson('/auth/logout', {
    method: 'POST',
    body: '{}',
  })
}
