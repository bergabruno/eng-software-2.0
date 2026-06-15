# Prompt Especializado — MVP Consignado INSS (FIAP)

> Cole este prompt inteiro em um agente de implementação. Siga rigorosamente a ordem de execução e a estrutura de arquivos definidas.

---

## 1. Objetivo

Construir um MVP funcional de crédito consignado INSS para apresentação em aula na FIAP.

Regras absolutas:
- Apenas a **calculadora financeira é real** (fórmula Price).
- Toda comunicação com a **Dataprev é mockada no backend**.
- Sem banco de dados — estado em memória do processo Node.js.
- Sem autenticação real — login com botão único.
- Sem Docker, sem testes, sem lint.
- Código enxuto e didático. Evitar abstrações desnecessárias.

---

## 2. Stack Obrigatória

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express |
| Linguagem | JavaScript puro (sem TypeScript) |
| Gerenciador de pacotes | npm |

Não usar: TypeScript, Docker, React Router, Redux, Prisma, banco de dados de qualquer tipo.

---

## 3. Estrutura de Pastas (criar exatamente assim)

```
/                          ← raiz do projeto
├── package.json           ← script único para subir tudo
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx        ← gerencia tela ativa via useState
│       ├── api.js         ← todas as chamadas HTTP ao backend
│       ├── calc.js        ← calculadora Price (pura, sem side effects)
│       └── telas/
│           ├── Login.jsx
│           ├── Home.jsx
│           ├── Emprestimos.jsx
│           ├── Simulacao.jsx
│           ├── ResultadoSimulacao.jsx
│           ├── StatusDataprev.jsx
│           ├── Contratacao.jsx
│           └── Comprovante.jsx
└── backend/
    ├── package.json
    ├── server.js          ← ponto de entrada, monta app Express
    ├── estado.js          ← estado em memória (saldo, contador, contratos)
    ├── calculadora.js     ← mesma lógica Price usada para validar
    └── rotas/
        ├── auth.js
        ├── conta.js
        ├── simulacao.js
        ├── dataprev.js
        └── contratacao.js
```

---

## 4. Inicialização do Projeto

### 4.1 `package.json` na raiz

```json
{
  "name": "consignado-mvp",
  "private": true,
  "scripts": {
    "install:all": "npm install --prefix backend && npm install --prefix frontend",
    "dev:backend": "npm run dev --prefix backend",
    "dev:frontend": "npm run dev --prefix frontend",
    "dev": "npm run install:all && npx concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Comando de uso pelo desenvolvedor:
```bash
npm install        # instala concurrently na raiz
npm run dev        # instala subprojetos + sobe backend e frontend juntos
```

### 4.2 `backend/package.json`

```json
{
  "name": "consignado-backend",
  "scripts": {
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2"
  }
}
```

### 4.3 `frontend/package.json`

```json
{
  "name": "consignado-frontend",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  }
}
```

### 4.4 Configurações Tailwind v3

**`frontend/tailwind.config.js`**
```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fiap: {
          rosa: '#ED145B',
          'rosa-hover': '#D10F50',
        },
      },
    },
  },
  plugins: [],
}
```

**`frontend/postcss.config.js`**
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**`frontend/src/main.jsx`**
```jsx
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

**`frontend/index.css`** (adicionar no topo):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4.5 Vite — porta e proxy

**`frontend/vite.config.js`**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

> O proxy do Vite elimina problemas de CORS em desenvolvimento. Todas as chamadas do frontend devem usar `/api/...` (sem `http://localhost:3001`).

---

## 5. Backend — Estado em Memória

**`backend/estado.js`**

```js
// Estado global do processo. Reiniciar o servidor zera tudo.
const estado = {
  saldo: 0,
  contadorDataprev: 0,   // incrementa a cada chamada; par = sucesso, ímpar = erro
  contratos: [],
  contadorContrato: 0,
}

module.exports = estado
```

