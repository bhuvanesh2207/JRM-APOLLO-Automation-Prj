// Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import "../assets/css/index.css";
import Admin from "../assets/images/Admin.avif";

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const profileItems = [{ icon: "logout", label: "Logout", href: "#" }];

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Left: Search */}
        <div className="topbar-left">
          <div className="topbar-search">
            <FaSearch className="topbar-search-icon" />
            <input
              type="search"
              className="topbar-search-input"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Right: profile only */}
        <div className="topbar-right">
          <div className="topbar-divider" />

          {/* Profile + dropdown */}
          <div className="topbar-profile-wrapper" ref={profileRef}>
            <img src={Admin} alt="user" className="topbar-profile-avatar" />

            <button
              type="button"
              className="topbar-profile"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
            >
              <div className="topbar-profile-info">
                <span className="topbar-profile-name">Admin</span>
              </div>
            </button>

            <div
              className={
                "profile-dropdown" +
                (isProfileOpen ? " profile-dropdown--open" : "")
              }
            >
              <div className="profile-dropdown-header">Welcome !</div>

              {profileItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="profile-dropdown-item"
                >
                  <FaSignOutAlt className="profile-dropdown-item-icon" />
                  <span className="profile-dropdown-item-label">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
