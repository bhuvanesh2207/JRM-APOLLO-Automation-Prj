import React, { useState, useRef } from "react";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";

const DomainForm = ({
  formRef,
  formData: propFormData,
  editMode = false,
  purchaseMin,
  todayStr,
  onChange: propOnChange,
  onSubmit: propOnSubmit,
  onReset: propOnReset,
}) => {
  const internalFormRef = useRef(null);
  const currentFormRef = formRef || internalFormRef;

  const today = new Date();
  const minPurchaseDate = purchaseMin || "2000-01-01";
  const maxPurchaseDate = todayStr || today.toISOString().split("T")[0];

  const [internalFormData, setInternalFormData] = useState({
    domainName: "",
    registrar: "",
    purchaseDate: "",
    expiryDate: "",
    activeStatus: "active",
    sshName: "",
    sshPurchaseDate: "",
    sshExpiryDate: "",
  });

  const currentFormData = propFormData || internalFormData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (propOnChange) {
      propOnChange(e);
    } else {
      setInternalFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (propOnSubmit) {
      propOnSubmit(e);
    } else {
      // Default submit behavior - could add logic here
      console.log("Form submitted:", currentFormData);
      alert("Domain saved successfully!");
    }
  };

  const handleReset = () => {
    if (propOnReset) {
      propOnReset();
    } else {
      setInternalFormData({
        domainName: "",
        registrar: "",
        purchaseDate: "",
        expiryDate: "",
        activeStatus: "active",
        sshName: "",
        sshPurchaseDate: "",
        sshExpiryDate: "",
      });
    }
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
            <section className="form-container" ref={currentFormRef}>
              <h2>
                <i className="fas fa-plus-circle domain-icon" /> Domain Details
              </h2>

              <form id="domainForm" onSubmit={handleSubmit}>
                {/* Domain name */}
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
                      value={currentFormData.domainName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <span className="form-note">
                    Enter domain without http:// or https://
                  </span>
                </div>

                {/* Registrar */}
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
                      value={currentFormData.registrar}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Domain dates */}
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
                      value={currentFormData.purchaseDate}
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
                      min={maxPurchaseDate}
                      value={currentFormData.expiryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Active / Inactive status */}
                <div className="form-group">
                  <label>Domain Active Status</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="activeStatus"
                        value="active"
                        checked={currentFormData.activeStatus === "active"}
                        onChange={handleChange}
                      />
                      Active
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="activeStatus"
                        value="inactive"
                        checked={currentFormData.activeStatus === "inactive"}
                        onChange={handleChange}
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                {/* SSH (optional) */}
                <div className="form-group">
                  <label htmlFor="sshName">SSH (optional)</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      id="sshName"
                      name="sshName"
                      placeholder="SSH name / identifier"
                      value={currentFormData.sshName}
                      onChange={handleChange}
                    />
                  </div>
                  <span className="form-note">
                    Leave blank if this domain has no SSH subscription.
                  </span>
                </div>

                <div className="form-group date-group">
                  <div>
                    <label htmlFor="sshPurchaseDate">
                      SSH Purchase Date (optional)
                    </label>
                    <input
                      type="date"
                      id="sshPurchaseDate"
                      name="sshPurchaseDate"
                      min={minPurchaseDate}
                      max={maxPurchaseDate}
                      value={currentFormData.sshPurchaseDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="sshExpiryDate">
                      SSH Expiry Date (optional)
                    </label>
                    <input
                      type="date"
                      id="sshExpiryDate"
                      name="sshExpiryDate"
                      min={maxPurchaseDate}
                      value={currentFormData.sshExpiryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                  {!editMode && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      id="saveBtn"
                    >
                      <i className="fas fa-save" /> Save Domain
                    </button>
                  )}

                  {editMode && (
                    <button
                      type="submit"
                      className="btn btn-secondary"
                      id="updateBtn"
                    >
                      <i className="fas fa-edit" /> Update Domain
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="resetBtn"
                    onClick={handleReset}
                  >
                    <i className="fas fa-redo" /> Reset
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DomainForm;
