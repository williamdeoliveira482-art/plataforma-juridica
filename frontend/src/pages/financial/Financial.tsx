import { FormEvent, useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { Client, FinancialEntry } from "../../services/api/types";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input, Label, Select } from "../../components/ui/Input";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Plus } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  ATRASADO: "Atrasado",
  CANCELADO: "Cancelado",
};

const STATUS_TONE: Record<string, "warning" | "success" | "danger" | "neutral"> = {
  PENDENTE: "warning",
  PAGO: "success",
  ATRASADO: "danger",
  CANCELADO: "neutral",
};

interface Summary {
  totalReceivable: number;
  totalReceived: number;
  totalOverdue: number;
  upcoming: { id: string; description: string; amount: number; dueDate: string }[];
}

function money(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Financial() {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ clientId: "", description: "", amount: "", dueDate: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const [entriesRes, summaryRes] = await Promise.all([
      api.get<FinancialEntry[]>("/financial"),
      api.get<Summary>("/financial/summary"),
    ]);
    setEntries(entriesRes.data);
    setSummary(summaryRes.data);
  }

  useEffect(() => {
    load();
    api.get<Client[]>("/clients").then((res) => setClients(res.data));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/financial", {
        ...form,
        amount: parseFloat(form.amount),
        dueDate: new Date(form.dueDate).toISOString(),
      });
      await load();
      setModalOpen(false);
      setForm({ clientId: "", description: "", amount: "", dueDate: "" });
    } finally {
      setSaving(false);
    }
  }

  async function markAsPaid(id: string, amount: number) {
    await api.post(`/financial/${id}/pay`, { amount });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Financeiro</h1>
          <p className="text-sm text-gray-500">Honorários, parcelas e cobranças do escritório.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Novo lançamento</Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">A receber</p>
          <p className="mt-2 font-display text-2xl font-semibold text-navy">{summary ? money(summary.totalReceivable) : "—"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Recebido</p>
          <p className="mt-2 font-display text-2xl font-semibold text-navy">{summary ? money(summary.totalReceived) : "—"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Vencido</p>
          <p className="mt-2 font-display text-2xl font-semibold text-red-700">{summary ? money(summary.totalOverdue) : "—"}</p>
        </Card>
      </div>

      {entries.length === 0 ? (
        <EmptyState title="Nenhum lançamento financeiro" description="Cadastre honorários, parcelas e cobranças." />
      ) : (
        <Table>
          <THead>
            <TRow>
              <TH>Descrição</TH>
              <TH>Cliente</TH>
              <TH>Valor</TH>
              <TH>Vencimento</TH>
              <TH>Status</TH>
              <TH>Ações</TH>
            </TRow>
          </THead>
          <tbody>
            {entries.map((e) => (
              <TRow key={e.id}>
                <TD>{e.description}</TD>
                <TD>{e.client?.name}</TD>
                <TD>{money(Number(e.amount))}</TD>
                <TD>{new Date(e.dueDate).toLocaleDateString("pt-BR")}</TD>
                <TD><Badge tone={STATUS_TONE[e.status]}>{STATUS_LABEL[e.status]}</Badge></TD>
                <TD>
                  {e.status === "PENDENTE" || e.status === "ATRASADO" ? (
                    <button className="text-xs font-medium text-steel hover:underline" onClick={() => markAsPaid(e.id, Number(e.amount))}>
                      Marcar como pago
                    </button>
                  ) : (
                    "—"
                  )}
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo lançamento financeiro">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Select required value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}>
              <option value="">Selecione um cliente</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Descrição</Label>
            <Input required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Valor (R$)</Label>
              <Input required type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <Label>Vencimento</Label>
              <Input required type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar lançamento"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
