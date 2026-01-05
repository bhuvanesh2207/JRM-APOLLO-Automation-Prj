// Sidebar.jsx
import React, { useEffect, useState } from "react";
import "../assets/css/index.css";

const MENU_ITEMS = [
  {
    label: "JRM INFOTECH",
    icon: "layers",
    children: [
      {
        label: "CLIENT",
        children: [{ label: "Add Client", href: "/new-client" }],
      },
      {
        label: "DOMIAN TRACKER",
        children: [
          {
            label: "Add Domain",
            href: "/new-domain", // grandchild -> href
          },
          {
            label: "All Doamins",
            href: "/all-domains", // grandchild -> href
          },
          {
            label: "Domain History",
            href: "/updated-history", // grandchild -> href
          },
        ],
      },
    ],
  },
  {
    label: "APOLLO",
    icon: "dashboard",
    children: [
      {
        label: "Students Detail",
        href: "/apollo/students-detail",
      },
      {
        label: "Domain Tracker",
        children: [
          {
            label: "Table",
            href: "/apollo/domain-tracker",
          },
          {
            label: "Form",
            href: "/apollo/domain-tracker/form",
          },
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
      state[key] = false; // closed by default
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

    // keep same selector & .active logic
    document.querySelectorAll(".sidebar-menu a.menu-link").forEach((el) => {
      if (el.getAttribute("href") === currentPath) {
        el.classList.add("active");
      }
    });
  }, []);

  // Close all dropdowns when sidebar collapses
  useEffect(() => {
    if (!isExpanded) {
      setOpenMenus((prev) => {
        const closed = {};
        Object.keys(prev).forEach((k) => (closed[k] = false));
        return closed;
      });
    }
  }, [isExpanded]);

  // Update CSS variable for sidebar width to adjust navbar and main content
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

  // Recursive renderer: keeps same classes / structure
  const renderMenuItems = (items, parentKey = "") =>
    items.map((item) => {
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      const key = parentKey ? `${parentKey}/${item.label}` : item.label;
      const isOpen = !!openMenus[key];
      const isTopLevel = !parentKey; // only top-level shows icon

      return (
        <li
          key={key}
          className={"menu-item" + (isOpen ? " menu-item--open" : "")}
        >
          <a
            // only leaf items (no children) get href -> parent/child have no href
            href={hasChildren ? undefined : item.href}
            className="menu-link"
            onClick={(e) => {
              if (hasChildren) {
                // toggle submenu, don't navigate
                e.preventDefault();
                toggleMenu(key);
              }
            }}
          >
            {isTopLevel && item.icon && (
              <span className="menu-icon material-symbols-outlined">
                {item.icon}
              </span>
            )}

            <span className="menu-text">{item.label}</span>

            {hasChildren ? (
              <span className="menu-arrow material-symbols-outlined">
                expand_more
              </span>
            ) : null}
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
      {/* Logo row */}
      <div className="logo-box">
        <a href="/" className="logo">
          <span className="logo-icon-circle">
            <span className="material-symbols-outlined logo-icon-person">
              person
            </span>
          </span>{" "}
          <span className="logo-text">
            Admin <br />
            Dashboard
          </span>
        </a>

        {/* Show > or < only when sidebar is expanded (hovered or pinned) */}
        {isExpanded && (
          <button
            type="button"
            onClick={handlePinToggle}
            className={
              "sidebar-pin-btn" + (isPinned ? " sidebar-pin-btn--active" : "")
            }
            aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <span className="material-symbols-outlined sidebar-pin-icon">
              {isPinned ? "chevron_left" : "chevron_right"}
            </span>
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="scrollbar">
        <ul className="menu sidebar-menu">{renderMenuItems(MENU_ITEMS)}</ul>
      </div>
    </aside>
  );
}

export default Sidebar;
