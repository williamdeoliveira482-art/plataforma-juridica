import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientPortalApi } from "../../services/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { LogOut, Scale } from "lucide-react";
import { PROCESS_STATUS_LABELS } from "../processes/processStatus";

interface PortalData {
  name: string;
  processes: { id: string; number: string; area: string; status: string }[];
  documents: { id: string; name: string; category?: { name: string } }[];
  financialEntries: { id: string; description: string; amount: number; status: string; dueDate: string }[];
  tasks: { id: string; title: string; status: string }[];
}

export default function ClientPortalDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<PortalData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("pj_client_token");
    if (!token) {
      navigate("/portal/login");
      return;
    }
    clientPortalApi
      .get<PortalData>("/client-portal/me")
      .then((res) => setData(res.data))
      .catch(() => navigate("/portal/login"));
  }, [navigate]);

  function logout() {
    localStorage.removeItem("pj_client_token");
    navigate("/portal/login");
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b border-border bg-white px-8 py-4">
        <div className="flex items-center gap-2">
          <Scale className="text-gold" size={20} />
          <div>
            <p className="font-display text-sm font-semibold text-navy">Área do Cliente</p>
            <p className="text-xs text-gray-500">{data.name}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy">
          <LogOut size={15} /> Sair
        </button>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-8 py-8">
        <Card>
          <CardHeader><CardTitle>Seus processos</CardTitle></CardHeader>
          <CardContent>
            {data.processes.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum processo disponível.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {data.processes.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2">
                    <span>{p.number} — {p.area}</span>
                    <Badge tone="info">{PROCESS_STATUS_LABELS[p.status] ?? p.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pendências e cobranças</CardTitle></CardHeader>
          <CardContent>
            {data.financialEntries.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma cobrança registrada.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {data.financialEntries.map((f) => (
                  <li key={f.id} className="flex items-center justify-between py-2">
                    <span>{f.description}</span>
                    <span>
                      R$ {Number(f.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ·{" "}
                      {new Date(f.dueDate).toLocaleDateString("pt-BR")} · {f.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Documentos disponíveis</CardTitle></CardHeader>
          <CardContent>
            {data.documents.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum documento disponível ainda.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {data.documents.map((d) => (
                  <li key={d.id} className="py-2">{d.name} <span className="text-xs text-gray-400">({d.category?.name ?? "Outros"})</span></li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
