# Plataforma Jurídica Inteligente — Arquitetura (Etapa 1)

## 1. Escopo e recorte do MVP (Fase 1 — Núcleo)

O sistema completo tem 12 módulos. Construir tudo (incluindo IA, atendimento multicanal, geração de documentos com templates, financeiro com gateways, área do cliente completa) de uma vez, com qualidade profissional e dados reais no Postgres, exige múltiplas etapas de entrega — não um único "dump" de código.

Seguindo sua própria priorização, a Fase 1 (MVP funcional) cobre:

- Autenticação (JWT, senha criptografada, proteção de rotas, 4 perfis)
- Usuários e permissões (papéis fixos no MVP; tabela de permissões granulares preparada para configuração futura)
- Dashboard (indicadores reais vindos do banco)
- Clientes (PF/PJ, CRUD completo, página individual com abas)
- Processos (CRUD, abas, Kanban por status)
- Tarefas (CRUD, prioridade, status, Kanban, "minhas tarefas")
- Agenda (eventos, visão dia/semana/mês)
- Documentos (upload/download local, categorias, vínculo a cliente/processo)
- Financeiro básico (lançamentos, status, dashboard financeiro simples)
- Área do cliente (login próprio, visão somente do que é autorizado)

Ficam **estruturados mas não implementados** nesta fase (interface/rota existe, com aviso explícito de "aguardando configuração"):
- Atendimento multicanal (WhatsApp/Telegram/e-mail) — só o módulo interno de registro manual entra na Fase 1
- Assistente de IA — tela e rota prontas, chamando um serviço mockável, sem chave de API real
- Geração de documentos por template — modelo de dados pronto, motor de substituição de variáveis fica para Fase 2/3
- PIX/boleto/assinatura eletrônica — apenas os campos e o status "não configurado"

## 2. Arquitetura geral

```
┌─────────────────┐        HTTPS/JSON        ┌──────────────────┐
│   Frontend       │ ───────────────────────▶ │   Backend API     │
│ React+Vite+TS    │ ◀─────────────────────── │ Node+Express+TS   │
│ Tailwind         │                          │ (REST)            │
└─────────────────┘                          └────────┬─────────┘
                                                        │ Prisma ORM
                                                        ▼
                                              ┌──────────────────┐
                                              │   PostgreSQL      │
                                              └──────────────────┘
                                                        │
                                              ┌──────────────────┐
                                              │ Armazenamento     │
                                              │ local /storage    │
                                              │ (preparado p/ S3) │
                                              └──────────────────┘
```

**Decisões de stack (dentro do que você sugeriu):**
- ORM: **Prisma** (migrations tipadas, melhor DX em TS, schema único legível) em vez de Sequelize.
- Autenticação: JWT em cookie httpOnly (access token curto) + refresh token, senhas com bcrypt.
- Backend em camadas: `routes → controllers → services → repositories (Prisma) `, com `middlewares` (auth, permissões, erros) e `validators` (zod).
- Frontend: React Router, TanStack Query para chamadas à API, Context/hook de auth, Tailwind com tema customizado (paleta grafite/azul-marinho/dourado).
- Multi-tenant: **não** solicitado explicitamente aqui (diferente do seu projeto `saas-erp-vision`) — modelado como um único escritório por instância nesta fase, mas com `officeId` já presente nas tabelas principais para permitir evoluir para multi-escritório sem migração destrutiva.

## 3. Estrutura de pastas

```
plataforma-juridica/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── config/
│       │   └── env.ts
│       ├── middlewares/
│       │   ├── auth.middleware.ts
│       │   ├── permission.middleware.ts
│       │   └── error.middleware.ts
│       ├── validators/
│       │   └── *.schema.ts
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── users.routes.ts
│       │   ├── clients.routes.ts
│       │   ├── processes.routes.ts
│       │   ├── tasks.routes.ts
│       │   ├── events.routes.ts
│       │   ├── documents.routes.ts
│       │   ├── financial.routes.ts
│       │   ├── dashboard.routes.ts
│       │   ├── client-portal.routes.ts
│       │   └── ai.routes.ts
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       └── utils/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── Dockerfile
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── theme/
        ├── layouts/
        │   └── SidebarLayout.tsx
        ├── routes/
        ├── pages/
        │   ├── auth/
        │   ├── dashboard/
        │   ├── clients/
        │   ├── processes/
        │   ├── tasks/
        │   ├── agenda/
        │   ├── documents/
        │   ├── financial/
        │   ├── ai/
        │   ├── client-portal/
        │   └── settings/
        ├── components/
        ├── hooks/
        ├── services/api/
        └── context/AuthContext.tsx
```

