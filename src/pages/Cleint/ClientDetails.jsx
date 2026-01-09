import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaList } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import api from "../../api/axios";

const ClientDetails = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------- Fetch Clients ---------
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/client/list/");
      if (res.data.success) {
        setClients(res.data.clients || []);
      } else {
        setError("Failed to fetch clients.");
      }
    } catch (err) {
      setError("Server error while fetching clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // --------- Handlers ---------
  const handleEditClient = (clientId) => {
    navigate(`/client/update/${clientId}`);
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm(`Are you sure you want to delete this client?`)) return;

    try {
      const res = await api.delete(`/api/client/delete/${clientId}/`);
      if (res.data.success) {
        alert(res.data.message || "Client deleted successfully");
        fetchClients(); // Refresh
      } else {
        alert(res.data.message || "Failed to delete client");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Server error");
    }
  };

  const clientCountText = `${clients.length} Client${
    clients.length !== 1 ? "s" : ""
  }`;

  return (
    <div
      className="min-h-screen"
      style={{
        marginLeft: "var(--sidebar-current-width)",
        paddingTop: "var(--tw-topbar-height)",
      }}
    >
      <Sidebar />
      <Navbar />

      <main className="app-main">
        <div className="max-w-[1200px] mx-auto px-5 mt-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="table-header">
              <h2>
                <FaList className="domain-icon" />
                Clients
              </h2>
              <div className="domain-count">{clientCountText}</div>
            </div>

            {loading ? (
              <div>Loading clients...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : clients.length === 0 ? (
              <div>No clients found.</div>
            ) : (
              <div className="table-responsive">
                <table id="clientsTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.companyName}</td>
                        <td>{c.contact}</td>
                        <td>{c.email}</td>
                        <td>{c.address}</td>
                        <td>
                          <div className="actions">
                            <button
                              type="button"
                              className="action-btn edit-btn"
                              title="Edit client"
                              onClick={() => handleEditClient(c.id)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="action-btn delete-btn"
                              title="Delete client"
                              onClick={() => handleDeleteClient(c.id)}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDetails;
