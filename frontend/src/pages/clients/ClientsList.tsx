import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api/client";
import { Client } from "../../services/api/types";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ClientFormModal } from "./ClientFormModal";
import { Plus, Search } from "lucide-react";

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    const res = await api.get<Client[]>("/clients", { params: { search: search || undefined } });
    setClients(res.data);
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Clientes</h1>
          <p className="text-sm text-gray-500">Pessoas físicas e jurídicas atendidas pelo escritório.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Novo cliente
        </Button>
      </div>

      <div className="mb-4 max-w-xs">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Buscar por nome ou documento" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
      </div>

      {clients.length === 0 ? (
        <EmptyState title="Nenhum cliente encontrado" description="Cadastre o primeiro cliente do escritório." />
      ) : (
        <Table>
          <THead>
            <TRow>
              <TH>Nome</TH>
              <TH>Tipo</TH>
              <TH>Documento</TH>
              <TH>Contato</TH>
              <TH>Status</TH>
            </TRow>
          </THead>
          <tbody>
            {clients.map((c) => (
              <TRow key={c.id} className="hover:bg-surface">
                <TD>
                  <Link to={`/clientes/${c.id}`} className="font-medium text-steel hover:underline">
                    {c.name}
                  </Link>
                </TD>
                <TD>{c.type === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}</TD>
                <TD>{c.document}</TD>
                <TD>{c.phone || c.email || "—"}</TD>
                <TD>
                  <Badge tone={c.status === "ACTIVE" ? "success" : "neutral"}>
                    {c.status === "ACTIVE" ? "Ativo" : "Inativo"}
                  </Badge>
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      )}

      <ClientFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={load} />
    </div>
  );
}
