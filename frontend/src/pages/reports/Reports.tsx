import { Card, CardContent } from "../../components/ui/Card";
import { Construction } from "lucide-react";

export default function Reports() {
  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-navy">Relatórios</h1>
      <p className="mb-6 text-sm text-gray-500">Relatórios de clientes, processos, operação e financeiro.</p>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <Construction className="text-gray-400" size={28} />
          <p className="font-display text-base font-semibold text-navy">Módulo aguardando implementação</p>
          <p className="max-w-sm text-sm text-gray-500">
            Os relatórios detalhados (clientes por período, processos por área/responsável, produtividade e
            faturamento) estão planejados para a próxima fase, reaproveitando os dados já persistidos no MVP.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
