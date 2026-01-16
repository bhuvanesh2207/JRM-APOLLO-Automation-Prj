// src/components/AutoBreadcrumb.jsx
import React from "react";
import { useLocation, matchPath, Link } from "react-router-dom";

// ---------- Breadcrumb Map ----------
const breadcrumbMap = {
  "/domain/all": [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Domains" },
  ],
  "/domain/new": [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Domains", path: "/domain/all" },
    { label: "New Domain" },
  ],
  "/domain/update/:id": [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Domains", path: "/domain/all" },
    { label: "Edit Domain" },
  ],
  "/domain/history": [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Domains", path: "/domain/all" },
    { label: "Domain History" },
  ],
  "/domain/history/:domainId": [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Domains", path: "/domain/all" },
    { label: "Domain History" },
  ],
  "/client/all": [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Clients" },
  ],
  "/client/new": [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Clients", path: "/client/all" },
    { label: "New Client" },
  ],
  "/client/update/:id": [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Clients", path: "/client/all" },
    { label: "Edit Client" },
  ],
};

// ---------- Breadcrumb Component ----------
const Breadcrumb = ({ items }) => {
  const displayItems = items;

  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex flex-wrap list-none p-0 m-0 drop-shadow-sm filter">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;

          return (
            <li key={index} className="breadcrumb-arrow">
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="text-white hover:text-gray-100 no-underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// ---------- AutoBreadcrumb Component ----------
const AutoBreadcrumb = ({ dynamicLabelMap = {} }) => {
  const location = useLocation();

  // Find the first matching route in the map
  const matchedEntry = Object.entries(breadcrumbMap).find(([path]) =>
    matchPath({ path, end: true }, location.pathname)
  );

  if (!matchedEntry) return null;

  let [, items] = matchedEntry;

  // Replace dynamic labels if provided
  items = items.map((item) =>
    dynamicLabelMap[item.label]
      ? { ...item, label: dynamicLabelMap[item.label] }
      : item
  );

  return <Breadcrumb items={items} />;
};

export default AutoBreadcrumb;
