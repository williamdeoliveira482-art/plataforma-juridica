import { FormEvent, useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { Client } from "../../services/api/types";
import { Modal } from "../../components/ui/Modal";
import { Input, Label, Select, Textarea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function ProcessFormModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({ clientId: "", number: "", area: "", court: "", chamber: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) api.get<Client[]>("/clients").then((res) => setClients(res.data));
  }, [open]);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/processes", form);
      onSaved();
      onClose();
      setForm({ clientId: "", number: "", area: "", court: "", chamber: "", description: "" });
    } catch {
      setError("Não foi possível salvar o processo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo processo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Cliente</Label>
          <Select required value={form.clientId} onChange={(e) => update("clientId", e.target.value)}>
            <option value="">Selecione um cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Número do processo</Label>
          <Input required value={form.number} onChange={(e) => update("number", e.target.value)} />
        </div>
        <div>
          <Label>Área jurídica</Label>
          <Input required value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="Ex: Trabalhista, Cível, Tributário" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tribunal</Label>
            <Input value={form.court} onChange={(e) => update("court", e.target.value)} />
          </div>
          <div>
            <Label>Vara</Label>
            <Input value={form.chamber} onChange={(e) => update("chamber", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Descrição</Label>
          <Textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar processo"}</Button>
        </div>
      </form>
    </Modal>
  );
}
