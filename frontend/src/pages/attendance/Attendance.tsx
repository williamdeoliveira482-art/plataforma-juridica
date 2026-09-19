import { FormEvent, useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input, Label, Select } from "../../components/ui/Input";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Plus } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  NOVO: "Novo",
  EM_ATENDIMENTO: "Em atendimento",
  AGUARDANDO_CLIENTE: "Aguardando cliente",
  ENCAMINHADO: "Encaminhado",
  FINALIZADO: "Finalizado",
};

interface Interaction {
  id: string;
  contactName: string;
  phone?: string;
  channel: string;
  reason: string;
  status: string;
}

export default function Attendance() {
  const [items, setItems] = useState<Interaction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ contactName: "", phone: "", channel: "Telefone", reason: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await api.get<Interaction[]>("/attendance");
    setItems(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/attendance", form);
      await load();
      setModalOpen(false);
      setForm({ contactName: "", phone: "", channel: "Telefone", reason: "" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Atendimento</h1>
          <p className="text-sm text-gray-500">Registro manual de contatos recebidos pelo escritório.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Novo atendimento</Button>
      </div>

      <Card className="mb-6 border-blue-100 bg-blue-50">
        <CardContent className="text-sm text-blue-900">
          A integração automática com WhatsApp, Telegram, e-mail e chat do site está estruturada, mas aguardando
          configuração. Por enquanto, os atendimentos são registrados manualmente abaixo.
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="Nenhum atendimento registrado" description="Registre o primeiro contato recebido pelo escritório." />
      ) : (
        <Table>
          <THead>
            <TRow>
              <TH>Contato</TH>
              <TH>Canal</TH>
              <TH>Motivo</TH>
              <TH>Status</TH>
            </TRow>
          </THead>
          <tbody>
            {items.map((i) => (
              <TRow key={i.id}>
                <TD>{i.contactName}{i.phone ? ` · ${i.phone}` : ""}</TD>
                <TD>{i.channel}</TD>
                <TD>{i.reason}</TD>
                <TD><Badge tone="info">{STATUS_LABEL[i.status] ?? i.status}</Badge></TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo atendimento">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome do contato</Label>
            <Input required value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <Label>Canal</Label>
            <Select value={form.channel} onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))}>
              <option>Telefone</option>
              <option>Presencial</option>
              <option>E-mail</option>
              <option>WhatsApp</option>
              <option>Site</option>
            </Select>
          </div>
          <div>
            <Label>Motivo do contato</Label>
            <Input required value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Registrar"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
