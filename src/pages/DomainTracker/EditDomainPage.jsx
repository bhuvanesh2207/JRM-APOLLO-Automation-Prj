import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import api from "../../api/axios";

const EditDomainPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const today = new Date();
  const minPurchaseDate = "2000-01-01";
  const maxPurchaseDate = today.toISOString().split("T")[0];

  const [selectedOption, setSelectedOption] = useState("update-info");
  const [formData, setFormData] = useState({
    domainName: "",
    registrar: "",
    clientName: "",
    activeStatus: "active",
    purchaseDate: "",
    expiryDate: "",
    sshName: "",
    sshPurchaseDate: "",
    sshExpiryDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------- Fetch Domain Details ---------
  const fetchDomainDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/domain/get/${id}/`);
      const data = res.data;

      setFormData({
        domainName: data.domain_name || "",
        registrar: data.registrar || "",
        clientName: data.client_name || "",
        activeStatus: data.active_status ? "active" : "inactive",
        purchaseDate: data.purchase_date || "",
        expiryDate: data.expiry_date || "",
        sshName: data.ssh_name || "",
        sshPurchaseDate: data.ssh_purchase_date || "",
        sshExpiryDate: data.ssh_expiry_date || "",
      });
    } catch (err) {
      setError("Failed to fetch domain details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --------- Submit Handlers ---------
  const handleSubmitUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        domain_name: formData.domainName,
        registrar: formData.registrar,
        client_name: formData.clientName,
        active_status: formData.activeStatus,
        changes_message: "Updated domain information",
      };
      const res = await api.patch(`/api/domain/update/${id}/`, payload);
      alert(res.data.message || "Domain information updated!");
    } catch {
      alert("Server error. Could not update domain info.");
    }
  };

  const handleSubmitDomainPlan = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        purchase_date: formData.purchaseDate,
        expiry_date: formData.expiryDate,
        changes_message: "Updated domain plan",
      };
      const res = await api.patch(`/api/domain/update/${id}/`, payload);
      alert(res.data.message || "Domain plan updated!");
    } catch {
      alert("Server error. Could not update domain plan.");
    }
  };

  const handleSubmitSSHPlan = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ssh_name: formData.sshName,
        ssh_purchase_date: formData.sshPurchaseDate,
        ssh_expiry_date: formData.sshExpiryDate,
        changes_message: "Updated SSH plan",
      };
      const res = await api.patch(`/api/domain/update/${id}/`, payload);
      alert(res.data.message || "SSH plan updated!");
    } catch {
      alert("Server error. Could not update SSH plan.");
    }
  };

  if (loading) return <div>Loading domain details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

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

              {/* Tabs */}
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
                  Update domain info
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedOption("upgrade-domain")}
                >
                  Upgrade domain plan
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedOption("upgrade-ssh")}
                >
                  Upgrade SSH plan
                </button>
              </div>

              {/* Forms */}
              {selectedOption === "update-info" && (
                <form onSubmit={handleSubmitUpdateInfo}>
                  <div className="form-group">
                    <label>Domain Name</label>
                    <input
                      name="domainName"
                      value={formData.domainName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Registrar</label>
                    <input
                      name="registrar"
                      value={formData.registrar}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Client Name</label>
                    <input
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="activeStatus"
                          value="active"
                          checked={formData.activeStatus === "active"}
                          onChange={handleChange}
                        />{" "}
                        Active
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="activeStatus"
                          value="inactive"
                          checked={formData.activeStatus === "inactive"}
                          onChange={handleChange}
                        />{" "}
                        Inactive
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-secondary">
                    <FaEdit /> Update Info
                  </button>
                </form>
              )}

              {selectedOption === "upgrade-domain" && (
                <form onSubmit={handleSubmitDomainPlan}>
                  <div className="form-group">
                    <label>Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      min={minPurchaseDate}
                      max={maxPurchaseDate}
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      min={formData.purchaseDate || minPurchaseDate}
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary">
                    <FaEdit /> Update Domain Plan
                  </button>
                </form>
              )}

              {selectedOption === "upgrade-ssh" && (
                <form onSubmit={handleSubmitSSHPlan}>
                  <div className="form-group">
                    <label>SSH Name</label>
                    <input
                      name="sshName"
                      value={formData.sshName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>SSH Purchase Date</label>
                    <input
                      type="date"
                      name="sshPurchaseDate"
                      min={minPurchaseDate}
                      max={maxPurchaseDate}
                      value={formData.sshPurchaseDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>SSH Expiry Date</label>
                    <input
                      type="date"
                      name="sshExpiryDate"
                      min={formData.sshPurchaseDate || minPurchaseDate}
                      value={formData.sshExpiryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary">
                    <FaEdit /> Update SSH Plan
                  </button>
                </form>
              )}

              <button
                type="button"
                className="btn btn-back"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft /> Back
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditDomainPage;
