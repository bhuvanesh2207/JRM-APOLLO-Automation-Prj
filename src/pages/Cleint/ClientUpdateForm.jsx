import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserPlus, FaEdit, FaRedo } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import api from "../../api/axios";

const ClientUpdateForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // client ID from route

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    companyName: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // -------- Fetch existing client data --------
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await api.get(`/api/client/get/${id}/`);
        setFormData({
          name: res.data.name,
          contact: res.data.contact,
          email: res.data.email,
          companyName: res.data.companyName,
          address: res.data.address,
        });
      } catch (err) {
        alert(err.response?.data?.error || "Failed to fetch client details");
        navigate("/client/all"); // Go back if error
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClient();
  }, [id, navigate]);

  // -------- Form handlers --------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        contact: formData.contact,
        email: formData.email,
        company_name: formData.companyName,
        address: formData.address,
      };

      await api.put(`/api/client/update/${id}/`, payload);

      alert("Client updated successfully");
      navigate("/client/all"); // back to client table
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update client");
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
                <FaUserPlus className="domain-icon" /> Update Client
              </h2>

              {loading ? (
                <div>Loading client details...</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Line 1: Name & Company Name */}
                  <div className="form-group date-group">
                    <div>
                      <label htmlFor="name" className="required">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Client name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="companyName" className="required">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        placeholder="Company name"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Line 2: Contact & Email */}
                  <div className="form-group date-group">
                    <div>
                      <label htmlFor="contact" className="required">
                        Contact
                      </label>
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        placeholder="Phone number"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="required">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="client@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Line 3: Address */}
                  <div className="form-group">
                    <label htmlFor="address" className="required">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      placeholder="Full address"
                      value={formData.address}
                      onChange={handleChange}
                      className="address-textarea"
                      required
                    />
                  </div>

                  {/* Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn btn-secondary">
                      <FaEdit /> Update Client
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
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientUpdateForm;
