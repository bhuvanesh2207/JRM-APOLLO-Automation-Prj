import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

/* DOMAIN TRACKER */
import DomainForm from "./pages/DomainTracker/DomainForm.jsx";
import DomainDetails from "./pages/DomainTracker/DomainDeatils.jsx";
import EditDomainPage from "./pages/DomainTracker/EditDomainPage.jsx";
import DomainUpdateHistory from "./pages/DomainTracker/DomainUpdateHistory.jsx";

/* CLIENT */
import ClientForm from "./pages/Cleint/ClientForm.jsx";
import ClientDetails from "./pages/Cleint/ClientDetails.jsx";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Login />} />

      {/* ADMIN DASHBOARD */}
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
            <DomainDetails />
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

      <Route
        path="/domain/history/:domainId"
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
        path="/client/update/:id"
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
    </Routes>
  );
}

export default App;