Regra de alternância Dataprev:
- `contadorDataprev` começa em `0`.
- A cada chamada: verificar `contadorDataprev % 2`.
  - `=== 1` (ímpar) → **erro** (primeira chamada é ímpar após incremento).
  - `=== 0` (par) → **sucesso**.
- Incrementar antes de checar.

Implementação da função de validação Dataprev:

```js
// dentro de dataprev.js
const ERROS = ['sem_margem', 'sem_dinheiro_simular', 'sem_dinheiro_contratar']

function consultarDataprev() {
  estado.contadorDataprev += 1
  const ehErro = estado.contadorDataprev % 2 !== 0
  if (ehErro) {
    const codigo = ERROS[Math.floor(Math.random() * ERROS.length)]
    return { ok: false, codigo }
  }
  return { ok: true }
}
```

Resultado das chamadas:
| Chamada | Contador | Resultado |
|---|---|---|
| 1ª | 1 (ímpar) | erro |
| 2ª | 2 (par) | sucesso |
| 3ª | 3 (ímpar) | erro |
| 4ª | 4 (par) | sucesso |

---

## 6. Backend — Calculadora Financeira Real

**`backend/calculadora.js`** — Tabela Price (PMT):

```js
const TAXA_MENSAL = 0.018 // 1,80% a.m. — taxa fixa de mercado consignado INSS

function calcularSimulacao(valorSolicitado, prazoMeses) {
  const pv = valorSolicitado
  const i = TAXA_MENSAL
  const n = prazoMeses
  const fator = Math.pow(1 + i, n)
  const pmt = pv * (i * fator) / (fator - 1)
  const valorParcela = Math.round(pmt * 100) / 100
  const cetAnualPercentual = Math.round(i * 12 * 10000) / 100  // simplificado para MVP
  const valorLiberado = pv  // no MVP o valor liberado = valor solicitado
  return {
    valorSolicitado: pv,
    prazoMeses: n,
    taxaMensal: i,
    taxaMensalPercentual: i * 100,
    cetAnualPercentual,
    valorParcela,
    valorLiberado,
    totalPagar: Math.round(valorParcela * n * 100) / 100,
  }
}

function validarEntrada(valorSolicitado, prazoMeses) {
  if (!valorSolicitado || valorSolicitado <= 0) return 'Valor solicitado deve ser maior que zero.'
  if (!prazoMeses || prazoMeses < 2 || prazoMeses > 102) return 'Prazo deve ser entre 2 e 102 meses.'
  return null
}

module.exports = { calcularSimulacao, validarEntrada, TAXA_MENSAL }
```

---

## 7. Backend — Rotas Completas

### `backend/server.js`

```js
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./rotas/auth'))
app.use('/api/conta', require('./rotas/conta'))
app.use('/api/simulacao', require('./rotas/simulacao'))
app.use('/api/dataprev', require('./rotas/dataprev'))
app.use('/api/contratacao', require('./rotas/contratacao'))

app.listen(3001, () => console.log('Backend rodando em http://localhost:3001'))
```

### Contratos de API Completos

**Base URL (via proxy Vite):** `/api`

---

#### POST `/api/auth/login`
Request: `{}` (body vazio)
Response 200:
```json
{ "ok": true, "nome": "Cliente FIAP" }
```

---

#### POST `/api/auth/logout`
Request: `{}` (body vazio)
Response 200:
```json
{ "ok": true }
```

---

#### GET `/api/conta/saldo`
Response 200:
```json
{ "saldo": 0 }
```

---

#### POST `/api/simulacao`
Request:
```json
{ "valorSolicitado": 5000, "prazoMeses": 24 }
```
Response 200:
```json
{
  "valorSolicitado": 5000,
  "prazoMeses": 24,
  "taxaMensal": 0.018,
  "taxaMensalPercentual": 1.8,
  "cetAnualPercentual": 21.6,
  "valorParcela": 249.61,
  "valorLiberado": 5000,
  "totalPagar": 5990.64
}
```
Response 400 (validação):
```json
{ "ok": false, "mensagem": "Prazo deve ser entre 2 e 102 meses." }
```

