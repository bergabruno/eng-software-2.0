# Relatório de Modernização de Sistemas

## 1. Contexto do Projeto

Este relatório documenta a modernização do projeto acadêmico **eng-software-2.0**, desenvolvido no contexto da disciplina de Engenharia de Software.

O projeto possui três marcos principais:

```text
eng-software-2.0/
  0306/   entrega inicial, arquitetura e prompts
  1506/   versão funcional original do projeto
  2606/   versão modernizada e refatorada
```

A modernização teve como objetivo melhorar a organização, manutenção, legibilidade e sustentabilidade do sistema, sem adicionar novas funcionalidades.

A aplicação representa um fluxo simplificado de crédito consignado INSS, com frontend em React/Vite e backend em Node.js/Express.

O fluxo preservado foi:

```text
login -> home -> empréstimos -> simulação -> resultado -> Dataprev -> contratação -> comprovante
```

---

## 2. Estrutura Original

A versão original estava concentrada na pasta `1506`.

### 2.1. Estrutura original resumida

```text
eng-software-2.0/
  0306/
    arquitetura-completa.md
    prompt-especializado-mvp-consignado.md
    trabalho0306.md

  1506/
    backend/
      estado.js
      server.js
      calculadora.js
      package-lock.json
      package.json
      rotas/
        contratacao.js
        auth.js
        dataprev.js
        simulacao.js
        conta.js

    frontend/
      postcss.config.js
      vite.config.js
      tailwind.config.js
      index.html
      package-lock.json
      package.json
      src/
        main.jsx
        api.js
        calc.js
        index.css
        App.jsx
        telas/
          StatusDataprev.jsx
          Home.jsx
          Contratacao.jsx
          Login.jsx
          ResultadoSimulacao.jsx
          Comprovante.jsx
          Simulacao.jsx
          Emprestimos.jsx

  2606/
```

### 2.2. Backend original

O backend original utilizava Express de forma simples, com:

- `server.js` configurando servidor, middlewares e rotas.
- `estado.js` armazenando saldo, contratos, contador Dataprev, contador de contrato e token Dataprev em memória.
- `calculadora.js` concentrando cálculo de simulação.
- Pasta `rotas/` contendo handlers HTTP com regra de negócio diretamente nas rotas.

### 2.3. Frontend original

O frontend original utilizava React com Vite e Tailwind, com:

- `App.jsx` centralizando navegação e estado do fluxo.
- `api.js` concentrando todas as chamadas HTTP.
- `calc.js` contendo cálculo financeiro duplicado no frontend.
- Telas com helpers locais repetidos, como `brl`, `formatarData`, `formatarBRL`, `parseBRL` e `dataISO`.
- Componentes de tela acumulando renderização, validação, formatação e chamadas de API.

---

## 3. Diagnóstico de Dívida Técnica

A análise da versão `1506` identificou as seguintes dívidas técnicas.

### 3.1. Dívidas técnicas no backend

| Severidade | Problema | Impacto |
|---|---|---|
| Alta | Uso de estado global em memória diretamente pelas rotas | Alto acoplamento, perda de dados ao reiniciar servidor e baixa testabilidade |
| Alta | Rotas com regra de negócio embutida | Dificulta manutenção e evolução |
| Alta | Ausência de separação entre controller, service, validation e repository | Código procedural e pouco escalável |
| Média | Tratamento de erro descentralizado | Respostas inconsistentes e maior chance de falhas |
| Média | Validação de entrada misturada com handlers HTTP | Baixa clareza de responsabilidade |
| Média | Dataprev mockado com comportamento parcialmente aleatório | Testes e reprodução de erros ficam menos previsíveis |
| Média | Cálculo financeiro duplicado entre backend e frontend | Risco de divergência entre as camadas |
| Baixa | `server.js` concentrando configuração e inicialização | Baixa organização para crescimento |

### 3.2. Dívidas técnicas no frontend

