import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/addReader.css";

const EditReader = () => {
  const { readerId } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReader = async () => {
      try {
        const res = await api.get(`/readers/${readerId}`);
        setLocation(res.data.reader.location);
        setIsActive(res.data.reader.isActive);
      } catch {
        alert("Reader not found");
        navigate("/readers");
      }
    };

    fetchReader();
  }, [readerId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/readers/${readerId}`, {
        location,
        isActive,
      });

      alert("✅ Reader updated successfully");
      navigate("/readers");
    } catch {
      alert("❌ Failed to update reader");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/readers")}>
          ← Back
        </button>
        <h2>Edit Reader</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleUpdate}>
          <div className="form-row">
            <label>Reader ID</label>
            <input type="text" value={readerId} disabled />
          </div>

          <div className="form-row">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Status</label>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value === "true")}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Reader"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/readers")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReader;
