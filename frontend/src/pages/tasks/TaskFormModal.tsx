import { FormEvent, useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { Client, Process } from "../../services/api/types";
import { Modal } from "../../components/ui/Modal";
import { Input, Label, Select, Textarea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function TaskFormModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    clientId: "",
    processId: "",
    priority: "MEDIA",
    dueDate: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      api.get<Client[]>("/clients").then((res) => setClients(res.data));
      api.get<Process[]>("/processes").then((res) => setProcesses(res.data));
    }
  }, [open]);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/tasks", {
        ...form,
        clientId: form.clientId || undefined,
        processId: form.processId || undefined,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      });
      onSaved();
      onClose();
      setForm({ title: "", description: "", clientId: "", processId: "", priority: "MEDIA", dueDate: "" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova tarefa">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Título</Label>
          <Input required value={form.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div>
          <Label>Descrição</Label>
          <Textarea rows={2} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Cliente (opcional)</Label>
            <Select value={form.clientId} onChange={(e) => update("clientId", e.target.value)}>
              <option value="">—</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Processo (opcional)</Label>
            <Select value={form.processId} onChange={(e) => update("processId", e.target.value)}>
              <option value="">—</option>
              {processes.map((p) => <option key={p.id} value={p.id}>{p.number}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Prioridade</Label>
            <Select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
              <option value="URGENTE">Urgente</option>
            </Select>
          </div>
          <div>
            <Label>Prazo</Label>
            <Input type="date" value={form.dueDate} onChange={(e) => update("dueDate", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar tarefa"}</Button>
        </div>
      </form>
    </Modal>
  );
}
