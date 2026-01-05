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
      <Route path="/new-domain" element={<DomainForm />} />
      <Route path="/all-domains" element={<DomainDeatils />} />
      <Route path="/edit-domain" element={<EditDomainPage />} />
      <Route path="/updated-history" element={<DomainUpdateHistory />} />

      {/* CLIENT */}
      <Route path="/new-client" element={<ClientForm />} />
    </Routes>
  );
}
export default App;
