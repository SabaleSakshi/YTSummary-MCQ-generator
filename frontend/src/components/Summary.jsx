import React from "react";

const Summary = ({ summary }) => {
  return (
    <div className="summary-section">
      <h2>📝 Video Summary</h2>
      <div className="summary-content">
        {typeof summary === "string" ? (
          <div className="summary-item">
            <p>{summary}</p>
          </div>
        ) : Array.isArray(summary) ? (
          summary.map((item, index) => (
            <div key={index} className="summary-item">
              <p>{item}</p>
            </div>
          ))
        ) : (
          <div className="summary-item">
            <p>No summary available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
