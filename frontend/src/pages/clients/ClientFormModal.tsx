import { FormEvent, useState } from "react";
import { api } from "../../services/api/client";
import { Modal } from "../../components/ui/Modal";
import { Input, Label, Select, Textarea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function ClientFormModal({ open, onClose, onSaved }: Props) {
  const [type, setType] = useState<"PF" | "PJ">("PF");
  const [form, setForm] = useState({
    name: "",
    document: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    responsible: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/clients", { type, ...form });
      onSaved();
      onClose();
      setForm({ name: "", document: "", phone: "", whatsapp: "", email: "", address: "", responsible: "", notes: "" });
    } catch {
      setError("Não foi possível salvar o cliente. Verifique os dados informados.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo cliente">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Tipo de cliente</Label>
          <Select value={type} onChange={(e) => setType(e.target.value as "PF" | "PJ")}>
            <option value="PF">Pessoa Física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </Select>
        </div>
        <div>
          <Label>{type === "PF" ? "Nome completo" : "Razão social"}</Label>
          <Input required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <Label>{type === "PF" ? "CPF" : "CNPJ"}</Label>
          <Input required value={form.document} onChange={(e) => update("document", e.target.value)} />
        </div>
        {type === "PJ" && (
          <div>
            <Label>Responsável</Label>
            <Input value={form.responsible} onChange={(e) => update("responsible", e.target.value)} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>E-mail</Label>
          <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <Label>Endereço</Label>
          <Input value={form.address} onChange={(e) => update("address", e.target.value)} />
        </div>
        <div>
          <Label>Observações</Label>
          <Textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar cliente"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
