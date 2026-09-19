export type Role = "ADMIN" | "LAWYER" | "FINANCE" | "ASSISTANT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  officeId: string;
  active?: boolean;
}

export interface Client {
  id: string;
  type: "PF" | "PJ";
  name: string;
  document: string;
  rg?: string;
  birthDate?: string;
  responsible?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  notes?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export type ProcessStatus =
  | "NOVO_CASO"
  | "EM_ANALISE"
  | "AGUARDANDO_DOCUMENTACAO"
  | "EM_ANDAMENTO"
  | "AGUARDANDO_CLIENTE"
  | "CONCLUIDO"
  | "ARQUIVADO";

export interface Process {
  id: string;
  clientId: string;
  client?: Client;
  number: string;
  area: string;
  court?: string;
  chamber?: string;
  responsibleUserId?: string;
  responsibleUser?: User;
  status: ProcessStatus;
  openedAt: string;
  description?: string;
  notes?: string;
}

export type TaskPriority = "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";
export type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";

export interface Task {
  id: string;
  title: string;
  description?: string;
  responsibleUserId?: string;
  responsibleUser?: User;
  clientId?: string;
  client?: Client;
  processId?: string;
  process?: Process;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
}

export interface EventItem {
  id: string;
  type: "AUDIENCIA" | "REUNIAO" | "PRAZO" | "COMPROMISSO";
  title: string;
  date: string;
  clientId?: string;
  processId?: string;
  description?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  categoryId?: string;
  category?: { id: string; name: string };
  clientId?: string;
  client?: Client;
  processId?: string;
  createdAt: string;
}

export type FinancialStatus = "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO";

export interface FinancialEntry {
  id: string;
  clientId: string;
  client?: Client;
  processId?: string;
  description: string;
  amount: number;
  dueDate: string;
  status: FinancialStatus;
}
