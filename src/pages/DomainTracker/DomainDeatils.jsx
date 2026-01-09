import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaHistory, FaList } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import api from "../../api/axios";

const DomainDetails = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------- Fetch Domains from API ---------
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

  // --------- Handlers ---------
  const handleEditDomain = (domainId) => {
    // Navigate to EditDomainPage with domain ID
    navigate(`/domain/update/${domainId}`);
  };

  const handleDeleteDomain = async (domainId) => {
    if (!window.confirm(`Are you sure you want to delete domain: ${domainId}?`))
      return;

    try {
      const res = await api.delete(`/api/domain/delete/${domainId}/`);
      if (res.data.success) {
        alert(res.data.message || `Domain ${domainId} deleted successfully`);
        fetchDomains(); // Refresh the domain list
      } else {
        alert(res.data.message || "Failed to delete domain");
      }
    } catch (err) {
      if (err.response) {
        alert(err.response.data?.message || "Failed to delete domain");
      } else {
        alert("Server error. Please try again.");
      }
    }
  };

  const handleViewHistory = (domainId) => {
    navigate(`/domain/history/${domainId}`);
  };

  // --------- Helper for Expiry ---------
  const getExpiryInfo = (expiryDateStr) => {
    if (!expiryDateStr) return { daysUntilExpiry: null, expiryClass: "" };

    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilExpiry = Math.ceil((expiry - today) / msPerDay);

    let expiryClass = "";
    if (daysUntilExpiry < 0) expiryClass = "expired";
    else if (daysUntilExpiry <= 30) expiryClass = "expiry-soon";

    return { daysUntilExpiry, expiryClass };
  };

  const domainCountText = `${domains.length} Domain${
    domains.length !== 1 ? "s" : ""
  }`;

  // --------- Render ---------
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
                <FaList className="domain-icon" /> Managed Domains
              </h2>
              <div className="domain-count">{domainCountText}</div>
            </div>

            {loading ? (
              <div>Loading domains...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : domains.length === 0 ? (
              <div>No domains found.</div>
            ) : (
              <div className="table-responsive">
                <table id="domainsTable">
                  <thead>
                    <tr>
                      <th>Domain Name</th>
                      <th>Registrar</th>
                      <th>Domain Expiry</th>
                      <th>Status</th>
                      <th>SSH</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((domain) => {
                      const purchaseDisplay = domain.purchaseDate
                        ? new Date(domain.purchaseDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )
                        : "N/A";

                      const expiryDisplay = domain.expiryDate
                        ? new Date(domain.expiryDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )
                        : "N/A";

                      const { daysUntilExpiry, expiryClass } = getExpiryInfo(
                        domain.expiryDate
                      );

                      const isActive = domain.activeStatus === "active";

                      const sshExpiryDisplay = domain.ssh_expiry_date
                        ? new Date(domain.ssh_expiry_date).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )
                        : null;

                      return (
                        <tr key={domain.id}>
                          <td>
                            <div className="domain-name">{domain.name}</div>
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "var(--dark-gray)",
                              }}
                            >
                              Purchased: {purchaseDisplay}
                            </div>
                          </td>
                          <td>{domain.registrar || "Not specified"}</td>
                          <td className={expiryClass}>
                            {expiryDisplay}{" "}
                            {typeof daysUntilExpiry === "number" &&
                              daysUntilExpiry <= 30 && (
                                <span style={{ fontSize: "0.85rem" }}>
                                  ({daysUntilExpiry} days)
                                </span>
                              )}
                          </td>
                          <td
                            className={
                              isActive ? "status-active" : "status-inactive"
                            }
                          >
                            {isActive ? "Active" : "Inactive"}
                          </td>
                          <td>
                            {domain.sshName || sshExpiryDisplay ? (
                              <>
                                <div>{domain.sshName || "SSH"}</div>
                                <div
                                  style={{
                                    fontSize: "0.85rem",
                                    color: "var(--dark-gray)",
                                  }}
                                >
                                  {sshExpiryDisplay
                                    ? `Expires: ${sshExpiryDisplay}`
                                    : "No expiry date"}
                                </div>
                              </>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td>
                            <div className="actions">
                              <button
                                type="button"
                                className="action-btn edit-btn"
                                title="Edit domain"
                                onClick={() => handleEditDomain(domain.id)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="action-btn delete-btn"
                                title="Delete domain"
                                onClick={() => handleDeleteDomain(domain.id)}
                              >
                                <FaTrashAlt />
                              </button>
                              <button
                                type="button"
                                className="action-btn history-btn"
                                title="View history"
                                onClick={() => handleViewHistory(domain.id)}
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DomainDetails;
