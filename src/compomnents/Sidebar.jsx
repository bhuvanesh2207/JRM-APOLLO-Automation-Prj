// Sidebar.jsx
import React, { useEffect, useState } from "react";
import {
  MdLayers,
  MdDashboard,
  MdExpandMore,
  MdPerson,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import "../assets/css/index.css";

const MENU_ITEMS = [
  {
    label: "JRM INFOTECH",
    icon: MdLayers,
    children: [
      {
        label: "CLIENT",
        children: [{ label: "Add Client", href: "/client/new" }],
      },
      {
        label: "DOMIAN TRACKER",
        children: [
          { label: "Add Domain", href: "/domain/new" },
          { label: "All Doamins", href: "/domain/all" },
          { label: "Domain History", href: "/domain/history" },
        ],
      },
    ],
  },
  {
    label: "APOLLO",
    icon: MdDashboard,
    children: [
      { label: "Students Detail", href: "/apollo/students-detail" },
      {
        label: "Domain Tracker",
        children: [
          { label: "Table", href: "/apollo/domain-tracker" },
          { label: "Form", href: "/apollo/domain-tracker/form" },
        ],
      },
    ],
  },
];

// Build initial open/closed state for all items that have children
const buildInitialOpenMenus = (items, parentKey = "") => {
  const state = {};
  items.forEach((item) => {
    const key = parentKey ? `${parentKey}/${item.label}` : item.label;
    if (item.children && item.children.length) {
      state[key] = false;
      Object.assign(state, buildInitialOpenMenus(item.children, key));
    }
  });
  return state;
};

function Sidebar() {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [openMenus, setOpenMenus] = useState(() =>
    buildInitialOpenMenus(MENU_ITEMS)
  );

  const isExpanded = isPinned || isHovering;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("sidebarPinned");
    if (stored === "true") setIsPinned(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("sidebarPinned", isPinned ? "true" : "false");
  }, [isPinned]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentPath = window.location.pathname;
    document.querySelectorAll(".sidebar-menu a.menu-link").forEach((el) => {
      if (el.getAttribute("href") === currentPath) {
        el.classList.add("active");
      }
    });
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      setOpenMenus((prev) => {
        const closed = {};
        Object.keys(prev).forEach((k) => (closed[k] = false));
        return closed;
      });
    }
  }, [isExpanded]);

  useEffect(() => {
    const width = isExpanded ? "240px" : "70px";
    document.documentElement.style.setProperty(
      "--sidebar-current-width",
      width
    );
  }, [isExpanded]);

  const handleMouseEnter = () => {
    if (!isPinned) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) setIsHovering(false);
  };

  const handlePinToggle = () => {
    setIsPinned((prev) => !prev);
  };

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMenuItems = (items, parentKey = "") =>
    items.map((item) => {
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      const key = parentKey ? `${parentKey}/${item.label}` : item.label;
      const isOpen = !!openMenus[key];
      const isTopLevel = !parentKey;
      const Icon = item.icon;

      return (
        <li
          key={key}
          className={"menu-item" + (isOpen ? " menu-item--open" : "")}
        >
          <a
            href={hasChildren ? undefined : item.href}
            className="menu-link"
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                toggleMenu(key);
              }
            }}
          >
            {isTopLevel && Icon && <Icon className="menu-icon" />}

            <span className="menu-text">{item.label}</span>

            {hasChildren ? <MdExpandMore className="menu-arrow" /> : null}
          </a>

          {hasChildren ? (
            <ul
              className={
                "sub-menu " + (isExpanded && isOpen ? "sub-menu--open" : "")
              }
            >
              {renderMenuItems(item.children, key)}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    <aside
      className={
        "app-menu " +
        (isExpanded ? "app-menu--expanded" : "app-menu--collapsed") +
        (isPinned ? " app-menu--pinned" : "")
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="logo-box">
        <a href="/admin-dashboard" className="logo">
          <span className="logo-icon-circle">
            <MdPerson className="logo-icon-person" />
          </span>
          <span className="logo-text">
            Admin <br />
            Dashboard
          </span>
        </a>

        {isExpanded && (
          <button
            type="button"
            onClick={handlePinToggle}
            className={
              "sidebar-pin-btn" + (isPinned ? " sidebar-pin-btn--active" : "")
            }
            aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            {isPinned ? (
              <MdChevronLeft className="sidebar-pin-icon" />
            ) : (
              <MdChevronRight className="sidebar-pin-icon" />
            )}
          </button>
        )}
      </div>

      <div className="scrollbar">
        <ul className="menu sidebar-menu">{renderMenuItems(MENU_ITEMS)}</ul>
      </div>
    </aside>
  );
}

export default Sidebar;