## 4. Modelo de dados (entidades e relacionamentos — Fase 1 + esqueleto das demais)

- **Office** 1—N **User**
- **User** N—1 **Role** (`ADMIN`, `LAWYER`, `FINANCE`, `ASSISTANT`)
- **User** 1—N **Task** (responsável) · **User** 1—N **Process** (advogado responsável)
- **Client** (PF/PJ via campo `type`) 1—N **Process**, 1—N **Document**, 1—N **Task**, 1—N **Event**, 1—N **FinancialEntry**, 1—N **Interaction**, 1—1 **ClientPortalAccess**
- **Process** 1—N **Task**, 1—N **Event**, 1—N **Document**, 1—N **ProcessHistory**
- **Task** N—1 **Client** (opcional) · N—1 **Process** (opcional) · N—1 **User** (responsável)
- **Event** (audiência/reunião/prazo/compromisso) N—1 **Client**, N—1 **Process**, N—1 **User**
- **Document** N—1 **Client**, N—1 **Process**, N—1 **User** (quem enviou), N—1 **DocumentCategory**
- **FinancialEntry** N—1 **Client**, N—1 **Process** (opcional), 1—N **Payment**
- **Attendance/Interaction** N—1 **Client**, N—1 **User** (responsável)
- **AIInteraction** N—1 **User**, N—1 **Client** (opcional), N—1 **Process** (opcional) — guarda prompt/resposta/status "rascunho"
- **Notification** N—1 **User** (esqueleto, sem envio real na Fase 1)

Campos principais por entidade (resumo — o `schema.prisma` real terá o detalhamento completo):

| Entidade | Campos-chave |
|---|---|
| Office | id, name, document (CNPJ), createdAt |
| User | id, officeId, name, email, passwordHash, role, active |
| Client | id, officeId, type(PF/PJ), name, document(CPF/CNPJ), phone, whatsapp, email, address(json), status, notes |
| Process | id, officeId, clientId, number, area, court, chamber, responsibleUserId, status, openedAt, description |
| Task | id, officeId, title, description, responsibleUserId, clientId?, processId?, priority, status, dueDate |
| Event | id, officeId, type, title, date, time, responsibleUserId, clientId?, processId?, description |
| Document | id, officeId, name, categoryId, clientId?, processId?, uploadedByUserId, filePath, createdAt |
| FinancialEntry | id, officeId, clientId, processId?, description, amount, dueDate, status |
| Payment | id, financialEntryId, amount, paidAt, method |
| Interaction | id, officeId, clientId, channel, reason, responsibleUserId, status |
| ClientPortalAccess | id, clientId, email, passwordHash, active |
| AIInteraction | id, officeId, userId, clientId?, processId?, prompt, response, kind, reviewedByHuman(bool) |

## 5. API (Fase 1)

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET/POST/PUT/DELETE  /api/users
GET/POST/PUT/DELETE  /api/clients
GET/POST/PUT/DELETE  /api/processes
GET/POST/PUT/DELETE  /api/tasks
GET/POST/PUT/DELETE  /api/events
GET/POST/DELETE      /api/documents
GET/POST/PUT/DELETE  /api/financial

GET    /api/dashboard/summary
GET    /api/dashboard/charts

POST   /api/client-portal/login
GET    /api/client-portal/me/*

GET/POST /api/ai/assist   (esqueleto — retorna erro claro "IA não configurada" se não houver API key)
```

Todas as rotas privadas exigem `Authorization: Bearer <token>` e passam por middleware de permissão por `role`.

## 6. Próximo passo

Com essa base aprovada, o próximo passo é gerar de verdade:
1. `docker-compose.yml` + `.env.example`
2. `prisma/schema.prisma` completo + seed de dados
3. Backend Fase 1 (auth, clients, processes, tasks, events, documents, financial, dashboard)
4. Frontend Fase 1 (login, sidebar, dashboard com gráficos reais, CRUDs, Kanban de processos/tarefas, agenda, documentos, financeiro, área do cliente básica)
5. README com instruções de `docker compose up`

Isso resulta em bastante código (dezenas de arquivos). Posso gerar tudo de uma vez em um pacote para download, ou entregar por partes (ex: backend primeiro, você testa subindo o Docker, depois frontend) — como preferir.
