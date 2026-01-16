import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaHistory, FaList } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import AutoBreadcrumb from "../../compomnents/AutoBreadcrumb";

import api from "../../api/axios";

const DomainDetails = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination & Search state
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- FETCH DOMAINS ---------------- */
  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/domain/list/");
      if (res.data.success) {
        setDomains(res.data.domains || []);
      } else {
        setError("Failed to fetch domains.");
      }
    } catch (err) {
      setError("Server error while fetching domains.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleEditDomain = (id) => navigate(`/domain/update/${id}`);

  const handleDeleteDomain = async (id) => {
    if (!window.confirm("Are you sure you want to delete this domain?")) return;

    try {
      await api.delete(`/api/domain/delete/${id}/`);
      alert("Domain deleted successfully");
      fetchDomains();
    } catch (err) {
      alert("Server error while deleting domain");
    }
  };

  const handleViewHistory = (id) => {
    navigate(`/domain/history/${id}`);
  };

  const handleViewAllHistory = () => {
    navigate("/domain/history/all");
  };

  /* ---------------- DATE RENDERING LOGIC ---------------- */
  const renderExpiryContent = (dateStr) => {
    if (!dateStr) return <span className="text-gray-500">N/A</span>;

    const today = new Date();
    // Normalize time to midnight to calculate day difference correctly
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // 1. Expired (Past date)
    if (days < 0) {
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>
          Expired {Math.abs(days)} days ago
        </span>
      );
    }

    // 2. Within 1 week (<= 7 days)
    if (days <= 7) {
      return <span style={{ color: "red" }}>{formattedDate}</span>;
    }

    // 3. Within 1 month (<= 30 days)
    if (days <= 30) {
      return (
        <span style={{ color: "orangered" }}>
          {" "}
          {/* Red-Orange */}
          {formattedDate}
        </span>
      );
    }

    // 4. Safe (> 30 days)
    return (
      <span style={{ color: "black", fontWeight: "bold" }}>
        {formattedDate}
      </span>
    );
  };

  // Simple formatter for non-expiry dates (like purchase date)
  const formatSimpleDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  /* ---------------- FILTERING & PAGINATION ---------------- */
  const filteredDomains = domains.filter((domain) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      domain.domain_name?.toLowerCase().includes(term) ||
      domain.registrar?.toLowerCase().includes(term) ||
      domain.hosting_name?.toLowerCase().includes(term)
    );
  });

  const totalEntries = filteredDomains.length;
  const totalPages =
    totalEntries === 0 ? 1 : Math.ceil(totalEntries / entriesPerPage);

  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const startEntry =
    totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  /* ---------------- RENDER ---------------- */
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
            {/* Header */}
            <div
              className="table-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div>
                <h2>
                  <FaList className="domain-icon" /> Managed Domains
                </h2>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/domain/new")}
                >
                  Add Domain
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleViewAllHistory}
                >
                  <FaHistory style={{ marginRight: 4 }} />
                  History
                </button>
              </div>
            </div>

            {/* Controls */}
            {!loading && !error && (
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
                    placeholder="Search domains"
                  />
                </div>
              </div>
            )}

            {/* Table */}
            {loading ? (
              <div>Loading domains...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : totalEntries === 0 ? (
              <div>No domains found.</div>
            ) : (
              <>
                <div className="table-responsive">
                  <table id="domainsTable">
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>Registrar</th>
                        <th>Domain Expiry</th>
                        <th>Status</th>
                        <th>SSH</th>
                        <th>Hosting</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedDomains.map((domain) => {
                        return (
                          <tr key={domain.id}>
                            {/* DOMAIN */}
                            <td>
                              <strong>{domain.domain_name}</strong>
                              <div className="text-sm text-gray-500">
                                Purchased:{" "}
                                {formatSimpleDate(domain.purchase_date)}
                              </div>
                            </td>

                            {/* REGISTRAR */}
                            <td>{domain.registrar || "N/A"}</td>

                            {/* DOMAIN EXPIRY */}
                            <td>{renderExpiryContent(domain.expiry_date)}</td>

                            {/* STATUS */}
                            <td
                              className={
                                domain.active_status
                                  ? "status-active"
                                  : "status-inactive"
                              }
                            >
                              {domain.active_status ? "Active" : "Inactive"}
                            </td>

                            {/* SSH */}
                            <td>
                              {domain.ssh_name ? (
                                <>
                                  <div>{domain.ssh_name}</div>
                                  <div className="text-xs">
                                    Expires:{" "}
                                    {renderExpiryContent(
                                      domain.ssh_expiry_date
                                    )}
                                  </div>
                                </>
                              ) : (
                                "N/A"
                              )}
                            </td>

                            {/* HOSTING */}
                            <td>
                              {domain.hosting_name ? (
                                <>
                                  <div>{domain.hosting_name}</div>
                                  <div className="text-xs">
                                    Expires:{" "}
                                    {renderExpiryContent(
                                      domain.hosting_expiry_date
                                    )}
                                  </div>
                                </>
                              ) : (
                                "N/A"
                              )}
                            </td>

                            {/* ACTIONS */}
                            <td>
                              <div className="actions">
                                <button
                                  className="action-btn edit-btn"
                                  onClick={() => handleEditDomain(domain.id)}
                                  title="Edit domain"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => handleDeleteDomain(domain.id)}
                                  title="Delete domain"
                                >
                                  <FaTrashAlt />
                                </button>
                                <button
                                  className="action-btn history-btn"
                                  onClick={() => handleViewHistory(domain.id)}
                                  title="View domain history"
                                >
                                  <FaHistory />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
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

export default DomainDetails;