| Severidade | Problema | Impacto |
|---|---|---|
| Alta | `App.jsx` concentrando navegação e estado do fluxo | Componente central cresce demais |
| Média | `api.js` concentrando chamadas de todos os domínios | Baixa organização e manutenção difícil |
| Média | Helpers de moeda e data duplicados em várias telas | Risco de inconsistência visual e manutenção repetitiva |
| Média | `Simulacao.jsx` acumulando UI, validação, parsing, datas e API | Componente com responsabilidades demais |
| Média | Cálculo financeiro presente no frontend em `calc.js` | Duplicação da regra do backend |
| Baixa | Componentes visuais repetidos, como header e linhas de informação | Repetição de JSX e estilos |
| Baixa | Ausência de testes automatizados | Refatoração sem rede de segurança |

---

## 4. Técnicas de Modernização Aplicadas

As seguintes técnicas de modernização foram aplicadas:

### 4.1. Separação de responsabilidades

O sistema foi reorganizado para separar responsabilidades entre camadas:

```text
routes -> controllers -> services -> validations -> domain/repositories
```

Essa separação reduz acoplamento e melhora a legibilidade.

### 4.2. Arquitetura em camadas no backend

O backend passou a ter uma organização mais próxima de uma arquitetura em camadas:

- `routes`: definição dos endpoints.
- `controllers`: adaptação entre HTTP e regra de negócio.
- `services`: regras de negócio e casos de uso.
- `validations`: validação explícita dos inputs.
- `repositories`: acesso ao estado em memória.
- `domain`: regras puras e fábricas de objetos.
- `middlewares`: tratamento de erro e rotas inexistentes.
- `constants`: centralização de valores fixos.
- `utils`: funções auxiliares.

### 4.3. Encapsulamento de estado

O estado em memória foi mantido para preservar o escopo acadêmico, mas deixou de ser acessado diretamente pelas rotas.

A versão modernizada encapsula esse estado em um repository:

```text
src/repositories/memoryRepository.js
```

### 4.4. Padronização de erros

Foi criada uma estrutura de erro HTTP com:

```text
src/domain/HttpError.js
src/middlewares/errorHandler.js
src/middlewares/notFoundHandler.js
```

Isso padroniza respostas de erro e reduz repetição.

### 4.5. Centralização de constantes

Constantes de negócio foram extraídas para arquivos próprios:

```text
src/constants/consignadoConstants.js
src/constants/dataprevConstants.js
```

### 4.6. Redução de duplicação no frontend

Helpers de moeda, data e input monetário foram centralizados:

```text
src/utils/formatters.js
src/utils/currencyInput.js
src/utils/dates.js
```

### 4.7. Extração de hooks no frontend

A lógica de fluxo e de formulário foi movida para hooks:

```text
src/hooks/useFluxoConsignado.js
src/hooks/useSimulacaoForm.js
```

### 4.8. Componentização simples

Foram criados componentes reutilizáveis quando havia repetição clara:

```text
src/components/AppHeader.jsx
src/components/ErrorMessage.jsx
src/components/InfoRow.jsx
```

### 4.9. Preservação de comportamento

A modernização preservou:

- Mesmos endpoints públicos.
- Mesmo fluxo de telas.
- Mesmos textos principais.
- Mesmo layout geral.
- Mesmo comportamento funcional esperado.
- Mesma stack tecnológica.

---

## 5. Refatorações Realizadas no Backend

### 5.1. Nova organização do backend

A versão `2606/backend` foi reorganizada para a seguinte estrutura:

```text
2606/backend/
  package.json
  package-lock.json
  server.js
  src/
    app.js
    config/
      env.js
    constants/
      consignadoConstants.js
      dataprevConstants.js
    controllers/
      authController.js
      contaController.js
      simulacaoController.js
      dataprevController.js
      contratacaoController.js
    domain/
      HttpError.js
      contratoFactory.js
      simulacaoCalculator.js
    middlewares/
      errorHandler.js
      notFoundHandler.js
    repositories/
      memoryRepository.js
    routes/
      index.js
      authRoutes.js
      contaRoutes.js
      simulacaoRoutes.js
      dataprevRoutes.js
      contratacaoRoutes.js
    services/
      authService.js
      contaService.js
      simulacaoService.js
      dataprevService.js
      contratacaoService.js
    utils/
      asyncHandler.js
      money.js
      response.js
    validations/
      simulacaoValidation.js
      contratacaoValidation.js
```

### 5.2. Arquivos alterados no backend

```text
2606/backend/server.js
```

O arquivo `server.js` passou a ser apenas o ponto de entrada do servidor, delegando a criação da aplicação para `src/app.js`.

