import { useState } from 'react'
import { simular } from '../api'
import { formatCurrencyInput, parseCurrencyBRL } from '../utils/currencyInput'
import { getISODateWithOffset } from '../utils/dates'

export function useSimulacaoForm(onSimular) {
  const [valorDisplay, setValorDisplay] = useState('')
  const [prazo, setPrazo] = useState('')
  const [dataParcela, setDataParcela] = useState(getISODateWithOffset(1))
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const minData = getISODateWithOffset(1)
  const maxData = getISODateWithOffset(60)

  function handleValorChange(event) {
    const raw = event.target.value.replace(/\D/g, '')
    setValorDisplay(raw ? formatCurrencyInput(raw) : '')
  }

  function validarFormulario(valorSolicitado, prazoMeses) {
    if (!valorSolicitado || valorSolicitado <= 0) {
      return 'Informe um valor maior que zero.'
    }

    if (!prazoMeses || prazoMeses < 2 || prazoMeses > 102) {
      return 'Prazo deve ser entre 2 e 102 meses.'
    }

    if (!dataParcela || dataParcela < minData || dataParcela > maxData) {
      return 'Data da 1ª parcela deve ser entre amanhã e 60 dias.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    const valorSolicitado = parseCurrencyBRL(valorDisplay)
    const prazoMeses = parseInt(prazo, 10)
    const erroValidacao = validarFormulario(valorSolicitado, prazoMeses)

    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    setLoading(true)

    try {
      const resultado = await simular(valorSolicitado, prazoMeses)
      onSimular({
        ...resultado,
        dataPrimeiraParcela: dataParcela,
      })
    } catch (err) {
      setErro(err.message || 'Erro ao simular.')
    } finally {
      setLoading(false)
    }
  }

  return {
    valorDisplay,
    prazo,
    dataParcela,
    erro,
    loading,
    minData,
    maxData,
    setPrazo,
    setDataParcela,
    handleValorChange,
    handleSubmit,
  }
}
