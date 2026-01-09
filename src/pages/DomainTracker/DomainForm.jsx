// src/pages/DomainForm.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaPlusCircle, FaSave, FaRedo } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import api from "../../api/axios";

const DomainForm = () => {
  const formRef = useRef(null);

  const today = new Date();
  const minPurchaseDate = "2000-01-01";
  const maxPurchaseDate = today.toISOString().split("T")[0];

  // ✅ Clients from API
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    clientName: "",
    domainName: "",
    registrar: "",
    purchaseDate: "",
    expiryDate: "",
    activeStatus: "active",
    sshName: "",
    sshPurchaseDate: "",
    sshExpiryDate: "",
  });

  const [errors, setErrors] = useState({});

  // --------- FETCH CLIENT NAMES ---------
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/api/client/names/");
        setClients(res.data.clients);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      }
    };

    fetchClients();
  }, []);

  // --------- HANDLERS ---------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleReset = () => {
    setFormData({
      clientName: "",
      domainName: "",
      registrar: "",
      purchaseDate: "",
      expiryDate: "",
      activeStatus: "active",
      sshName: "",
      sshPurchaseDate: "",
      sshExpiryDate: "",
    });
    setErrors({});
  };

  // --------- VALIDATION ---------
  const validateForm = () => {
    const newErrors = {};
    const {
      clientName,
      domainName,
      registrar,
      purchaseDate,
      expiryDate,
      sshName,
      sshPurchaseDate,
      sshExpiryDate,
    } = formData;

    const domainRegex =
      /^(?!https?:\/\/)(?!www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

    if (!clientName) newErrors.clientName = "Client is required.";

    if (!domainName.trim()) {
      newErrors.domainName = "Domain name is required.";
    } else if (!domainRegex.test(domainName.trim())) {
      newErrors.domainName = "Enter a valid domain (example: example.com).";
    }

    if (!registrar.trim()) newErrors.registrar = "Registrar is required.";
    if (!purchaseDate) newErrors.purchaseDate = "Purchase date is required.";
    if (!expiryDate) newErrors.expiryDate = "Expiry date is required.";

    if (purchaseDate && expiryDate) {
      if (new Date(expiryDate) <= new Date(purchaseDate)) {
        newErrors.expiryDate =
          "Domain expiry date must be after purchase date.";
      }
    }

    // SSH (optional)
    if (sshName.trim()) {
      if (!sshPurchaseDate)
        newErrors.sshPurchaseDate = "SSH purchase date is required.";
      if (!sshExpiryDate)
        newErrors.sshExpiryDate = "SSH expiry date is required.";

      if (sshPurchaseDate && sshExpiryDate) {
        if (new Date(sshExpiryDate) <= new Date(sshPurchaseDate)) {
          newErrors.sshExpiryDate =
            "SSH expiry date must be after purchase date.";
        }
      }
    }

    return newErrors;
  };

  const focusFirstError = (errorsObj) => {
    const firstField = Object.keys(errorsObj)[0];
    if (!firstField || !formRef.current) return;

    const el = formRef.current.querySelector(`[name="${firstField}"]`);
    if (el) el.focus();
  };

  // --------- SUBMIT ---------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstError(validationErrors);
      return;
    }

    try {
      await api.post("/api/domain/add/", formData);
      alert("Domain added successfully");
      handleReset();
    } catch (err) {
      alert(err.response?.data?.error || "Server error");
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
            <section className="form-container" ref={formRef}>
              <h2>
                <FaPlusCircle className="domain-icon" /> Domain Details
              </h2>

              <form onSubmit={handleSubmit} noValidate>
                {/* Client */}
                <div className="form-group">
                  <label className="required">Client</label>
                  <select
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Client --</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.name}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  {errors.clientName && (
                    <p className="error-message">{errors.clientName}</p>
                  )}
                </div>

                {/* Domain */}
                <div className="form-group">
                  <label className="required">Domain Name</label>
                  <input
                    type="text"
                    name="domainName"
                    placeholder="example.com"
                    value={formData.domainName}
                    onChange={handleChange}
                  />
                  {errors.domainName && (
                    <p className="error-message">{errors.domainName}</p>
                  )}
                </div>

                {/* Registrar */}
                <div className="form-group">
                  <label className="required">Registrar</label>
                  <input
                    type="text"
                    name="registrar"
                    value={formData.registrar}
                    onChange={handleChange}
                  />
                  {errors.registrar && (
                    <p className="error-message">{errors.registrar}</p>
                  )}
                </div>

                {/* Domain Dates */}
                <div className="form-group date-group">
                  <div>
                    <label className="required">Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      min={minPurchaseDate}
                      max={maxPurchaseDate}
                      value={formData.purchaseDate}
                      onChange={handleChange}
                    />
                    {errors.purchaseDate && (
                      <p className="error-message">{errors.purchaseDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="required">Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      min={formData.purchaseDate || minPurchaseDate}
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                    {errors.expiryDate && (
                      <p className="error-message">{errors.expiryDate}</p>
                    )}
                  </div>
                </div>

                {/* SSH Details */}
                <h3 className="section-title mt-6">SSH Details (Optional)</h3>

                <div className="form-group">
                  <label>SSH Name</label>
                  <input
                    type="text"
                    name="sshName"
                    placeholder="e.g. DigitalOcean SSH"
                    value={formData.sshName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group date-group">
                  <div>
                    <label>SSH Purchase Date</label>
                    <input
                      type="date"
                      name="sshPurchaseDate"
                      min={minPurchaseDate}
                      max={maxPurchaseDate}
                      value={formData.sshPurchaseDate}
                      onChange={handleChange}
                      disabled={!formData.sshName}
                    />
                    {errors.sshPurchaseDate && (
                      <p className="error-message">{errors.sshPurchaseDate}</p>
                    )}
                  </div>

                  <div>
                    <label>SSH Expiry Date</label>
                    <input
                      type="date"
                      name="sshExpiryDate"
                      min={formData.sshPurchaseDate || minPurchaseDate}
                      value={formData.sshExpiryDate}
                      onChange={handleChange}
                      disabled={!formData.sshName}
                    />
                    {errors.sshExpiryDate && (
                      <p className="error-message">{errors.sshExpiryDate}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <FaSave /> Save Domain
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReset}
                  >
                    <FaRedo /> Reset
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