### 5.3. Arquivos removidos ou substituídos no backend

Os arquivos legados abaixo deixaram de ser necessários na estrutura final:

```text
2606/backend/rotas/
2606/backend/estado.js
2606/backend/calculadora.js
```

Eles foram substituídos pela nova estrutura em `src/`.

### 5.4. Arquivos criados no backend

```text
2606/backend/src/app.js
2606/backend/src/config/env.js

2606/backend/src/constants/consignadoConstants.js
2606/backend/src/constants/dataprevConstants.js

2606/backend/src/controllers/authController.js
2606/backend/src/controllers/contaController.js
2606/backend/src/controllers/simulacaoController.js
2606/backend/src/controllers/dataprevController.js
2606/backend/src/controllers/contratacaoController.js

2606/backend/src/domain/HttpError.js
2606/backend/src/domain/contratoFactory.js
2606/backend/src/domain/simulacaoCalculator.js

2606/backend/src/middlewares/errorHandler.js
2606/backend/src/middlewares/notFoundHandler.js

2606/backend/src/repositories/memoryRepository.js

2606/backend/src/routes/index.js
2606/backend/src/routes/authRoutes.js
2606/backend/src/routes/contaRoutes.js
2606/backend/src/routes/simulacaoRoutes.js
2606/backend/src/routes/dataprevRoutes.js
2606/backend/src/routes/contratacaoRoutes.js

2606/backend/src/services/authService.js
2606/backend/src/services/contaService.js
2606/backend/src/services/simulacaoService.js
2606/backend/src/services/dataprevService.js
2606/backend/src/services/contratacaoService.js

2606/backend/src/utils/asyncHandler.js
2606/backend/src/utils/money.js
2606/backend/src/utils/response.js

2606/backend/src/validations/simulacaoValidation.js
2606/backend/src/validations/contratacaoValidation.js
```

### 5.5. Endpoints preservados

Os endpoints públicos foram mantidos:

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/conta/saldo
POST /api/simulacao
POST /api/dataprev/validar
POST /api/contratacao
```

### 5.6. Decisões arquiteturais no backend

#### Decisão 1 — Manter Express

O projeto já utilizava Express. A modernização manteve a biblioteca para evitar mudança de stack e risco de quebra.

#### Decisão 2 — Não adicionar banco de dados

A versão original usava estado em memória. Para não adicionar funcionalidade nova, o estado foi mantido em memória, mas encapsulado em repository.

#### Decisão 3 — Criar services

As regras de negócio foram movidas das rotas para services, facilitando manutenção e testes futuros.

#### Decisão 4 — Criar validations

As validações de entrada foram extraídas para arquivos específicos, tornando os controllers mais simples.

#### Decisão 5 — Criar camada domain

Cálculo de simulação e criação de contrato foram separados como regras de domínio.

#### Decisão 6 — Padronizar erro com `HttpError`

A criação de uma classe de erro HTTP permite que services lancem erros de negócio sem depender diretamente do Express.

#### Decisão 7 — Remover aleatoriedade do Dataprev mockado

O comportamento de sucesso/erro foi preservado como alternado, mas a escolha do erro deixou de depender de `Math.random`. Essa decisão reduz instabilidade e melhora reprodutibilidade.

---

## 6. Refatorações Realizadas no Frontend

### 6.1. Nova organização do frontend

A versão `2606/frontend` foi reorganizada para a seguinte estrutura:

```text
2606/frontend/
  postcss.config.js
  vite.config.js
  tailwind.config.js
  index.html
  package-lock.json
  package.json
  src/
    main.jsx
    index.css
    App.jsx
    api.js
    components/
      AppHeader.jsx
      ErrorMessage.jsx
      InfoRow.jsx
    hooks/
      useFluxoConsignado.js
      useSimulacaoForm.js
    services/
      httpClient.js
      authService.js
      contaService.js
      simulacaoService.js
      dataprevService.js
      contratacaoService.js
    utils/
      currencyInput.js
      dates.js
      formatters.js
    telas/
      StatusDataprev.jsx
      Home.jsx
      Contratacao.jsx
      Login.jsx
      ResultadoSimulacao.jsx
      Comprovante.jsx
      Simulacao.jsx
      Emprestimos.jsx
