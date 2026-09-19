import { useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Scale, ListChecks, Wallet } from "lucide-react";

interface Summary {
  activeClients: number;
  newClientsThisMonth: number;
  processesInProgress: number;
  processesConcluded: number;
  upcomingDeadlines: number;
  upcomingHearings: number;
  pendingTasks: number;
  priorityTasks: number;
  receivable: number;
  overdueCount: number;
}

interface Charts {
  processesByStatus: { status: string; count: number }[];
  processesByArea: { area: string; count: number }[];
  clientsByMonth: { month: string; count: number }[];
}

const COLORS = ["#0F1B2D", "#2E5077", "#B08D57", "#8DA9C4", "#C9CDD3", "#5B7A99"];

function StatCard({ label, value, icon: Icon, hint }: { label: string; value: string | number; icon: any; hint?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-navy">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
        <div className="rounded-sm bg-surface p-2 text-steel">
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);

  useEffect(() => {
    api.get("/dashboard/summary").then((res) => setSummary(res.data));
    api.get("/dashboard/charts").then((res) => setCharts(res.data));
  }, []);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-navy">Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">Visão geral da operação do escritório.</p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Clientes ativos"
          value={summary?.activeClients ?? "—"}
          icon={Users}
          hint={summary ? `${summary.newClientsThisMonth} novos este mês` : undefined}
        />
        <StatCard
          label="Processos em andamento"
          value={summary?.processesInProgress ?? "—"}
          icon={Scale}
          hint={summary ? `${summary.processesConcluded} concluídos` : undefined}
        />
        <StatCard
          label="Tarefas pendentes"
          value={summary?.pendingTasks ?? "—"}
          icon={ListChecks}
          hint={summary ? `${summary.priorityTasks} de alta prioridade` : undefined}
        />
        <StatCard
          label="A receber"
          value={summary ? `R$ ${summary.receivable.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
          icon={Wallet}
          hint={summary ? `${summary.overdueCount} cobranças vencidas` : undefined}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Processos por status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts?.processesByStatus ?? []}>
                <XAxis dataKey="status" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2E5077" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processos por área</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={charts?.processesByArea ?? []} dataKey="count" nameKey="area" outerRadius={90}>
                  {(charts?.processesByArea ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximas atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-graphite">
            <li>{summary?.upcomingHearings ?? 0} audiência(s) nos próximos 7 dias</li>
            <li>{summary?.upcomingDeadlines ?? 0} prazo(s) nos próximos 7 dias</li>
            <li>{summary?.priorityTasks ?? 0} tarefa(s) de alta prioridade pendente(s)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
