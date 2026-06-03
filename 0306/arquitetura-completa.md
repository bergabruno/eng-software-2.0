```mermaid
flowchart TD

    A[Cliente autenticado no App do Banco]

    A --> B[Solicitar Oferta de Consignado]

    B --> C[Consulta de Benefício]
    C --> D[Gateway Dataprev]

    D -->|HTTP REST| E[Dataprev - Consulta Benefício]
    E --> D

    D --> F[Consulta de Margem]

    F -->|HTTP REST| G[Dataprev - Consulta Margem]
    G --> F

    F --> H{Possui Margem Disponível?}

    H -->|Não| I[Fim do Processo]

    H -->|Sim| J[Gerar Oferta]

    J --> K[Armazenar Oferta no Redis]
    J --> L[Persistir Oferta no MongoDB]

    J --> M[Publicar Evento OfertaGerada]

    M --> N[(Kafka)]

    N --> O[Auditoria]
    N --> P[Observabilidade]

    J --> Q[Cliente Seleciona Oferta]

    Q --> R[Simulação]

    R --> S[Calculadora Financeira]

    S --> T[Calcular CET]
    T --> U[Calcular Parcela]
    U --> V[Calcular Valor Liberado]

    V --> W[Persistir Simulação]

    W --> X[(MongoDB)]

    V --> Y[Publicar Evento SimulacaoRealizada]

    Y --> Z[(Kafka)]

    Z --> AA[Auditoria]
    Z --> AB[Observabilidade]

    V --> AC[Cliente Aceita Simulação]

    AC --> AD[Criar Proposta]

    AD --> AE[Persistir Proposta]

    AE --> AF[(MongoDB)]

    AD --> AG[Publicar Evento PropostaCriada]

    AG --> AH[(Kafka)]

    AH --> AI[Consumidor Contratação]

    AI --> AJ[Gerar CCB]

    AJ --> AK[Persistir Documento]

    AK --> AL[(MongoDB)]

    AJ --> AM[Publicar Evento CCBGerada]

    AM --> AN[(Kafka)]

    AN --> AO[Auditoria]
    AN --> AP[Observabilidade]

    AJ --> AQ[CCB Disponível para Assinatura]
```

### Legenda Arquitetural

**Chamadas síncronas (HTTP REST)**

* Consulta de Benefício → Dataprev
* Consulta de Margem → Dataprev

**Mensageria Kafka**

* OfertaGerada
* SimulacaoRealizada
* PropostaCriada
* CCBGerada

**Persistência MongoDB**

* Ofertas
* Simulações
* Propostas
* Documentos (CCB)

**Redis**

* Cache da oferta diária
* Controle de TPS da Dataprev
* Rate Limiting distribuído

**Componentes transversais**

* Gateway Dataprev

  * Controle de TPS (25 TPS)
  * Circuit Breaker
  * Retry
  * Timeout
  * Observabilidade
* OpenTelemetry + Dynatrace
* Auditoria baseada em eventos Kafka

Esse fluxo representa o que normalmente acontece até a geração da CCB. Em um segundo diagrama, eu separaria a fase de **Assinatura → Averbação → Liberação de Crédito → Contrato Ativo**, porque ela costuma ser avaliada como outro processo de negócio dentro do consignado.
