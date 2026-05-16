import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/addReader.css";

const AddReader = () => {
  const navigate = useNavigate();
  const [readerId, setReaderId] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await api.post("/readers", { readerId, location, city });
      if (res.data.success) {
        setMessage({ type: "success", text: "Reader registered successfully" });
        setReaderId("");
        setLocation("");
        setCity("");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage({ type: "error", text: "Reader ID already exists" });
      } else {
        setMessage({ type: "error", text: "Failed to register reader" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Register Reader</h2>
      </header>

      <div className="page-body narrow">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <p className="form-section-title">Reader Information</p>
            <div className="form-group">
              <label>Reader ID</label>
              <input
                type="text"
                value={readerId}
                onChange={(e) => setReaderId(e.target.value.toUpperCase())}
                placeholder="e.g. READER_004"
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Entrance"
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Chennai"
                required
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Registering..." : "Register Reader"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/")} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
          {message && (
            <div className={`alert ${message.type}`}>
              {message.type === "success" ? "✓ " : "✕ "}{message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddReader;
