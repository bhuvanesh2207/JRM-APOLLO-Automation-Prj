import React, { useState, useEffect, useRef } from "react";
import {
  FaPlusCircle,
  FaArrowRight,
  FaRedo,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import AutoBreadcrumb from "../../compomnents/AutoBreadcrumb";
import api from "../../api/axios";
import Popup from "../../compomnents/Popup"; // 1. IMPORT POPUP COMPONENT

const DomainForm = () => {
  const formRef = useRef(null);

  const today = new Date();
  const minPurchaseDate = "2000-01-01";
  const maxPurchaseDate = today.toISOString().split("T")[0];

  const [currentStep, setCurrentStep] = useState(1);

  // ✅ Clients from API
  const [clients, setClients] = useState([]);

  // 2. STATE FOR POPUP
  const [popupState, setPopupState] = useState({
    show: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  const [formData, setFormData] = useState({
    client_name: "",
    domain_name: "",
    registrar: "",
    purchase_date: "",
    expiry_date: "",
    active_status: true, // boolean

    ssh_name: "",
    ssh_purchase_date: "",
    ssh_expiry_date: "",

    hosting_name: "",
    hosting_purchase_date: "",
    hosting_expiry_date: "",
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
        setPopupState({
          show: true,
          title: "Error",
          message: "Failed to load client data. Please refresh the page.",
          isSuccess: false,
        });
      }
    };

    fetchClients();
  }, []);

  // --------- HANDLERS ---------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = () => {
    setFormData({
      client_name: "",
      domain_name: "",
      registrar: "",
      purchase_date: "",
      expiry_date: "",
      active_status: true,
      ssh_name: "",
      ssh_purchase_date: "",
      ssh_expiry_date: "",
      hosting_name: "",
      hosting_purchase_date: "",
      hosting_expiry_date: "",
    });
    setErrors({});
    setCurrentStep(1); // Reset to first step
  };

  // 3. HANDLER TO CLOSE POPUP AND RESET FORM ON SUCCESS
  const handleClosePopup = () => {
    const wasSuccess = popupState.isSuccess;
    setPopupState({ show: false, title: "", message: "", isSuccess: false });
    if (wasSuccess) {
      handleReset();
    }
  };

  // --------- VALIDATION ---------
  const validateStep = (step) => {
    const newErrors = {};
    const {
      client_name,
      domain_name,
      registrar,
      purchase_date,
      expiry_date,
      ssh_name,
      ssh_purchase_date,
      ssh_expiry_date,
      hosting_name,
      hosting_purchase_date,
      hosting_expiry_date,
    } = formData;

    const domainRegex =
      /^(?!https?:\/\/)(?!www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

    // --- STEP 1: DOMAIN VALIDATION ---
    if (step === 1) {
      if (!client_name) newErrors.client_name = "Client is required.";

      if (!domain_name.trim()) {
        newErrors.domain_name = "Domain name is required.";
      } else if (!domainRegex.test(domain_name.trim())) {
        newErrors.domain_name = "Enter a valid domain (example: example.com).";
      }

      if (!registrar.trim()) newErrors.registrar = "Registrar is required.";
      if (!purchase_date)
        newErrors.purchase_date = "Purchase date is required.";
      if (!expiry_date) newErrors.expiry_date = "Expiry date is required.";

      if (purchase_date && expiry_date) {
        if (new Date(expiry_date) <= new Date(purchase_date)) {
          newErrors.expiry_date =
            "Domain expiry date must be after purchase date.";
        }
      }
    }

    // --- STEP 2: SSH VALIDATION ---
    if (step === 2) {
      if (ssh_name.trim()) {
        if (!ssh_purchase_date)
          newErrors.ssh_purchase_date = "SSH purchase date is required.";
        if (!ssh_expiry_date)
          newErrors.ssh_expiry_date = "SSH expiry date is required.";

        if (ssh_purchase_date && ssh_expiry_date) {
          if (new Date(ssh_expiry_date) <= new Date(ssh_purchase_date)) {
            newErrors.ssh_expiry_date =
              "SSH expiry date must be after SSH purchase date.";
          }
        }
      }
    }

    // --- STEP 3: HOSTING VALIDATION ---
    if (step === 3) {
      if (hosting_name.trim()) {
        if (!hosting_purchase_date)
          newErrors.hosting_purchase_date =
            "Hosting purchase date is required.";
        if (!hosting_expiry_date)
          newErrors.hosting_expiry_date = "Hosting expiry date is required.";

        if (hosting_purchase_date && hosting_expiry_date) {
          if (
            new Date(hosting_expiry_date) <= new Date(hosting_purchase_date)
          ) {
            newErrors.hosting_expiry_date =
              "Hosting expiry date must be after Hosting purchase date.";
          }
        }
      }
    }

    return newErrors;
  };

  // --------- NAVIGATION ---------
  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const firstField = Object.keys(stepErrors)[0];
      const el = formRef.current?.querySelector(`[name="${firstField}"]`);
      if (el) el.focus();
    } else {
      setErrors({});
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => prev - 1);
  };

  // --------- SUBMIT ---------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateStep(3);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      client_name: formData.client_name || null,
      domain_name: formData.domain_name.trim(),
      registrar: formData.registrar.trim() || null,
      purchase_date: formData.purchase_date || null,
      expiry_date: formData.expiry_date || null,
      active_status: !!formData.active_status,
      ssh_name: formData.ssh_name.trim() || null,
      ssh_purchase_date: formData.ssh_purchase_date || null,
      ssh_expiry_date: formData.ssh_expiry_date || null,
      hosting_name: formData.hosting_name.trim() || null,
      hosting_purchase_date: formData.hosting_purchase_date || null,
      hosting_expiry_date: formData.hosting_expiry_date || null,
    };

    try {
      await api.post("/api/domain/add/", payload);
      console.log("Submitting:", payload);

      // 4. USE POPUP INSTEAD OF ALERT
      setPopupState({
        show: true,
        title: "Success",
        message: "Domain has been added successfully!",
        isSuccess: true,
      });
      // The handleClosePopup will now trigger handleReset()
    } catch (err) {
      console.log(err.response?.data);
      const errorMessage = err.response?.data?.errors
        ? Object.values(err.response.data.errors).join("\n")
        : "An unexpected server error occurred. Please try again.";

      // 4. USE POPUP FOR ERRORS
      setPopupState({
        show: true,
        title: "Submission Failed",
        message: errorMessage,
        isSuccess: false,
      });
    }
  };

  const twoColStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
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
          <AutoBreadcrumb />
          <div className="bg-white rounded-lg shadow-lg p-6">
            <section className="form-container" ref={formRef}>
              <h2>
                <FaPlusCircle className="domain-icon" />
                {currentStep === 1 && " Domain Details"}
                {currentStep === 2 && " SSH Details"}
                {currentStep === 3 && " Hosting Details"}
                <span className="step-indicator">(Step {currentStep}/3)</span>
              </h2>

              <form onSubmit={(e) => e.preventDefault()} noValidate>
                {/* ================= STEP 1: DOMAIN ================= */}
                {currentStep === 1 && (
                  <>
                    <div style={twoColStyle}>
                      <div className="form-group">
                        <label className="required">Client</label>
                        <select
                          name="client_name"
                          value={formData.client_name}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Client --</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.name}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                        {errors.client_name && (
                          <p className="error-message">{errors.client_name}</p>
                        )}
                      </div>
                      <div className="form-group">
                        <label className="required">Domain Name</label>
                        <input
                          type="text"
                          name="domain_name"
                          placeholder="example.com"
                          value={formData.domain_name}
                          onChange={handleChange}
                        />
                        {errors.domain_name && (
                          <p className="error-message">{errors.domain_name}</p>
                        )}
                      </div>
                    </div>
                    <div style={twoColStyle}>
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
                      <div className="form-group">
                        <label className="required">Active Status</label>
                        <div
                          className="radio-group"
                          style={{ marginTop: "10px" }}
                        >
                          <label>
                            <input
                              type="radio"
                              name="active_status"
                              value="true"
                              checked={formData.active_status === true}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  active_status: true,
                                })
                              }
                            />
                            Active
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="active_status"
                              value="false"
                              checked={formData.active_status === false}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  active_status: false,
                                })
                              }
                            />
                            Inactive
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group date-group">
                      <div>
                        <label className="required">Purchase Date</label>
                        <input
                          type="date"
                          name="purchase_date"
                          min={minPurchaseDate}
                          max={maxPurchaseDate}
                          value={formData.purchase_date}
                          onChange={handleChange}
                        />
                        {errors.purchase_date && (
                          <p className="error-message">
                            {errors.purchase_date}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="required">Expiry Date</label>
                        <input
                          type="date"
                          name="expiry_date"
                          min={formData.purchase_date || minPurchaseDate}
                          value={formData.expiry_date}
                          onChange={handleChange}
                        />
                        {errors.expiry_date && (
                          <p className="error-message">{errors.expiry_date}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {/* ================= STEP 2: SSH ================= */}
                {currentStep === 2 && (
                  <>
                    <h3 className="section-title mt-2">
                      SSH Configuration (Optional)
                    </h3>
                    <div className="form-group">
                      <label>SSH Name</label>
                      <input
                        type="text"
                        name="ssh_name"
                        placeholder="e.g. DigitalOcean SSH"
                        value={formData.ssh_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group date-group">
                      <div>
                        <label>SSH Purchase Date</label>
                        <input
                          type="date"
                          name="ssh_purchase_date"
                          min={minPurchaseDate}
                          max={maxPurchaseDate}
                          value={formData.ssh_purchase_date}
                          onChange={handleChange}
                          disabled={!formData.ssh_name}
                        />
                        {errors.ssh_purchase_date && (
                          <p className="error-message">
                            {errors.ssh_purchase_date}
                          </p>
                        )}
                      </div>
                      <div>
                        <label>SSH Expiry Date</label>
                        <input
                          type="date"
                          name="ssh_expiry_date"
                          min={formData.ssh_purchase_date || minPurchaseDate}
                          value={formData.ssh_expiry_date}
                          onChange={handleChange}
                          disabled={!formData.ssh_name}
                        />
                        {errors.ssh_expiry_date && (
                          <p className="error-message">
                            {errors.ssh_expiry_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {/* ================= STEP 3: HOSTING ================= */}
                {currentStep === 3 && (
                  <>
                    <h3 className="section-title mt-2">
                      Hosting Configuration (Optional)
                    </h3>
                    <div className="form-group">
                      <label>Hosting Name</label>
                      <input
                        type="text"
                        name="hosting_name"
                        placeholder="e.g. AWS / Hostinger"
                        value={formData.hosting_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group date-group">
                      <div>
                        <label>Hosting Purchase Date</label>
                        <input
                          type="date"
                          name="hosting_purchase_date"
                          min={minPurchaseDate}
                          max={maxPurchaseDate}
                          value={formData.hosting_purchase_date}
                          onChange={handleChange}
                          disabled={!formData.hosting_name}
                        />
                        {errors.hosting_purchase_date && (
                          <p className="error-message">
                            {errors.hosting_purchase_date}
                          </p>
                        )}
                      </div>
                      <div>
                        <label>Hosting Expiry Date</label>
                        <input
                          type="date"
                          name="hosting_expiry_date"
                          min={
                            formData.hosting_purchase_date || minPurchaseDate
                          }
                          value={formData.hosting_expiry_date}
                          onChange={handleChange}
                          disabled={!formData.hosting_name}
                        />
                        {errors.hosting_expiry_date && (
                          <p className="error-message">
                            {errors.hosting_expiry_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {/* ================= ACTIONS ================= */}
                <div
                  className="form-actions mt-6"
                  style={{ justifyContent: "space-between" }}
                >
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handlePrev}
                    >
                      <FaArrowLeft /> Previous
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <div style={{ display: "flex", gap: "10px" }}>
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleNext}
                      >
                        Next <FaArrowRight />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleReset}
                        >
                          <FaRedo /> Reset
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleSubmit}
                        >
                          <FaSave /> Save
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>

      {/* 5. RENDER POPUP COMPONENT */}
      <Popup
        show={popupState.show}
        title={popupState.title}
        message={popupState.message}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default DomainForm;
