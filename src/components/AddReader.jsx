import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/addReader.css";

const AddReader = () => {
  const [readerId, setReaderId] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/readers", {
        readerId,
        location,
      });

      if (response.data.success) {
        setMessage("✅ Reader added successfully");
        setReaderId("");
        setLocation("");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert("⚠️ Reader ID already exists");
      } else {
        setMessage("❌ Failed to add reader");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header (same style as ViewReaders) */}
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Add RFID Reader</h2>
      </div>

      {/* Card layout */}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Reader ID</label>
            <input
              type="text"
              value={readerId}
              onChange={(e) => setReaderId(e.target.value.toUpperCase())}
              placeholder="READER_004"
              required
            />
          </div>

          <div className="form-row">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Main Entrance"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Reader"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AddReader;
