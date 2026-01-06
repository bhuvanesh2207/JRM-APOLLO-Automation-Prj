// src/pages/EditDomainPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";

const EditDomainPage = () => {
  const { id } = useParams(); // domain id from URL
  const navigate = useNavigate();

  const today = new Date();
  const minPurchaseDate = "2000-01-01";
  const maxPurchaseDate = today.toISOString().split("T")[0];

  const [selectedOption, setSelectedOption] = useState("update-info");

  const [formData, setFormData] = useState({
    // Update domain information
    domainName: "",
    registrar: "",
    clientName: "",
    activeStatus: "active",

    // Upgrade domain plan
    purchaseDate: "",
    expiryDate: "",

    // Upgrade SSH plan
    sshName: "",
    sshPurchaseDate: "",
    sshExpiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handlers for each form
  const handleSubmitUpdateInfo = (e) => {
    e.preventDefault();
    console.log("Update domain information for:", id, {
      domainName: formData.domainName,
      registrar: formData.registrar,
      clientName: formData.clientName,
      activeStatus: formData.activeStatus,
    });
    alert("Domain information updated successfully!");
  };

  const handleSubmitDomainPlan = (e) => {
    e.preventDefault();
    console.log("Upgrade domain plan for:", id, {
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate,
    });
    alert("Domain plan updated successfully!");
  };

  const handleSubmitSSHPlan = (e) => {
    e.preventDefault();
    console.log("Upgrade SSH plan for:", id, {
      sshName: formData.sshName,
      sshPurchaseDate: formData.sshPurchaseDate,
      sshExpiryDate: formData.sshExpiryDate,
    });
    alert("SSH plan updated successfully!");
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
            <section className="form-container">
              <h2>
                <FaEdit className="domain-icon" /> Edit Domain - {id}
              </h2>

              {/* Option buttons (tabs) */}
              <div
                className="form-group"
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "1rem",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedOption("update-info")}
                >
                  Update the domain information
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedOption("upgrade-domain")}
                >
                  Upgrade the domain plan
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedOption("upgrade-ssh")}
                >
                  Upgrade the SSH plan
                </button>
              </div>

              {/* 1) Update the domain information */}
              {selectedOption === "update-info" && (
                <form id="domainForm" onSubmit={handleSubmitUpdateInfo}>
                  <div className="form-group">
                    <label htmlFor="domainName" className="required">
                      Domain Name
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        id="domainName"
                        name="domainName"
                        placeholder="example.com"
                        value={formData.domainName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <span className="form-note">
                      Enter domain without http:// or https://
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="registrar" className="required">
                      Registrar
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        id="registrar"
                        name="registrar"
                        placeholder="GoDaddy, Namecheap, etc."
                        value={formData.registrar}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="clientName" className="required">
                      Client Name
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        placeholder="Client name"
                        value={formData.clientName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Domain Active Status</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="activeStatus"
                          value="active"
                          checked={formData.activeStatus === "active"}
                          onChange={handleChange}
                        />
                        Active
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="activeStatus"
                          value="inactive"
                          checked={formData.activeStatus === "inactive"}
                          onChange={handleChange}
                        />
                        Inactive
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-secondary"
                      id="updateInfoBtn"
                    >
                      <FaEdit /> Update Domain Information
                    </button>
                  </div>
                </form>
              )}

              {/* 2) Upgrade Domain Plan */}
              {selectedOption === "upgrade-domain" && (
                <form id="domainForm" onSubmit={handleSubmitDomainPlan}>
                  <div className="form-group date-group">
                    <div>
                      <label htmlFor="purchaseDate" className="required">
                        Domain Purchase Date
                      </label>
                      <input
                        type="date"
                        id="purchaseDate"
                        name="purchaseDate"
                        min={minPurchaseDate}
                        max={maxPurchaseDate}
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="expiryDate" className="required">
                        Domain Expiry Date
                      </label>
                      <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        min={formData.purchaseDate || minPurchaseDate}
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-secondary"
                      id="updateDomainPlanBtn"
                    >
                      <FaEdit /> Update Domain Plan
                    </button>
                  </div>
                </form>
              )}

              {/* 3) Upgrade SSH Plan */}
              {selectedOption === "upgrade-ssh" && (
                <form id="domainForm" onSubmit={handleSubmitSSHPlan}>
                  <div className="form-group">
                    <label htmlFor="sshName" className="required">
                      SSH Name
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        id="sshName"
                        name="sshName"
                        placeholder="SSH name / identifier"
                        value={formData.sshName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group date-group">
                    <div>
                      <label htmlFor="sshPurchaseDate" className="required">
                        SSH Purchase Date
                      </label>
                      <input
                        type="date"
                        id="sshPurchaseDate"
                        name="sshPurchaseDate"
                        min={minPurchaseDate}
                        max={maxPurchaseDate}
                        value={formData.sshPurchaseDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sshExpiryDate" className="required">
                        SSH Expiry Date
                      </label>
                      <input
                        type="date"
                        id="sshExpiryDate"
                        name="sshExpiryDate"
                        min={formData.sshPurchaseDate || minPurchaseDate}
                        value={formData.sshExpiryDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-secondary"
                      id="updateSSHPlanBtn"
                    >
                      <FaEdit /> Update SSH Plan
                    </button>
                  </div>
                </form>
              )}

              <div style={{ marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="btn btn-back"
                  onClick={() => navigate(-1)}
                >
                  <FaArrowLeft /> Back to Domains
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditDomainPage;
