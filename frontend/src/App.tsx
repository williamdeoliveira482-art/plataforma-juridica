import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { SidebarLayout } from "./layouts/SidebarLayout";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ClientsList from "./pages/clients/ClientsList";
import ClientDetail from "./pages/clients/ClientDetail";
import ProcessesList from "./pages/processes/ProcessesList";
import ProcessDetail from "./pages/processes/ProcessDetail";
import TasksList from "./pages/tasks/TasksList";
import Agenda from "./pages/agenda/Agenda";
import Documents from "./pages/documents/Documents";
import Financial from "./pages/financial/Financial";
import Reports from "./pages/reports/Reports";
import Attendance from "./pages/attendance/Attendance";
import AIAssistant from "./pages/ai/AIAssistant";
import Settings from "./pages/settings/Settings";
import ClientPortalLogin from "./pages/client-portal/ClientPortalLogin";
import ClientPortalDashboard from "./pages/client-portal/ClientPortalDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/portal/login" element={<ClientPortalLogin />} />
      <Route path="/portal" element={<ClientPortalDashboard />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<ClientsList />} />
          <Route path="/clientes/:id" element={<ClientDetail />} />
          <Route path="/processos" element={<ProcessesList />} />
          <Route path="/processos/:id" element={<ProcessDetail />} />
          <Route path="/tarefas" element={<TasksList />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/documentos" element={<Documents />} />
          <Route path="/financeiro" element={<Financial />} />
          <Route path="/atendimento" element={<Attendance />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/ia" element={<AIAssistant />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
