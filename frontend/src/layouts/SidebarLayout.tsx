import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Scale,
  ListChecks,
  Calendar,
  FileText,
  Headset,
  Wallet,
  BarChart3,
  Sparkles,
  UserSquare2,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "LAWYER", "FINANCE", "ASSISTANT"] },
  { to: "/clientes", label: "Clientes", icon: Users, roles: ["ADMIN", "LAWYER", "ASSISTANT"] },
  { to: "/processos", label: "Processos", icon: Scale, roles: ["ADMIN", "LAWYER"] },
  { to: "/tarefas", label: "Tarefas", icon: ListChecks, roles: ["ADMIN", "LAWYER", "ASSISTANT"] },
  { to: "/agenda", label: "Agenda", icon: Calendar, roles: ["ADMIN", "LAWYER", "ASSISTANT"] },
  { to: "/documentos", label: "Documentos", icon: FileText, roles: ["ADMIN", "LAWYER", "ASSISTANT"] },
  { to: "/atendimento", label: "Atendimento", icon: Headset, roles: ["ADMIN", "ASSISTANT"] },
  { to: "/financeiro", label: "Financeiro", icon: Wallet, roles: ["ADMIN", "FINANCE"] },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3, roles: ["ADMIN", "LAWYER", "FINANCE"] },
  { to: "/ia", label: "Inteligência Artificial", icon: Sparkles, roles: ["ADMIN", "LAWYER"] },
  { to: "/configuracoes", label: "Configurações", icon: Settings, roles: ["ADMIN"] },
];

export function SidebarLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-surface">
      <aside className="flex w-64 flex-col bg-navy text-white">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
          <UserSquare2 className="text-gold" size={22} />
          <div>
            <p className="font-display text-sm font-semibold leading-tight">Plataforma Jurídica</p>
            <p className="text-xs text-white/50 leading-tight">Inteligente</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems
            .filter((item) => !user || item.roles.includes(user.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="mb-3 text-xs text-white/50">{user?.role}</p>
          <button
            onClick={logout}
            className="focus-ring flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
