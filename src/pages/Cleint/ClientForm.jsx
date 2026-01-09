import React, { useState, useRef } from "react";
import { FaPlusCircle, FaSave, FaEdit, FaRedo } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import api from "../../api/axios";

const ClientForm = ({ editMode = false }) => {
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    companyName: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        contact: formData.contact,
        email: formData.email,
        company_name: formData.companyName, // ✅ FIX
        address: formData.address,
      };

      await api.post("/api/client/add/", payload);

      alert("Client created successfully");

      setFormData({
        name: "",
        contact: "",
        email: "",
        companyName: "",
        address: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create client");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      contact: "",
      email: "",
      companyName: "",
      address: "",
    });
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
                <FaPlusCircle className="domain-icon" /> Client Details
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Line 1 */}
                <div className="form-group date-group">
                  <div>
                    <label className="required">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="required">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Line 2 */}
                <div className="form-group date-group">
                  <div>
                    <label className="required">Contact</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="required">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="form-group">
                  <label className="required">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Actions */}
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <FaSave /> Save Client
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

export default ClientForm;
