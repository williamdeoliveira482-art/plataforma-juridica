import { ChangeEvent, useEffect, useState } from "react";
import { api } from "../../services/api/client";
import { DocumentItem } from "../../services/api/types";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/EmptyState";
import { Download, Trash2, Upload } from "lucide-react";

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await api.get<DocumentItem[]>("/documents");
    setDocuments(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/documents", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await load();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDownload(id: string, name: string) {
    const res = await api.get(`/documents/${id}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    await api.delete(`/documents/${id}`);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Documentos</h1>
          <p className="text-sm text-gray-500">Central de documentos do escritório.</p>
        </div>
        <label className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-light">
          <Upload size={16} /> {uploading ? "Enviando..." : "Enviar documento"}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {documents.length === 0 ? (
        <EmptyState title="Nenhum documento enviado" description="Envie contratos, procurações e outros arquivos do escritório." />
      ) : (
        <Table>
          <THead>
            <TRow>
              <TH>Nome</TH>
              <TH>Categoria</TH>
              <TH>Enviado em</TH>
              <TH>Ações</TH>
            </TRow>
          </THead>
          <tbody>
            {documents.map((d) => (
              <TRow key={d.id}>
                <TD>{d.name}</TD>
                <TD>{d.category?.name || "Outros"}</TD>
                <TD>{new Date(d.createdAt).toLocaleDateString("pt-BR")}</TD>
                <TD>
                  <div className="flex gap-2">
                    <button className="text-steel hover:text-navy" onClick={() => handleDownload(d.id, d.name)}>
                      <Download size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(d.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
