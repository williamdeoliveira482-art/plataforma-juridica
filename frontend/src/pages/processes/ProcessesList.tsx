import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api/client";
import { Process } from "../../services/api/types";
import { Button } from "../../components/ui/Button";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProcessFormModal } from "./ProcessFormModal";
import { PROCESS_STATUS_LABELS, PROCESS_STATUS_ORDER } from "./processStatus";
import { Plus, LayoutList, Columns3 } from "lucide-react";

export default function ProcessesList() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [view, setView] = useState<"list" | "kanban">("kanban");
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    const res = await api.get<Process[]>("/processes");
    setProcesses(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function moveStatus(id: string, status: string) {
    await api.put(`/processes/${id}`, { status });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Processos</h1>
          <p className="text-sm text-gray-500">Acompanhamento de processos e demandas jurídicas.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-sm border border-border bg-white">
            <button
              className={`p-2 ${view === "list" ? "bg-surface text-navy" : "text-gray-400"}`}
              onClick={() => setView("list")}
            >
              <LayoutList size={16} />
            </button>
            <button
              className={`p-2 ${view === "kanban" ? "bg-surface text-navy" : "text-gray-400"}`}
              onClick={() => setView("kanban")}
            >
              <Columns3 size={16} />
            </button>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Novo processo
          </Button>
        </div>
      </div>

      {processes.length === 0 ? (
        <EmptyState title="Nenhum processo cadastrado" description="Cadastre o primeiro processo do escritório." />
      ) : view === "list" ? (
        <Table>
          <THead>
            <TRow>
              <TH>Número</TH>
              <TH>Cliente</TH>
              <TH>Área</TH>
              <TH>Status</TH>
              <TH>Responsável</TH>
            </TRow>
          </THead>
          <tbody>
            {processes.map((p) => (
              <TRow key={p.id} className="hover:bg-surface">
                <TD>
                  <Link to={`/processos/${p.id}`} className="font-medium text-steel hover:underline">
                    {p.number}
                  </Link>
                </TD>
                <TD>{p.client?.name}</TD>
                <TD>{p.area}</TD>
                <TD><Badge tone="info">{PROCESS_STATUS_LABELS[p.status]}</Badge></TD>
                <TD>{p.responsibleUser?.name || "—"}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {PROCESS_STATUS_ORDER.map((status) => (
            <div key={status} className="w-64 flex-shrink-0 rounded bg-white border border-border">
              <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {PROCESS_STATUS_LABELS[status]} ({processes.filter((p) => p.status === status).length})
              </div>
              <div className="space-y-2 p-2">
                {processes
                  .filter((p) => p.status === status)
                  .map((p) => (
                    <div key={p.id} className="rounded-sm border border-border p-3 text-sm">
                      <Link to={`/processos/${p.id}`} className="font-medium text-steel hover:underline">
                        {p.number}
                      </Link>
                      <p className="text-xs text-gray-500">{p.client?.name}</p>
                      <p className="mt-1 text-xs text-gray-400">{p.area}</p>
                      <select
                        className="focus-ring mt-2 w-full rounded-sm border border-border bg-surface px-2 py-1 text-xs"
                        value={p.status}
                        onChange={(e) => moveStatus(p.id, e.target.value)}
                      >
                        {PROCESS_STATUS_ORDER.map((s) => (
                          <option key={s} value={s}>{PROCESS_STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ProcessFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={load} />
    </div>
  );
}
