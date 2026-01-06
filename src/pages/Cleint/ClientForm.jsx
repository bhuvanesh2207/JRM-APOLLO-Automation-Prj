import React, { useState, useRef } from "react";
import { FaUserPlus, FaSave, FaEdit, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";

const ClientForm = ({
  formRef,
  formData: propFormData,
  editMode = false,
  onChange: propOnChange,
  onSubmit: propOnSubmit,
  onReset: propOnReset,
}) => {
  const internalFormRef = useRef(null);
  const currentFormRef = formRef || internalFormRef;

  const [internalFormData, setInternalFormData] = useState({
    name: "",
    contact: "",
    email: "",
    companyName: "",
    address: "",
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
      console.log("Client form submitted:", currentFormData);
      alert("Client saved successfully!");
    }
  };

  const handleReset = () => {
    if (propOnReset) {
      propOnReset();
    } else {
      setInternalFormData({
        name: "",
        contact: "",
        email: "",
        companyName: "",
        address: "",
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
                <FaUserPlus className="domain-icon" /> Client Details
              </h2>

              <form id="clientForm" onSubmit={handleSubmit}>
                {/* Line 1: Name, Company Name */}
                <div className="form-group date-group">
                  <div>
                    <label htmlFor="name" className="required">
                      Name
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Client name"
                        value={currentFormData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyName" className="required">
                      Company Name
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        placeholder="Company name"
                        value={currentFormData.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Line 2: Contact, Email */}
                <div className="form-group date-group">
                  <div>
                    <label htmlFor="contact" className="required">
                      Contact
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        placeholder="Phone number"
                        value={currentFormData.contact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="required">
                      Email
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="client@example.com"
                        value={currentFormData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Line 3: Address */}
                <div className="form-group">
                  <label htmlFor="address" className="required">
                    Address
                  </label>
                  <div className="input-with-icon address-input">
                    <textarea
                      id="address"
                      name="address"
                      placeholder="Full address"
                      value={currentFormData.address}
                      onChange={handleChange}
                      className="address-textarea"
                      required
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                  {!editMode && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      id="saveClientBtn"
                    >
                      <FaSave /> Save Client
                    </button>
                  )}

                  {editMode && (
                    <button
                      type="submit"
                      className="btn btn-secondary"
                      id="updateClientBtn"
                    >
                      <FaEdit /> Update Client
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="resetClientBtn"
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

export default ClientForm;
