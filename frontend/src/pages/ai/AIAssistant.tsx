import { FormEvent, useState } from "react";
import { api } from "../../services/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select, Textarea } from "../../components/ui/Input";
import { AlertTriangle, Sparkles } from "lucide-react";

const KIND_OPTIONS = [
  { value: "resumo", label: "Resumir documento" },
  { value: "rascunho", label: "Criar rascunho (contrato, notificação, e-mail...)" },
  { value: "sugestao", label: "Sugerir próximos passos" },
];

export default function AIAssistant() {
  const [kind, setKind] = useState("resumo");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<{ configured: boolean; message: string; response?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/ai/assist", { kind, prompt });
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="text-gold" size={22} />
        <h1 className="font-display text-2xl font-semibold text-navy">Assistente Jurídico Inteligente</h1>
      </div>
      <p className="mb-6 text-sm text-gray-500">Suporte de IA para análise, produção assistida e sugestões.</p>

      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardContent className="flex gap-3 text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Todo conteúdo gerado é um rascunho.</p>
            <p className="mt-1 text-amber-800">
              As respostas da IA devem ser revisadas por um profissional responsável antes de qualquer uso. A IA não
              executa ações críticas automaticamente e nenhum documento jurídico deve ser utilizado profissionalmente
              sem validação humana.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Nova solicitação</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Select value={kind} onChange={(e) => setKind(e.target.value)}>
                {KIND_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </div>
            <Textarea
              rows={5}
              required
              placeholder="Descreva o que você precisa (ex: resumir este documento, redigir uma notificação extrajudicial...)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button type="submit" disabled={loading}>{loading ? "Processando..." : "Solicitar à IA"}</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader><CardTitle>Resultado</CardTitle></CardHeader>
          <CardContent>
            {!result.configured ? (
              <p className="text-sm text-gray-600">{result.message}</p>
            ) : (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-700">Rascunho — revisar antes de usar</p>
                <p className="whitespace-pre-wrap text-sm text-graphite">{result.response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