---

#### POST `/api/dataprev/validar`

> Avança o contador de alternância. Chamada **separada** da contratação — o frontend chama este endpoint para exibir a tela de status Dataprev. A contratação **NÃO chama Dataprev novamente** — confia no token recebido.

Request:
```json
{ "valorSolicitado": 5000, "prazoMeses": 24 }
```
Response sucesso 200:
```json
{ "ok": true, "status": "aprovado", "token": "dp_ok_1749000000000" }
```
Response erro 422:
```json
{
  "ok": false,
  "codigo": "sem_margem",
  "mensagem": "Cliente não possui margem consignável ou está com bloqueio na Dataprev."
}
```

Códigos de erro possíveis:
| Código | Descrição exibida |
|---|---|
| `sem_margem` | Cliente não possui margem consignável ou está com bloqueio na Dataprev. |
| `sem_dinheiro_simular` | Cliente não possui recursos disponíveis para simulação na Dataprev. |
| `sem_dinheiro_contratar` | Cliente não possui recursos disponíveis para contratação na Dataprev. |

---

#### POST `/api/contratacao`

> Recebe o token gerado pela validação Dataprev. **Não chama Dataprev de novo.** Valida token, cria contrato e atualiza saldo.

Request:
```json
{
  "tokenDataprev": "dp_ok_1749000000000",
  "simulacao": {
    "valorSolicitado": 5000,
    "prazoMeses": 24,
    "valorParcela": 249.61,
    "valorLiberado": 5000,
    "taxaMensal": 0.018,
    "cetAnualPercentual": 21.6,
    "totalPagar": 5990.64
  }
}
```
Response sucesso 200:
```json
{
  "ok": true,
  "contratoId": "CTR-0001",
  "saldoAntes": 0,
  "valorCreditado": 5000,
  "saldoDepois": 5000,
  "dataContratacao": "2026-06-15T10:30:00.000Z",
  "mensagem": "Contratação realizada com sucesso."
}
```
Response erro 422 (token inválido ou ausente):
```json
{
  "ok": false,
  "mensagem": "Validação Dataprev não realizada ou expirada. Reinicie a simulação."
}
```

Lógica do token no backend:
- Gerar token como `dp_ok_${Date.now()}` no `/dataprev/validar` quando sucesso.
- Armazenar o último token válido em `estado.ultimoTokenDataprev`.
- Em `/contratacao`, conferir se o token recebido é igual ao armazenado.
- Após uso, limpar `estado.ultimoTokenDataprev = null`.
- `contratoId` usa formato `CTR-${String(++estado.contadorContrato).padStart(4, '0')}`.

---

## 8. Frontend — Gerenciamento de Telas

**Não usar React Router.** Usar `useState` no `App.jsx` para controlar qual tela está ativa.

**`frontend/src/App.jsx`** — estrutura base:

