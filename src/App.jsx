import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";

import DomainForm from "./pages/DomainTracker/DomainForm.jsx";
import DomainDeatils from "./pages/DomainTracker/DomainDeatils.jsx";
import EditDomainPage from "./pages/DomainTracker/EditDomainPage.jsx";
import DomainUpdateHistory from "./pages/DomainTracker/DomainUpdateHistory.jsx";

import ClientForm from "./pages/Cleint/ClientForm.jsx";
import ClientDetails from "./pages/Cleint/ClientDetails.jsx";
import ClientUpdateForm from "./pages/Cleint/ClientUpdateForm.jsx";

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Login />} />

      {/* PROTECTED */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* DOMAIN TRACKER */}
      <Route
        path="/domain/new"
        element={
          <ProtectedRoute>
            <DomainForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/domain/all"
        element={
          <ProtectedRoute>
            <DomainDeatils />
          </ProtectedRoute>
        }
      />

      <Route
        path="/domain/update/:id"
        element={
          <ProtectedRoute>
            <EditDomainPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/domain/history"
        element={
          <ProtectedRoute>
            <DomainUpdateHistory />
          </ProtectedRoute>
        }
      />

      {/* CLIENT */}
      <Route
        path="/client/new"
        element={
          <ProtectedRoute>
            <ClientForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/all"
        element={
          <ProtectedRoute>
            <ClientDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/update/:id"
        element={
          <ProtectedRoute>
            <ClientUpdateForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
