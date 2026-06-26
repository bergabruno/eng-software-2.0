import { requestJson } from './httpClient'

export async function simular(valorSolicitado, prazoMeses) {
  const { response, data } = await requestJson('/simulacao', {
    method: 'POST',
    body: JSON.stringify({ valorSolicitado, prazoMeses }),
  })

  if (!response.ok) {
    throw new Error(data.mensagem || 'Erro na simulação')
  }

  return data
}