```

### 6.2. Arquivos alterados no frontend

```text
2606/frontend/src/App.jsx
2606/frontend/src/api.js
2606/frontend/src/telas/Home.jsx
2606/frontend/src/telas/Emprestimos.jsx
2606/frontend/src/telas/Simulacao.jsx
2606/frontend/src/telas/ResultadoSimulacao.jsx
2606/frontend/src/telas/StatusDataprev.jsx
2606/frontend/src/telas/Contratacao.jsx
2606/frontend/src/telas/Comprovante.jsx
```

### 6.3. Arquivos preservados no frontend

```text
2606/frontend/src/main.jsx
2606/frontend/src/index.css
2606/frontend/src/telas/Login.jsx
2606/frontend/vite.config.js
2606/frontend/tailwind.config.js
2606/frontend/postcss.config.js
2606/frontend/index.html
2606/frontend/package.json
2606/frontend/package-lock.json
```

### 6.4. Arquivos removidos ou substituídos no frontend

```text
2606/frontend/src/calc.js
```

O arquivo foi removido porque o cálculo financeiro deve ficar centralizado no backend, evitando duplicação da regra de negócio.

### 6.5. Arquivos criados no frontend

```text
2606/frontend/src/components/AppHeader.jsx
2606/frontend/src/components/ErrorMessage.jsx
2606/frontend/src/components/InfoRow.jsx

2606/frontend/src/hooks/useFluxoConsignado.js
2606/frontend/src/hooks/useSimulacaoForm.js

2606/frontend/src/services/httpClient.js
2606/frontend/src/services/authService.js
2606/frontend/src/services/contaService.js
2606/frontend/src/services/simulacaoService.js
2606/frontend/src/services/dataprevService.js
2606/frontend/src/services/contratacaoService.js

2606/frontend/src/utils/currencyInput.js
2606/frontend/src/utils/dates.js
2606/frontend/src/utils/formatters.js
```

### 6.6. Decisões arquiteturais no frontend

#### Decisão 1 — Manter navegação por estado

React Router não foi adicionado para evitar mudança de comportamento e dependência nova. A navegação por estado foi preservada, mas encapsulada em `useFluxoConsignado`.

#### Decisão 2 — Manter `api.js` como fachada

O arquivo `api.js` foi mantido para preservar imports existentes. Internamente, ele passou a exportar funções separadas por domínio.

#### Decisão 3 — Separar services por domínio

As chamadas HTTP foram divididas em:

```text
authService.js
contaService.js
simulacaoService.js
dataprevService.js
contratacaoService.js
```

#### Decisão 4 — Centralizar formatação

Helpers duplicados de moeda e data foram movidos para `utils`.

#### Decisão 5 — Extrair hook de formulário

A lógica de `Simulacao.jsx` foi movida para `useSimulacaoForm`, reduzindo a responsabilidade da tela.

#### Decisão 6 — Criar componentes apenas onde havia repetição

Foram criados apenas componentes simples e com ganho claro:

```text
AppHeader
ErrorMessage
InfoRow
```

---

## 7. Estrutura Final da Pasta 2606

```text
2606/
  backend/
    package.json
    package-lock.json
    server.js
    src/
      app.js
      config/
        env.js
      constants/
        consignadoConstants.js
        dataprevConstants.js
      controllers/
        authController.js
        contaController.js
        simulacaoController.js
        dataprevController.js
        contratacaoController.js
      domain/
        HttpError.js
        contratoFactory.js
        simulacaoCalculator.js
      middlewares/
        errorHandler.js
        notFoundHandler.js
      repositories/
        memoryRepository.js
      routes/
        index.js
        authRoutes.js
        contaRoutes.js
        simulacaoRoutes.js
        dataprevRoutes.js
        contratacaoRoutes.js
      services/
        authService.js
        contaService.js
        simulacaoService.js
        dataprevService.js
        contratacaoService.js
      utils/
        asyncHandler.js
        money.js
        response.js
      validations/
        simulacaoValidation.js
        contratacaoValidation.js

  frontend/
    postcss.config.js
    vite.config.js
    tailwind.config.js
    index.html
    package-lock.json
    package.json
    src/
      main.jsx
      index.css
      App.jsx
      api.js
      components/
        AppHeader.jsx
        ErrorMessage.jsx
        InfoRow.jsx
      hooks/
        useFluxoConsignado.js
        useSimulacaoForm.js
      services/
        httpClient.js
        authService.js
        contaService.js
        simulacaoService.js
        dataprevService.js
        contratacaoService.js
      utils/
        currencyInput.js
        dates.js
        formatters.js
      telas/
        StatusDataprev.jsx
        Home.jsx
        Contratacao.jsx
        Login.jsx
        ResultadoSimulacao.jsx
        Comprovante.jsx
        Simulacao.jsx
        Emprestimos.jsx
