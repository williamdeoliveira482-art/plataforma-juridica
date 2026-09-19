import { FormEvent, useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { EventItem } from "../../services/api/types";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input, Label, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Plus } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  AUDIENCIA: "Audiência",
  REUNIAO: "Reunião",
  PRAZO: "Prazo",
  COMPROMISSO: "Compromisso",
};

const TYPE_TONE: Record<string, "danger" | "info" | "warning" | "neutral"> = {
  AUDIENCIA: "danger",
  REUNIAO: "info",
  PRAZO: "warning",
  COMPROMISSO: "neutral",
};

export default function Agenda() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: "REUNIAO", title: "", date: "", description: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await api.get<EventItem[]>("/events");
    setEvents(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/events", { ...form, date: new Date(form.date).toISOString() });
      await load();
      setModalOpen(false);
      setForm({ type: "REUNIAO", title: "", date: "", description: "" });
    } finally {
      setSaving(false);
    }
  }

  const grouped = events.reduce<Record<string, EventItem[]>>((acc, ev) => {
    const day = new Date(ev.date).toLocaleDateString("pt-BR");
    acc[day] = acc[day] ?? [];
    acc[day].push(ev);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Agenda</h1>
          <p className="text-sm text-gray-500">Audiências, reuniões, prazos e compromissos.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Novo evento</Button>
      </div>

      {events.length === 0 ? (
        <EmptyState title="Nenhum evento agendado" description="Cadastre audiências, reuniões e prazos." />
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([day, items]) => (
            <Card key={day}>
              <CardContent>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{day}</p>
                <ul className="divide-y divide-border">
                  {items.map((ev) => (
                    <li key={ev.id} className="flex items-center justify-between py-2 text-sm">
                      <div>
                        <p className="font-medium text-graphite">{ev.title}</p>
                        {ev.description && <p className="text-xs text-gray-500">{ev.description}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {new Date(ev.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <Badge tone={TYPE_TONE[ev.type]}>{TYPE_LABEL[ev.type]}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo evento">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tipo</Label>
            <Select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="AUDIENCIA">Audiência</option>
              <option value="REUNIAO">Reunião</option>
              <option value="PRAZO">Prazo</option>
              <option value="COMPROMISSO">Compromisso</option>
            </Select>
          </div>
          <div>
            <Label>Título</Label>
            <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <Label>Data e horário</Label>
            <Input type="datetime-local" required value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar evento"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
