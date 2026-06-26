import { requestJson } from './httpClient'

export async function getSaldo() {
  const { data } = await requestJson('/conta/saldo')
  return data
}
