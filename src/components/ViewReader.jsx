import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/viewReaders.css";

const Row = ({ label, children }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
    <span style={{ width: 140, flexShrink: 0, fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", paddingTop: 2 }}>{label}</span>
    <span style={{ fontSize: 14 }}>{children}</span>
  </div>
);

const ViewReader = () => {
  const { readerId } = useParams();
  const navigate = useNavigate();
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/readers/${readerId}`)
      .then((res) => setReader(res.data.reader))
      .catch(() => { alert("Reader not found"); navigate("/readers"); })
      .finally(() => setLoading(false));
  }, [readerId, navigate]);

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/readers")}>← Back</button>
        <h2>Reader Details</h2>
      </header>

      <div className="page-body narrow">
        {loading ? (
          <div className="state-msg"><div className="spinner" />Loading...</div>
        ) : reader && (
          <div className="card">
            <Row label="Reader ID"><code>{reader.readerId}</code></Row>
            <Row label="Location">{reader.location}</Row>
            <Row label="City">{reader.city}</Row>
            <Row label="Status">
              <span className={`badge ${reader.isActive ? "active" : "inactive"}`}>
                {reader.isActive ? "● Active" : "○ Inactive"}
              </span>
            </Row>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={() => navigate(`/readers/edit/${reader.readerId}`)}>
                Edit Reader
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("/readers")}>
                Back to List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReader;
