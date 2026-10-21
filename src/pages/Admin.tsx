import { useAdmin } from "../hooks/useAdmin";
import LoginForm from "../components/admin/LoginForm";
import Dashboard from "../components/admin/Dashboard";

export default function Admin() {
  const { isAdmin, login, logout } = useAdmin();
  return isAdmin ? <Dashboard onLogout={logout} /> : <LoginForm onLogin={login} />;
}
