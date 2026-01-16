import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaList } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import AutoBreadcrumb from "../../compomnents/AutoBreadcrumb";
import api from "../../api/axios";

const ClientDetails = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination & Search state
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  // --------- Filtering & Pagination ---------
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalEntries = filteredClients.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const startEntry =
    totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

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
          <AutoBreadcrumb />
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Table Header */}
            <div
              className="table-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2>
                <FaList className="domain-icon" /> Clients
              </h2>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/client/new")}
              >
                Add Client
              </button>
            </div>

            {/* Top controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ marginRight: 8 }}
                >
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                entries per page
              </div>
              <div className="table-search">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search clients"
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div>Loading clients...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : totalEntries === 0 ? (
              <div>No clients found.</div>
            ) : (
              <>
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
                      {paginatedClients.map((c) => (
                        <tr key={c.id}>
                          <td>{c.name}</td>
                          <td>{c.company_name}</td>
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

                {/* Bottom controls */}
                <div className="table-footer">
                  <div className="entries-info">
                    {`Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`}
                  </div>
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`pagination-btn${
                            currentPage === page ? " active" : ""
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="pagination-btn"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDetails;
