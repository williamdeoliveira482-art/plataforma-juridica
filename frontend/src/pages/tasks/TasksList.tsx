import { useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { Task, TaskStatus } from "../../services/api/types";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskFormModal } from "./TaskFormModal";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const STATUS_COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "PENDENTE", label: "Pendente" },
  { key: "EM_ANDAMENTO", label: "Em andamento" },
  { key: "CONCLUIDA", label: "Concluída" },
  { key: "CANCELADA", label: "Cancelada" },
];

const PRIORITY_TONE: Record<string, "neutral" | "info" | "warning" | "danger"> = {
  BAIXA: "neutral",
  MEDIA: "info",
  ALTA: "warning",
  URGENTE: "danger",
};

const PRIORITY_LABEL: Record<string, string> = { BAIXA: "Baixa", MEDIA: "Média", ALTA: "Alta", URGENTE: "Urgente" };

export default function TasksList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [onlyMine, setOnlyMine] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    const res = await api.get<Task[]>("/tasks", { params: onlyMine ? { mine: "true" } : {} });
    setTasks(res.data);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyMine]);

  async function moveStatus(id: string, status: string) {
    await api.put(`/tasks/${id}`, { status });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Tarefas</h1>
          <p className="text-sm text-gray-500">Acompanhamento de tarefas do escritório.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />
            Minhas tarefas
          </label>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Nova tarefa
          </Button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="Nenhuma tarefa encontrada" description="Crie uma tarefa para começar a organizar o trabalho." />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STATUS_COLUMNS.map((col) => (
            <div key={col.key} className="w-64 flex-shrink-0 rounded bg-white border border-border">
              <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {col.label} ({tasks.filter((t) => t.status === col.key).length})
              </div>
              <div className="space-y-2 p-2">
                {tasks
                  .filter((t) => t.status === col.key)
                  .map((t) => (
                    <div key={t.id} className="rounded-sm border border-border p-3 text-sm">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="font-medium text-graphite">{t.title}</p>
                        <Badge tone={PRIORITY_TONE[t.priority]}>{PRIORITY_LABEL[t.priority]}</Badge>
                      </div>
                      {t.client && <p className="text-xs text-gray-500">{t.client.name}</p>}
                      {t.dueDate && (
                        <p className="mt-1 text-xs text-gray-400">
                          Prazo: {new Date(t.dueDate).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                      <select
                        className="focus-ring mt-2 w-full rounded-sm border border-border bg-surface px-2 py-1 text-xs"
                        value={t.status}
                        onChange={(e) => moveStatus(t.id, e.target.value)}
                      >
                        {STATUS_COLUMNS.map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={load} />
    </div>
  );
}
