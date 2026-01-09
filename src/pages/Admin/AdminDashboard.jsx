// AdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../compomnents/Navbar";
import Sidebar from "../../compomnents/Sidebar";
import Footer from "../../compomnents/Footer";

// Example images – replace with your real file paths
import BannerImage from "../../assets/images/Automation.jpg";

// JRM card images
import JrmImg1 from "../../assets/images/DomainTraker.avif";
import JrmImg2 from "../../assets/images/DomainTraker.avif";
import JrmImg3 from "../../assets/images/DomainTraker.avif";

// Apollo card images
import ApolloImg1 from "../../assets/images/DomainTraker.avif";
import ApolloImg2 from "../../assets/images/DomainTraker.avif";
import ApolloImg3 from "../../assets/images/DomainTraker.avif";

// change their titles / images.
const CARD_DATA = {
  JRM: [
    { id: "j1", title: "Domain Tracker", image: JrmImg1, path: "/domain/all" },
    { id: "j2", title: "JRM Card 2", image: JrmImg2, path: "/jrm/card-2" },
    { id: "j3", title: "JRM Card 3", image: JrmImg3, path: "/jrm/card-3" },
  ],

  Apollo: [
    {
      id: "a1",
      title: "Apollo Card 1",
      image: ApolloImg1,
      path: "/apollo/domain-tracker",
    },
    {
      id: "a2",
      title: "Apollo Card 2",
      image: ApolloImg2,
      path: "/apollo/card-2",
    },
    {
      id: "a3",
      title: "Apollo Card 3",
      image: ApolloImg3,
      path: "/apollo/card-3",
    },
  ],
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("JRM");
  const navigate = useNavigate();

  // cards for current tab
  const cards = CARD_DATA[activeTab] || [];

  return (
    <div
      className="min-h-screen "
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
            <section className="dashboard-wrapper">
              {/* Top image / banner */}
              <div className="dashboard-hero">
                <img
                  src={BannerImage}
                  alt="Dashboard banner"
                  className="dashboard-hero-image"
                />
              </div>

              <section className="dashboard-section">
                {/* Tabs */}
                <div className="dashboard-tabs-wrapper">
                  <div className="dashboard-tabs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("JRM")}
                      className={
                        "dashboard-tab" +
                        (activeTab === "JRM" ? " dashboard-tab--active" : "")
                      }
                    >
                      JRM
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("Apollo")}
                      className={
                        "dashboard-tab" +
                        (activeTab === "Apollo" ? " dashboard-tab--active" : "")
                      }
                    >
                      Apollo
                    </button>
                  </div>
                </div>

                {/* Cards */}
                <div className="dashboard-card-grid">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={
                        "dashboard-card " +
                        (activeTab === "JRM"
                          ? "dashboard-card--jrm"
                          : "dashboard-card--apollo")
                      }
                      onClick={() => navigate(card.path)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="dashboard-card-image">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="dashboard-card-image-el"
                        />
                      </div>

                      <div className="dashboard-card-title-wrapper">
                        <span className="dashboard-card-title">
                          {card.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
