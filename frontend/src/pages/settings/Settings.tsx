import { useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { User } from "../../services/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  LAWYER: "Advogado",
  FINANCE: "Financeiro",
  ASSISTANT: "Assistente / Atendimento",
};

export default function Settings() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get<User[]>("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-navy">Configurações</h1>
      <p className="mb-6 text-sm text-gray-500">Usuários, permissões e dados do escritório.</p>

      <Card>
        <CardHeader><CardTitle>Usuários do escritório</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TRow>
                <TH>Nome</TH>
                <TH>E-mail</TH>
                <TH>Perfil</TH>
                <TH>Status</TH>
              </TRow>
            </THead>
            <tbody>
              {users.map((u) => (
                <TRow key={u.id}>
                  <TD>{u.name}</TD>
                  <TD>{u.email}</TD>
                  <TD>{ROLE_LABEL[u.role]}</TD>
                  <TD><Badge tone={u.active ? "success" : "neutral"}>{u.active ? "Ativo" : "Inativo"}</Badge></TD>
                </TRow>
              ))}
            </tbody>
          </Table>
          <p className="mt-4 text-xs text-gray-400">
            Cadastro e edição de usuários, permissões granulares, áreas jurídicas e categorias personalizadas estão
            preparados na API e serão habilitados nas próximas fases desta tela.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