```jsx
import { useState } from 'react'
import Login from './telas/Login'
import Home from './telas/Home'
import Emprestimos from './telas/Emprestimos'
import Simulacao from './telas/Simulacao'
import ResultadoSimulacao from './telas/ResultadoSimulacao'
import StatusDataprev from './telas/StatusDataprev'
import Contratacao from './telas/Contratacao'
import Comprovante from './telas/Comprovante'

export default function App() {
  const [tela, setTela] = useState('login')
  const [simulacao, setSimulacao] = useState(null)      // resultado da simulação
  const [dataprev, setDataprev] = useState(null)        // resultado do validar
  const [comprovante, setComprovante] = useState(null)  // resultado da contratação
  const [saldo, setSaldo] = useState(0)

  const ir = (proxima) => setTela(proxima)

  const telas = {
    login: <Login onEntrar={() => ir('home')} />,
    home: <Home saldo={saldo} onEmprestimos={() => ir('emprestimos')} onLogout={() => ir('login')} />,
    emprestimos: <Emprestimos onVoltar={() => ir('home')} onConsignado={() => ir('simulacao')} />,
    simulacao: <Simulacao onVoltar={() => ir('emprestimos')} onSimular={(s) => { setSimulacao(s); ir('resultado') }} />,
    resultado: <ResultadoSimulacao simulacao={simulacao} onVoltar={() => ir('simulacao')} onValidar={() => ir('dataprev')} />,
    dataprev: <StatusDataprev simulacao={simulacao} onVoltar={() => ir('resultado')} onContinuar={(dp) => { setDataprev(dp); ir('contratacao') }} onErro={() => ir('resultado')} />,
    contratacao: <Contratacao simulacao={simulacao} dataprev={dataprev} onVoltar={() => ir('dataprev')} onContratar={(c) => { setComprovante(c); setSaldo(c.saldoDepois); ir('comprovante') }} />,
    comprovante: <Comprovante comprovante={comprovante} onInicio={() => { setSimulacao(null); setDataprev(null); setComprovante(null); ir('home') }} />,
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      {telas[tela]}
    </div>
  )
}
```

**`frontend/src/api.js`** — todas as chamadas HTTP:

```js
const BASE = '/api'

export async function login() {
  const r = await fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
  return r.json()
}

export async function logout() {
  await fetch(`${BASE}/auth/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
}

export async function getSaldo() {
  const r = await fetch(`${BASE}/conta/saldo`)
  return r.json()
}

export async function simular(valorSolicitado, prazoMeses) {
  const r = await fetch(`${BASE}/simulacao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valorSolicitado, prazoMeses }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.mensagem || 'Erro na simulação')
  return data
}

export async function validarDataprev(valorSolicitado, prazoMeses) {
  const r = await fetch(`${BASE}/dataprev/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valorSolicitado, prazoMeses }),
  })
  const data = await r.json()
  return { status: r.status, ...data }
}

