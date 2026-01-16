import React from "react";

const Popup = ({
  show,
  type = "info",
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}) => {
  if (!show) return null;

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  const handleBackdropClick = () => {
    // Only close on backdrop click if not a delete/confirmation popup
    if (type !== "delete" && !showCancel) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="popup-icon popup-icon--success">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="popup-icon popup-icon--error">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="popup-icon popup-icon--warning">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        );
      case "delete":
        return (
          <div className="popup-icon popup-icon--delete">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
        );
      default:
        return (
          <div className="popup-icon popup-icon--info">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="popup-backdrop" onClick={handleBackdropClick}>
      <div
        className={`popup-box popup-box--${type}`}
        onClick={handlePopupClick}
      >
        {/* Close Button - Hidden for delete confirmation */}
        {type !== "delete" && (
          <button
            className="popup-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {getIcon()}

        <div className="popup-content">
          <h3 className="popup-title">{title}</h3>
          <p className="popup-message">{message}</p>
        </div>

        <div className="popup-actions">
          {(showCancel || type === "delete") && (
            <button className="popup-btn popup-btn--cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button
            className={`popup-btn popup-btn--${type}`}
            onClick={onConfirm || onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
