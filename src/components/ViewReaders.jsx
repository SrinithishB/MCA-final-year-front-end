import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/viewReaders.css";

const ViewReaders = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/readers")
      .then((res) => setReaders(res.data.readers || []))
      .catch(() => setError("Failed to load readers"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (readerId) => {
    if (!window.confirm(`Delete reader ${readerId}?`)) return;
    try {
      await api.delete(`/readers/${readerId}`);
      setReaders((prev) => prev.filter((r) => r.readerId !== readerId));
    } catch {
      alert("Failed to delete reader");
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>RFID Readers</h2>
        {!loading && !error && (
          <span className="record-count">{readers.length} readers</span>
        )}
      </header>

      <div className="page-body">
        {loading ? (
          <div className="state-msg"><div className="spinner" />Loading readers...</div>
        ) : error ? (
          <div className="state-msg" style={{ color: "var(--danger)" }}>{error}</div>
        ) : readers.length === 0 ? (
          <div className="state-msg">No RFID readers registered</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Reader ID</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {readers.map((reader, i) => (
                <tr key={reader._id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</td>
                  <td><code>{reader.readerId}</code></td>
                  <td>{reader.location}</td>
                  <td>
                    <span className={`badge ${reader.isActive ? "active" : "inactive"}`}>
                      {reader.isActive ? "● Active" : "○ Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/readers/view/${reader.readerId}`)}>View</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/readers/edit/${reader.readerId}`)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(reader.readerId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewReaders;