export async function contratar(tokenDataprev, simulacao) {
  const r = await fetch(`${BASE}/contratacao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenDataprev, simulacao }),
  })
  const data = await r.json()
  return { status: r.status, ...data }
}
```

---

## 9. Telas — Especificação Detalhada

### Tela 1 — Login

Componente: `Login.jsx`

Layout:
- Fundo preto `#0A0A0A`, centralizado vertical e horizontal.
- Logo/título: **"ConsigFIAP"** em branco, grande, acima do botão.
- Subtítulo: "Crédito Consignado INSS" em `#B3B3B3`.
- Botão "Entrar" estilo primário FIAP (rosa `#ED145B`).
- Ao clicar: chama `onEntrar()` — sem chamada HTTP necessária.

### Tela 2 — Home (Saldo)

Componente: `Home.jsx`

Layout:
- Header com "ConsigFIAP" e botão "Sair" no canto direito.
- Card de saldo centralizado:
  - Label: "Saldo em conta"
  - Valor: `R$ 0,00` formatado em BRL
  - Fundo `#141414`, borda `#2A2A2A`
- Botão "Ver Empréstimos" rosa.

Recebe via props: `saldo`, `onEmprestimos`, `onLogout`.

Formatar valores sempre em `BRL`:
```js
new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
```

### Tela 3 — Empréstimos

Componente: `Emprestimos.jsx`

Layout:
- Header com botão "← Voltar".
- Título: "Empréstimos".
- Card produto:
  - Ícone (pode usar emoji 📋 ou svg simples)
  - Nome: **"Empréstimo Consignado INSS"**
  - Descrição curta: "Desconto direto no benefício. Taxas a partir de 1,80% a.m."
  - Botão "Solicitar" rosa.
- Ao clicar "Solicitar": chama `onConsignado()`.

### Tela 4 — Simulação

Componente: `Simulacao.jsx`

Layout:
- Header com botão "← Voltar".
- Título: "Simular Empréstimo".
- Formulário:
  - Campo "Valor desejado" — input numérico (monetário) com `R$` prefixado.
  - Campo "Prazo" — input numérico com sufixo "meses", placeholder "2 a 102".
  - Taxa exibida como info estática (não editável): "Taxa: 1,80% a.m."
  - Botão "Simular" rosa.
- Estados: loading (desabilitar botão + texto "Calculando..."), erro inline.
- Ao submeter: chamar `api.simular()` e em sucesso chamar `onSimular(resultado)`.
- Validar no frontend antes de chamar: valor > 0, prazo entre 2 e 102.

### Tela 5 — Resultado da Simulação

Componente: `ResultadoSimulacao.jsx`

Layout:
- Header com botão "← Voltar".
- Título: "Resultado da Simulação".
- Card de resultado com os dados formatados em tabela/lista:

| Campo | Valor |
|---|---|
| Valor solicitado | R$ X.XXX,XX |
| Prazo | XX meses |
| Taxa mensal | 1,80% a.m. |
| CET (anual) | XX,XX% a.a. |
| Valor da parcela | R$ XXX,XX |
| Total a pagar | R$ X.XXX,XX |
| Valor liberado | R$ X.XXX,XX |

- Botão "Validar na Dataprev" rosa — chama `onValidar()`.
- Botão secundário "← Nova simulação" — chama `onVoltar()`.

### Tela 6 — Status Dataprev

Componente: `StatusDataprev.jsx`

Comportamento (estado interno com `useState`):
1. Ao montar o componente: exibir **loading animado** por 2 segundos simulando comunicação.
   - Texto: "Consultando Dataprev..." com spinner CSS.
   - Usar `setTimeout(chamarAPI, 2000)` dentro de `useEffect([], [])`.
2. Após 2 segundos: chamar `api.validarDataprev()`.
3. **Se sucesso** (`ok: true`):
   - Exibir badge verde "✓ Aprovado pela Dataprev".
   - Texto: "Margem consignável verificada com sucesso."
   - Botão "Continuar para contratação" rosa — chama `onContinuar(dataprev)`.
4. **Se erro** (`ok: false`):
   - Exibir badge vermelho com ícone "✗".
   - Texto: mensagem de erro retornada pela API.
   - Código do erro em destaque (badge cinza).
   - Botão "Tentar novamente" — chama `onVoltar()` para voltar ao resultado.

Não exibir botão de retry automático. O usuário volta e reinicia o fluxo.

### Tela 7 — Contratação

Componente: `Contratacao.jsx`

Layout:
- Header com botão "← Voltar".
- Título: "Confirmar Contratação".
- Card resumo do contrato (usar dados de `simulacao`):
  - Valor liberado
  - Parcela
  - Prazo
  - Taxa
- Destaque: "Dataprev: ✓ Aprovado" em verde.
- Botão principal "Contratar agora" rosa.
- Estados: loading (texto "Processando..."), erro inline.
- Ao contratar: chamar `api.contratar(dataprev.token, simulacao)`.
- Em sucesso: chamar `onContratar(comprovante)`.
- Em erro: exibir mensagem e botão "Voltar".

### Tela 8 — Comprovante Final

Componente: `Comprovante.jsx`

Layout:
- Ícone de sucesso grande (✓ verde).
- Título: "Contratação realizada!".
- Card comprovante com:

| Campo | Valor |
|---|---|
| Número do contrato | CTR-XXXX |
| Valor creditado | R$ X.XXX,XX |
| Saldo anterior | R$ 0,00 |
| Saldo atual | R$ X.XXX,XX |
| Data/hora | XX/XX/XXXX XX:XX |

- Botão "Ir para home" rosa — chama `onInicio()`.

---

## 10. Design System — Paleta FIAP

### Cores obrigatórias

| Token | Hex | Uso |
|---|---|---|
| Rosa FIAP (primária) | `#ED145B` | Botões, destaques, logo |
| Rosa hover | `#D10F50` | Hover dos botões primários |
| Fundo principal | `#0A0A0A` | Background da aplicação |
| Superfície | `#141414` | Cards, modais |
| Borda | `#2A2A2A` | Bordas de cards e inputs |
| Texto principal | `#F5F5F5` | Textos primários |
| Texto secundário | `#B3B3B3` | Labels, placeholders |
| Sucesso | `#22C55E` | Status aprovado, comprovante |
| Erro | `#EF4444` | Alertas, status negado |

### Classes Tailwind reutilizáveis (definir no `index.css`)

```css
@layer components {
  .btn-primary {
    @apply bg-[#ED145B] hover:bg-[#D10F50] text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full;
  }
  .btn-secondary {
    @apply bg-transparent border border-[#2A2A2A] hover:border-[#ED145B] text-[#B3B3B3] hover:text-[#F5F5F5] font-medium py-3 px-6 rounded-lg transition-colors w-full;
  }
  .card {
    @apply bg-[#141414] border border-[#2A2A2A] rounded-xl p-6;
  }
  .input-field {
    @apply bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#ED145B] text-[#F5F5F5] rounded-lg px-4 py-3 w-full outline-none transition-colors;
  }
  .label {
    @apply text-[#B3B3B3] text-sm mb-1 block;
  }
  .badge-success {
    @apply bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-full px-3 py-1 text-sm inline-flex items-center gap-1;
  }
  .badge-error {
    @apply bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 rounded-full px-3 py-1 text-sm inline-flex items-center gap-1;
  }
}
```

### Header padrão (usar em todas as telas exceto Login)

```jsx
<header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
  <span className="text-[#ED145B] font-bold text-xl">ConsigFIAP</span>
  {/* slot direito: botão voltar ou sair */}
</header>
```

### Spinner CSS simples

```jsx
<div className="w-8 h-8 border-2 border-[#2A2A2A] border-t-[#ED145B] rounded-full animate-spin mx-auto" />
```

### Tipografia

- Fonte: `font-sans` padrão do sistema (Inter, SF Pro, Segoe UI — dependendo do SO).
- Não importar fonte externa — manter simples.

### Responsividade

- Usar `max-w-md mx-auto` para centralizar em desktop.
- Funcionar sem scroll horizontal em mobile.

---

## 11. Regras de Negócio (resumo para implementação)

| Regra | Comportamento |
|---|---|
| RN-01 | Apenas valor e prazo são entrados pelo usuário |
| RN-02 | Taxa 1,80% a.m. é fixa e não editável |
| RN-03 | Prazo mínimo 2 meses, máximo 102 meses |
| RN-04 | Calculadora usa tabela Price obrigatoriamente |
| RN-05 | Dataprev alterna: 1ª chamada erro, 2ª sucesso, 3ª erro... |
| RN-06 | Erro Dataprev sorteia 1 de 3 códigos aleatoriamente |
| RN-07 | Contratação só ocorre com token válido do Dataprev |
| RN-08 | Token é consumido após uso (uso único por contrato) |
| RN-09 | Saldo atualiza apenas em contratação bem-sucedida |
| RN-10 | Estado reinicia quando o servidor Node é reiniciado |

---

## 12. Ordem de Execução Obrigatória

Implementar nesta sequência. Não pular etapas.

```
FASE 1 — ESTRUTURA
  [ ] 1.1  Criar pasta raiz com package.json e instalar concurrently
  [ ] 1.2  Criar backend/ com estrutura de arquivos definida
  [ ] 1.3  Criar frontend/ com Vite + React + Tailwind v3

FASE 2 — BACKEND
  [ ] 2.1  Implementar estado.js (saldo, contador, contratos)
  [ ] 2.2  Implementar calculadora.js (Price)
  [ ] 2.3  Implementar rota /api/auth (login e logout)
  [ ] 2.4  Implementar rota /api/conta/saldo
  [ ] 2.5  Implementar rota /api/simulacao (usar calculadora.js)
  [ ] 2.6  Implementar rota /api/dataprev/validar (alternância + token)
  [ ] 2.7  Implementar rota /api/contratacao (validar token + atualizar saldo)
  [ ] 2.8  Testar todas as rotas manualmente com curl ou Postman

FASE 3 — FRONTEND BASE
  [ ] 3.1  Configurar Tailwind e classes base no index.css
  [ ] 3.2  Implementar App.jsx com gerenciamento de telas via useState
  [ ] 3.3  Implementar api.js com todas as funções de chamada HTTP

FASE 4 — TELAS (em ordem)
  [ ] 4.1  Login.jsx
  [ ] 4.2  Home.jsx (com formatação BRL)
  [ ] 4.3  Emprestimos.jsx
  [ ] 4.4  Simulacao.jsx (validação no frontend + loading)
  [ ] 4.5  ResultadoSimulacao.jsx (exibir todos os campos)
  [ ] 4.6  StatusDataprev.jsx (delay 2s + spinner + resultado)
  [ ] 4.7  Contratacao.jsx (resumo + loading + erro)
  [ ] 4.8  Comprovante.jsx (saldo antes/depois + timestamp)

FASE 5 — INTEGRAÇÃO E AJUSTES
  [ ] 5.1  Validar fluxo completo ponta a ponta (sucesso)
  [ ] 5.2  Validar fluxo com erro Dataprev
  [ ] 5.3  Verificar se saldo atualiza corretamente após contratação
  [ ] 5.4  Verificar alternância erro/sucesso da Dataprev
  [ ] 5.5  Ajustar visual FIAP (cores, cards, botões, header)
  [ ] 5.6  Testar em mobile (viewport 390px)
```

---

## 13. Checklist de Entrega

- [ ] Comando `npm run dev` na raiz sobe frontend e backend juntos
- [ ] Frontend abre em `http://localhost:5173`
- [ ] Backend responde em `http://localhost:3001`
- [ ] Login com botão único funciona
- [ ] Tela de saldo exibe R$ 0,00 inicial
- [ ] Card Empréstimo Consignado INSS aparece
- [ ] Simulação calcula parcela correta (Price)
- [ ] Resultado exibe: parcela, CET, taxa, total a pagar, valor liberado
- [ ] Tela Dataprev mostra loading de 2s antes de exibir resultado
- [ ] 1ª tentativa Dataprev retorna erro
- [ ] 2ª tentativa Dataprev retorna sucesso
- [ ] Mensagem de erro exibe código e texto correto
- [ ] Tela de contratação exibe resumo e botão confirmar
- [ ] Contratação atualiza saldo na Home
- [ ] Comprovante exibe saldo antes/depois e ID do contrato
- [ ] Logout volta para tela de Login
- [ ] Visual usa paleta FIAP (fundo preto, botões rosa)
- [ ] Sem erros no console do browser
- [ ] Sem erros no terminal do Node

---

## 14. Critérios de Aceite (para demonstração em aula)

1. Um comando na raiz sobe tudo sem configuração adicional.
2. O fluxo completo pode ser demonstrado sem internet.
3. A calculadora gera valores corretos (comparar manualmente: R$ 5.000 / 24 meses = R$ 249,61).
4. A Dataprev alterna de forma previsível: 1ª vez dá erro, 2ª vez dá sucesso.
5. O saldo na Home é atualizado após contratação bem-sucedida.
6. Interface com identidade visual FIAP (preto e rosa `#ED145B`).

---

## 15. O Que Não Implementar

- Banco de dados de qualquer tipo
- React Router ou qualquer biblioteca de roteamento
- Autenticação real (JWT, OAuth2, sessão)
- Assinatura eletrônica, OTP, averbação
- Kafka, Redis, SQS ou qualquer mensageria
- Testes automatizados
- ESLint ou Prettier
- TypeScript
- Observabilidade ou logging avançado
- Módulos além dos descritos neste prompt
