import { requestJson } from './httpClient'

export async function validarDataprev(valorSolicitado, prazoMeses) {
  const { response, data } = await requestJson('/dataprev/validar', {
    method: 'POST',
    body: JSON.stringify({ valorSolicitado, prazoMeses }),
  })

  return {
    status: response.status,
    ...data,
  }
}