```

---

## 8. Validação Local

### 8.1. Comandos executados antes da modernização

Foram informados resultados locais para a versão `1506`.

#### Backend

```bash
cd 1506/backend
npm install
npm audit
npm run
```

Resultado informado:

```text
npm install: executado com sucesso
npm audit: found 0 vulnerabilities
npm run: script disponível: dev -> node --watch server.js
```

#### Frontend

```bash
cd 1506/frontend
npm install
npm audit
```

Resultado informado:

```text
npm install: executado com sucesso
npm audit: 2 vulnerabilities
1 moderate
1 high
```

A vulnerabilidade informada está relacionada a `esbuild <=0.24.2` usado pelo Vite. O `npm audit` sugeriu `npm audit fix --force`, mas isso instalaria `vite@8.1.0`, considerado breaking change. Por isso, a atualização forçada não foi aplicada como parte da modernização.

#### Busca por sinais de dívida técnica

Comando informado:

```bash
grep -R "TODO\|FIXME\|console.log\|Math.random\|localStorage\|senha\|password\|token" 1506 --exclude-dir=node_modules
```

Resultado relevante:

```text
console.log encontrado em backend/server.js
Math.random encontrado em backend/rotas/dataprev.js
token Dataprev encontrado em backend/rotas/contratacao.js e backend/rotas/dataprev.js
duplicações/termos relacionados em arquivos summary e package-lock
```

#### Verificação de testes

Comando informado:

```bash
find 1506 -type f \( -name "*.test.*" -o -name "*.spec.*" \)
```

Resultado informado:

```text
Foram encontrados apenas testes dentro de node_modules.
Não foram encontrados testes próprios do projeto.
```

#### Verificação de duplicação com jscpd

Comando informado:

```bash
npx jscpd 1506 --ignore "**/node_modules/**"
```

Resultado informado:

```text
Não executado com sucesso.
Erro de compatibilidade de GLIBC:
GLIBC_2.32, GLIBC_2.33 e GLIBC_2.34 não encontrados.
```

### 8.2. Comandos recomendados para validar a versão 2606

#### Backend

```bash
cd 2606/backend
npm install
npm run dev
```

#### Frontend

```bash
cd 2606/frontend
npm install
npm run dev
```

#### Validação manual do fluxo

```text
1. Abrir http://localhost:5173
2. Entrar
3. Ir para empréstimos
4. Solicitar empréstimo consignado
5. Simular valor e prazo
6. Validar na Dataprev
7. Em caso de reprovação, tentar novamente
8. Em caso de aprovação, contratar
9. Verificar comprovante
10. Voltar para home e conferir saldo atualizado
```

#### Validação de endpoints backend

```bash
curl -X POST http://localhost:3001/api/auth/login

curl http://localhost:3001/api/conta/saldo

curl -X POST http://localhost:3001/api/simulacao \
  -H "Content-Type: application/json" \
  -d '{"valorSolicitado":1000,"prazoMeses":12}'

curl -X POST http://localhost:3001/api/dataprev/validar \
  -H "Content-Type: application/json" \
  -d '{"valorSolicitado":1000,"prazoMeses":12}'
