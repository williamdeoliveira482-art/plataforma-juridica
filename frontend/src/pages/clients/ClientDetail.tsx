import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

interface ClientFull {
  id: string;
  name: string;
  type: "PF" | "PJ";
  document: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  status: string;
  processes: { id: string; number: string; area: string; status: string }[];
  tasks: { id: string; title: string; status: string }[];
  documents: { id: string; name: string }[];
  financialEntries: { id: string; description: string; amount: number; status: string }[];
}

const tabs = ["Resumo", "Processos", "Tarefas", "Documentos", "Financeiro", "Observações"] as const;

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState<ClientFull | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Resumo");

  useEffect(() => {
    api.get(`/clients/${id}`).then((res) => setClient(res.data));
  }, [id]);

  if (!client) return <p className="text-sm text-gray-500">Carregando...</p>;

  return (
    <div>
      <div className="mb-1 flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy">{client.name}</h1>
        <Badge tone={client.status === "ACTIVE" ? "success" : "neutral"}>
          {client.status === "ACTIVE" ? "Ativo" : "Inativo"}
        </Badge>
      </div>
      <p className="mb-6 text-sm text-gray-500">
        {client.type === "PF" ? "Pessoa Física" : "Pessoa Jurídica"} · {client.document}
      </p>

      <div className="mb-5 flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`focus-ring border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t ? "border-steel text-navy" : "border-transparent text-gray-500 hover:text-navy"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Resumo" && (
        <Card>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Telefone</p>
              <p>{client.phone || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">E-mail</p>
              <p>{client.email || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Endereço</p>
              <p>{client.address || "—"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "Processos" && (
        <Card>
          <CardHeader><CardTitle>Processos vinculados</CardTitle></CardHeader>
          <CardContent>
            {client.processes.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum processo vinculado.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {client.processes.map((p) => (
                  <li key={p.id} className="py-2">
                    <span className="font-medium">{p.number}</span> — {p.area} · {p.status}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "Tarefas" && (
        <Card>
          <CardHeader><CardTitle>Tarefas relacionadas</CardTitle></CardHeader>
          <CardContent>
            {client.tasks.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma tarefa relacionada.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {client.tasks.map((t) => (
                  <li key={t.id} className="py-2">{t.title} — {t.status}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "Documentos" && (
        <Card>
          <CardHeader><CardTitle>Documentos</CardTitle></CardHeader>
          <CardContent>
            {client.documents.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum documento vinculado.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {client.documents.map((d) => (
                  <li key={d.id} className="py-2">{d.name}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "Financeiro" && (
        <Card>
          <CardHeader><CardTitle>Cobranças e pagamentos</CardTitle></CardHeader>
          <CardContent>
            {client.financialEntries.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum lançamento financeiro.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {client.financialEntries.map((f) => (
                  <li key={f.id} className="flex justify-between py-2">
                    <span>{f.description}</span>
                    <span>R$ {Number(f.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} · {f.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "Observações" && (
        <Card>
          <CardHeader><CardTitle>Observações internas</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{client.notes || "Nenhuma observação registrada."}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
