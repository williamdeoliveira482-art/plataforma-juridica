# Plataforma Jurídica Inteligente

Sistema web (SaaS) para gestão de escritórios de advocacia: clientes, processos, tarefas, agenda, documentos, atendimento, financeiro, área do cliente e um esqueleto de assistente de IA.

Este pacote entrega a **Fase 1 (Núcleo)** totalmente funcional, com dados persistidos em PostgreSQL — não é um protótipo visual. As fases seguintes (automação de atendimento multicanal, IA real, geração de documentos por template, integrações de pagamento) estão estruturadas no código e sinalizadas como "aguardando configuração" onde ainda não são reais.

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT + bcrypt
- **Containerização:** Docker + Docker Compose

## Como rodar localmente

### Pré-requisitos
- Docker e Docker Compose instalados
- Portas livres: `5432` (Postgres), `4000` (API), `5173` (frontend)

### Passo a passo

1. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Ajuste `JWT_SECRET` e `CLIENT_PORTAL_JWT_SECRET` para valores próprios antes de usar em produção.

2. Suba os containers:
   ```bash
   docker compose up --build
   ```
   Isso vai:
   - Subir o PostgreSQL
   - Construir e subir a API (porta 4000)
   - Construir e subir o frontend (porta 5173)

3. Em um segundo terminal, rode as migrations e o seed de dados de exemplo (primeira vez):
   ```bash
   docker compose exec backend npx prisma migrate dev --name init
   docker compose exec backend npm run seed
   ```

4. Acesse:
   - Painel do escritório: http://localhost:5173
   - Área do cliente: http://localhost:5173/portal/login
   - API: http://localhost:4000/api

### Credenciais de exemplo (criadas pelo seed)

| Perfil        | E-mail                              | Senha  |
|---------------|--------------------------------------|--------|
| Administrador | admin@plataformajuridica.local       | 123456 |
| Advogado      | advogado@plataformajuridica.local    | 123456 |
| Financeiro    | financeiro@plataformajuridica.local  | 123456 |
| Atendimento   | atendimento@plataformajuridica.local | 123456 |
| Área do cliente | joao.silva@example.com             | 123456 |

**Troque essas senhas antes de usar o sistema com dados reais.**

## Rodando sem Docker (desenvolvimento)

Backend:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Configure `DATABASE_URL` no `backend/.env` apontando para um Postgres local, e `VITE_API_URL` no `frontend/.env` (ou variável de ambiente) apontando para a API.

## Estrutura do projeto

```
plataforma-juridica/
├── ARQUITETURA.md      # Documento de arquitetura e modelagem (etapa 1 do projeto)
├── docker-compose.yml
├── .env.example
├── backend/            # API REST (Express + Prisma)
└── frontend/           # Painel web (React + Vite)
```

Veja `ARQUITETURA.md` para o detalhamento de entidades, relacionamentos e decisões de arquitetura.

## O que está funcional na Fase 1

- Autenticação JWT com 4 perfis (Administrador, Advogado, Financeiro, Assistente), proteção de rotas por perfil
- Dashboard com indicadores e gráficos reais (vindos do banco)
- Clientes PF/PJ: CRUD completo, busca, página individual com abas (resumo, processos, tarefas, documentos, financeiro, observações)
- Processos: CRUD, abas de detalhe, histórico de movimentações, visão Kanban por status
- Tarefas: CRUD, prioridade, Kanban, "minhas tarefas"
- Agenda: audiências, reuniões, prazos e compromissos
- Central de documentos: upload, download, categorias, vínculo a cliente/processo
- Atendimento: registro manual de contatos
- Financeiro: lançamentos, status, registro de pagamento, dashboard financeiro
- Área do cliente: login próprio, visão somente do que é autorizado (processos, documentos, financeiro)
- Assistente Jurídico Inteligente: tela e rota funcionais; sem `AI_API_KEY` configurada, o sistema informa claramente que o módulo está aguardando configuração — não simula respostas de IA

## O que está estruturado mas aguardando implementação/configuração

- Integrações automáticas de atendimento (WhatsApp, Telegram, e-mail, chat do site)
- Integração real de IA (OpenAI/Anthropic/outra) — configurar `AI_API_KEY` no `.env` e implementar a chamada em `backend/src/services/ai.service.ts`
- Geração de documentos por template com variáveis (`{{cliente_nome}}` etc.) e exportação PDF/DOCX
- Assinatura eletrônica, PIX, boleto e gateways de pagamento
- Relatórios detalhados (a tela existe e indica claramente que está aguardando a próxima fase)
- Permissões granulares configuráveis (hoje os 4 perfis têm acesso fixo por módulo)
- Recuperação de senha (tela indica que está em preparação)

## Segurança

- Senhas armazenadas com bcrypt (nunca em texto puro)
- JWT com segredo via variável de ambiente
- Nenhuma chave de API fica exposta no frontend
- Todas as rotas privadas exigem autenticação; algumas exigem perfil específico (ex.: financeiro só ADMIN/FINANCE)
