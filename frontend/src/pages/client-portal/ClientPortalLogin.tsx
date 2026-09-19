import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientPortalApi } from "../../services/api/client";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { Scale } from "lucide-react";

export default function ClientPortalLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await clientPortalApi.post("/client-portal/login", { email, password });
      localStorage.setItem("pj_client_token", res.data.token);
      navigate("/portal");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-white">
          <Scale className="mb-3 text-gold" size={32} />
          <h1 className="font-display text-xl font-semibold">Área do Cliente</h1>
          <p className="mt-1 text-sm text-white/50">Acompanhe seu processo e documentos</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded bg-white px-6 py-7 shadow-xl">
          <div className="mb-4">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
        </form>
      </div>
    </div>
  );
}
