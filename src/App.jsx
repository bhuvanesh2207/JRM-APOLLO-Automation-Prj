import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DomainForm from "./pages/DomainTracker/DomainForm.jsx";
import DomainDeatils from "./pages/DomainTracker/DomainDeatils.jsx";
import EditDomainPage from "./pages/DomainTracker/EditDomainPage.jsx";
import DomainUpdateHistory from "./pages/DomainTracker/DomainUpdateHistory.jsx";

import ClientForm from "./pages/Cleint/ClientForm.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* DOMAIN TRACKER */}
      <Route path="/domain/new" element={<DomainForm />} />
      <Route path="/domain/all" element={<DomainDeatils />} />
      <Route path="/domain/update/:id" element={<EditDomainPage />} />
      <Route path="/domain/history" element={<DomainUpdateHistory />} />

      {/* CLIENT */}
      <Route path="/client/new" element={<ClientForm />} />
    </Routes>
  );
}
export default App;
