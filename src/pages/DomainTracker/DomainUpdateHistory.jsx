import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";

// DUMMY HISTORY DATA
const dummyHistory = [
  {
    id: "hist-1",
    domainName: "example.com",
    registrar: "GoDaddy",
    updatedAt: "2025-01-05", // YYYY-MM-DD
    changes: "Updated Domain expiry date",
  },
  {
    id: "hist-2",
    domainName: "example.com",
    registrar: "GoDaddy",
    updatedAt: "2025-01-02",
    changes: "Changed domain name",
  },
  {
    id: "hist-3",
    domainName: "mydomain.net",
    registrar: "Namecheap",
    updatedAt: "2024-06-15",
    changes: "Updated ssh expiry date",
  },
];

const DomainHistory = ({ history = [] }) => {
  // Use real history if provided, otherwise dummy
  const dataToRender = history.length ? history : dummyHistory;

  const [searchDomain, setSearchDomain] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const filteredHistory = dataToRender.filter((item) => {
    const domainMatch = searchDomain
      ? item.domainName.toLowerCase().includes(searchDomain.toLowerCase())
      : true;

    const dateMatch = searchDate ? item.updatedAt === searchDate : true;

    return domainMatch && dateMatch;
  });

  const countText = `${filteredHistory.length} Record${
    filteredHistory.length !== 1 ? "s" : ""
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
                <FaHistory className="domain-icon" /> Domain History
              </h2>
              <div className="domain-count" id="historyCount">
                {countText}
              </div>
            </div>

            {/* Search controls */}
            <div
              className="table-filters"
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="searchDomain"
                  style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}
                >
                  Search by Domain Name
                </label>
                <input
                  type="text"
                  id="searchDomain"
                  placeholder="e.g. example.com"
                  value={searchDomain}
                  onChange={(e) => setSearchDomain(e.target.value)}
                  style={{ padding: "0.4rem 0.6rem", minWidth: "220px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="searchDate"
                  style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}
                >
                  Filter by Updated Date
                </label>
                <input
                  type="date"
                  id="searchDate"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  style={{ padding: "0.3rem 0.6rem" }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table id="domainHistoryTable">
                <thead>
                  <tr>
                    <th>Domain Name</th>
                    <th>Registrar</th>
                    <th>Updated</th>
                    <th>What Was Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No history records found.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((record) => {
                      const updatedDisplay = record.updatedAt
                        ? new Date(record.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A";

                      return (
                        <tr key={record.id}>
                          <td>{record.domainName}</td>
                          <td>{record.registrar || "Not specified"}</td>
                          <td>{updatedDisplay}</td>
                          <td>{record.changes}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DomainHistory;
