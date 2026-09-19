import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { PROCESS_STATUS_LABELS } from "./processStatus";

interface ProcessFull {
  id: string;
  number: string;
  area: string;
  court?: string;
  chamber?: string;
  status: string;
  description?: string;
  notes?: string;
  client: { name: string };
  tasks: { id: string; title: string; status: string }[];
  events: { id: string; title: string; type: string; date: string }[];
  documents: { id: string; name: string }[];
  history: { id: string; note: string; createdAt: string }[];
}

const tabs = ["Informações", "Tarefas", "Prazos e Audiências", "Documentos", "Histórico", "Observações"] as const;

export default function ProcessDetail() {
  const { id } = useParams();
  const [process, setProcess] = useState<ProcessFull | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Informações");

  useEffect(() => {
    api.get(`/processes/${id}`).then((res) => setProcess(res.data));
  }, [id]);

  if (!process) return <p className="text-sm text-gray-500">Carregando...</p>;

  return (
    <div>
      <div className="mb-1 flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy">{process.number}</h1>
        <Badge tone="info">{PROCESS_STATUS_LABELS[process.status]}</Badge>
      </div>
      <p className="mb-6 text-sm text-gray-500">{process.client.name} · {process.area}</p>

      <div className="mb-5 flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`focus-ring whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t ? "border-steel text-navy" : "border-transparent text-gray-500 hover:text-navy"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Informações" && (
        <Card>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Tribunal</p><p>{process.court || "—"}</p></div>
            <div><p className="text-gray-500">Vara</p><p>{process.chamber || "—"}</p></div>
            <div className="col-span-2"><p className="text-gray-500">Descrição</p><p>{process.description || "—"}</p></div>
          </CardContent>
        </Card>
      )}

      {tab === "Tarefas" && (
        <Card>
          <CardHeader><CardTitle>Tarefas vinculadas</CardTitle></CardHeader>
          <CardContent>
            {process.tasks.length === 0 ? <p className="text-sm text-gray-500">Nenhuma tarefa vinculada.</p> : (
              <ul className="divide-y divide-border text-sm">
                {process.tasks.map((t) => <li key={t.id} className="py-2">{t.title} — {t.status}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "Prazos e Audiências" && (
        <Card>
          <CardHeader><CardTitle>Eventos vinculados</CardTitle></CardHeader>
          <CardContent>
            {process.events.length === 0 ? <p className="text-sm text-gray-500">Nenhum evento vinculado.</p> : (
              <ul className="divide-y divide-border text-sm">
                {process.events.map((e) => (
                  <li key={e.id} className="py-2">{e.title} — {new Date(e.date).toLocaleString("pt-BR")}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "Documentos" && (
        <Card>
          <CardHeader><CardTitle>Documentos vinculados</CardTitle></CardHeader>
          <CardContent>
            {process.documents.length === 0 ? <p className="text-sm text-gray-500">Nenhum documento vinculado.</p> : (
              <ul className="divide-y divide-border text-sm">
                {process.documents.map((d) => <li key={d.id} className="py-2">{d.name}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "Histórico" && (
        <Card>
          <CardHeader><CardTitle>Histórico de movimentações</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {process.history.map((h) => (
                <li key={h.id} className="border-l-2 border-border pl-3">
                  <p>{h.note}</p>
                  <p className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString("pt-BR")}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {tab === "Observações" && (
        <Card>
          <CardHeader><CardTitle>Notas internas</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-600">{process.notes || "Nenhuma observação registrada."}</p></CardContent>
        </Card>
      )}
    </div>
  );
}
