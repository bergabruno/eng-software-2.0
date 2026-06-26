import { requestJson } from './httpClient'

export async function contratar(tokenDataprev, simulacao) {
  const { response, data } = await requestJson('/contratacao', {
    method: 'POST',
    body: JSON.stringify({ tokenDataprev, simulacao }),
  })

  return {
    status: response.status,
    ...data,
  }
}
