import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaHistory } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";

// 2 DUMMY DOMAINS
const dummyDomains = [
  {
    id: "dummy-1",
    name: "example.com",
    registrar: "GoDaddy",
    purchaseDate: "2025-01-1",
    expiryDate: "2025-01-10",
    activeStatus: "active",
    sshName: "Example SSH",
    sshPurchaseDate: "2023-01-10",
    sshExpiryDate: "2025-01-10",
  },
  {
    id: "dummy-2",
    name: "mydomain.net",
    registrar: "Namecheap",
    purchaseDate: "2022-06-01",
    expiryDate: "2024-06-01",
    activeStatus: "inactive",
    sshName: "",
    sshPurchaseDate: "",
    sshExpiryDate: "",
  },
];

const DomainDeatils = ({
  domains = [],
  domainCountText,
  onEditDomain,
  onDeleteDomain,
  onViewHistory,
}) => {
  const navigate = useNavigate();

  // Use real domains if provided, otherwise fall back to dummy data
  const dataToRender = domains.length ? domains : dummyDomains;

  // If parent doesn't pass a count text, compute it from current data
  const finalCountText =
    domainCountText ||
    `${dataToRender.length} Domain${dataToRender.length !== 1 ? "s" : ""}`;

  const handleEditDomain = (domainId) => {
    if (onEditDomain) {
      onEditDomain(domainId);
    } else {
      navigate(`/domain/update/${domainId}`);
    }
  };

  const handleDeleteDomain = (domainId) => {
    if (onDeleteDomain) {
      onDeleteDomain(domainId);
    } else {
      if (confirm(`Delete domain: ${domainId}?`)) {
        alert(`Domain ${domainId} deleted`);
      }
    }
  };

  const handleViewHistory = (domainId) => {
    if (onViewHistory) {
      onViewHistory(domainId);
    } else {
      alert(`View history for domain: ${domainId}`);
    }
  };

  const getExpiryInfo = (expiryDateStr) => {
    if (!expiryDateStr) {
      return { daysUntilExpiry: null, expiryClass: "" };
    }

    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilExpiry = Math.ceil((expiry - today) / msPerDay);

    let expiryClass = "";
    if (daysUntilExpiry < 0) {
      expiryClass = "expired";
    } else if (daysUntilExpiry <= 30) {
      expiryClass = "expiry-soon";
    }

    return { daysUntilExpiry, expiryClass };
  };

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
                <FaHistory className="domain-icon" /> Managed Domains
              </h2>
              <div className="domain-count" id="domainCount">
                {finalCountText}
              </div>
            </div>

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
                <tbody id="domainsTableBody">
                  {dataToRender.map((domain) => {
                    const purchaseDisplay = domain.purchaseDate
                      ? new Date(domain.purchaseDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "N/A";

                    const expiryDisplay = domain.expiryDate
                      ? new Date(domain.expiryDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "N/A";

                    const { daysUntilExpiry, expiryClass } = getExpiryInfo(
                      domain.expiryDate
                    );

                    const isActive =
                      domain.activeStatus === "inactive" ? false : true;

                    const sshExpiryDisplay = domain.sshExpiryDate
                      ? new Date(domain.sshExpiryDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default DomainDeatils;