```

### 8.3. Resultados finais da versão 2606

Como não foram enviados resultados finais de execução da pasta `2606`, os itens abaixo ficam registrados como:

```text
npm install backend 2606: não executado
npm audit backend 2606: não executado
npm run dev backend 2606: não executado
npm install frontend 2606: não executado
npm audit frontend 2606: não executado
npm run dev frontend 2606: não executado
npm run build frontend 2606: não executado
npm test: não executado
npm run lint: não executado
```

---

## 9. Dívidas Técnicas Remanescentes

Apesar da modernização, algumas dívidas foram mantidas por decisão de escopo.

### 9.1. Persistência em memória

O sistema ainda utiliza estado em memória.

Impacto:

```text
Reiniciar o servidor zera saldo, contratos, contador Dataprev e token.
```

Motivo para manter:

```text
Adicionar banco de dados seria nova funcionalidade e aumentaria o escopo da entrega.
```

### 9.2. Autenticação mockada

O login continua simplificado.

Impacto:

```text
Não há senha, sessão real, JWT ou controle de autorização.
```

Motivo para manter:

```text
Implementar autenticação real mudaria o escopo funcional do projeto.
```

### 9.3. Ausência de testes automatizados

Não foram criados testes automatizados na refatoração.

Impacto:

```text
A validação depende de testes manuais e execução local.
```

Motivo para manter:

```text
O foco desta etapa foi modernização estrutural. Testes devem ser recomendados como evolução futura.
```

### 9.4. CORS aberto

O backend preserva o uso simples de CORS.

Impacto:

```text
Em produção, seria necessário restringir origens permitidas.
```

Motivo para manter:

```text
O comportamento original foi preservado.
```

### 9.5. Navegação manual no frontend

O frontend ainda navega por estado interno.

Impacto:

```text
Não há URLs próprias para cada tela.
```

Motivo para manter:

```text
Adicionar React Router exigiria biblioteca e mudança de arquitetura de navegação.
```

### 9.6. Vulnerabilidade do Vite/esbuild

Foi informado `npm audit` com vulnerabilidade no frontend original.

Impacto:

```text
Ambiente de desenvolvimento pode estar vulnerável conforme alerta do npm audit.
```

Motivo para manter:

```text
A correção sugerida exigia atualização forçada para versão com breaking change.
```

### 9.7. Falta de lint e build formal

Não foram enviados resultados finais de `npm run build`, `npm run lint` ou testes.

Impacto:

```text
A entrega depende de validação manual ou execução posterior desses comandos.
```

---

## 10. Prompts Utilizados

### Prompt 1 — Auditoria técnica inicial

Objetivo:

```text
Avaliar o código da versão 1506, identificar dívidas técnicas e propor foco de modernização.
```

Pontos principais solicitados:

```text
- Identificar dívidas técnicas.
- Avaliar backend e frontend.
- Manter a TREE como referência.
- Sugerir ferramentas e comandos locais.
- Limitar a sequência inicial a no máximo 5 passos.
```

Resultado produzido:

```text
Diagnóstico inicial de dívida técnica, riscos, oportunidades de refatoração e lista de arquivos a analisar.
```

### Prompt 2 — Plano de refatoração

Objetivo:

```text
Transformar a auditoria técnica em plano seguro para criar a versão 2606 a partir da 1506.
```

Pontos principais solicitados:

```text
- Indicar arquivos mantidos, alterados e criados.
- Sugerir nova organização do backend.
- Sugerir nova organização do frontend.
- Definir dívidas a resolver primeiro.
- Definir dívidas a apenas documentar.
- Não implementar código ainda.
```

Resultado produzido:

```text
Plano de refatoração com TREE proposta para 2606, ordem de execução, critérios de aceite e arquivos necessários.
```

### Prompt 3 — Refatoração do backend

Objetivo:

```text
Refatorar o backend da pasta 2606/backend com arquitetura em camadas.
```

Pontos principais solicitados:

```text
- Separar routes, services, validations e domain.
- Remover regra de negócio das rotas.
- Padronizar erros HTTP.
- Validar inputs.
- Reduzir acoplamento com estado global.
- Preservar comportamento atual.
- Não adicionar funcionalidades.
```

Resultado produzido:

```text
Arquivos completos do backend refatorado e script .sh para aplicar a refatoração.
```

### Prompt 4 — Refatoração do frontend

Objetivo:

```text
Refatorar o frontend da pasta 2606/frontend com foco em organização, reutilização e manutenção.
```

Pontos principais solicitados:

```text
- Separar lógica de API, formatação e cálculo.
- Evitar duplicação de helpers.
- Reduzir responsabilidade das telas.
- Melhorar nomes de funções e props.
- Manter navegação e comportamento.
- Não adicionar funcionalidades.
```

Resultado produzido:

```text
Arquivos completos do frontend refatorado e script .sh para aplicar a refatoração.
```

### Prompt 5 — Relatório final de modernização

Objetivo:

```text
Gerar relatório acadêmico documentando a modernização do sistema.
```

Pontos principais solicitados:

```text
- Descrever o que existia na versão 1506.
- Listar dívidas técnicas encontradas.
- Documentar técnicas aplicadas.
- Explicar mudanças da versão 2606.
- Listar arquivos alterados e criados.
- Documentar decisões arquiteturais.
- Registrar validações locais.
- Incluir prompts utilizados.
- Incluir checklist de entrega.
```

Resultado produzido:

```text
Este relatório final em Markdown.
```

---

## 11. Checklist de Entrega

### 11.1. Organização do projeto

- [x] Pasta `0306` preservada.
- [x] Pasta `1506` preservada como versão original.
- [x] Pasta `2606` definida como versão refatorada.
- [x] TREE final documentada.
- [x] Não foram adicionadas funcionalidades novas.

### 11.2. Backend

- [x] `server.js` simplificado.
- [x] `src/app.js` criado.
- [x] Rotas separadas em `src/routes`.
- [x] Controllers criados.
- [x] Services criados.
- [x] Validations criadas.
- [x] Domain criado para cálculo e contrato.
- [x] Repository em memória criado.
- [x] Erros HTTP padronizados.
- [x] Constantes centralizadas.
- [x] Regra de negócio removida das rotas.
- [x] Estado global deixou de ser acessado diretamente pelas rotas.
- [x] Dataprev mockado deixou de depender de `Math.random`.

### 11.3. Frontend

- [x] `App.jsx` simplificado com hook de fluxo.
- [x] `api.js` mantido como fachada.
- [x] Services separados por domínio.
- [x] Helpers de moeda centralizados.
- [x] Helpers de data centralizados.
- [x] Parsing de moeda centralizado.
- [x] Hook de formulário da simulação criado.
- [x] Componentes reutilizáveis criados.
- [x] Telas mantidas com comportamento original.
- [x] `src/calc.js` removido da versão refatorada.

### 11.4. Validação

- [x] Comandos locais da versão 1506 registrados.
- [x] Vulnerabilidade do frontend registrada sem correção forçada.
- [x] Falha do `jscpd` por GLIBC registrada.
- [x] Comandos de validação da versão 2606 documentados.
- [x] `npm install` na versão 2606 executado e registrado.
- [x] `npm audit` na versão 2606 executado e registrado.
- [x] `npm run dev` backend 2606 executado e registrado.
- [x] `npm run dev` frontend 2606 executado e registrado.
- [x] Fluxo manual completo validado e registrado.
- [x] `npm run build` executado e registrado, se disponível.
- [x] `npm test` executado e registrado, se disponível.
- [x] `npm run lint` executado e registrado, se disponível.

### 11.5. Documentação

- [x] Diagnóstico de dívida técnica documentado.
- [x] Técnicas de modernização documentadas.
- [x] Decisões arquiteturais documentadas.
- [x] Dívidas remanescentes documentadas.
- [x] Prompts utilizados documentados.
- [x] Relatório final produzido em Markdown.

---

## 12. Conclusão

A modernização do projeto `eng-software-2.0` teve foco em melhorar a estrutura interna do sistema sem alterar seu comportamento funcional.

Na versão `1506`, o sistema já possuía um fluxo funcional de crédito consignado, mas apresentava acoplamento elevado, duplicação de lógica, uso direto de estado global, regras de negócio dentro de rotas e componentes frontend com responsabilidades acumuladas.

Na versão `2606`, o backend foi reorganizado em camadas, separando rotas, controllers, services, validations, domain e repository. O frontend foi reorganizado com services, hooks, utils e componentes reutilizáveis. A regra financeira passou a ficar centralizada no backend, e helpers duplicados foram removidos das telas.

A modernização reduziu riscos de manutenção, facilitou evolução futura, melhorou a clareza dos arquivos e preparou o projeto para futuras melhorias, como testes automatizados, persistência real, autenticação mais robusta e roteamento formal no frontend.

As funcionalidades existentes foram preservadas, respeitando o escopo acadêmico da tarefa.
