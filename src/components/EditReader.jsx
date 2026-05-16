import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/addReader.css";

const EditReader = () => {
  const { readerId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    api.get(`/readers/${readerId}`)
      .then((res) => {
        setLocation(res.data.reader.location);
        setCity(res.data.reader.city || "");
        setIsActive(res.data.reader.isActive);
      })
      .catch(() => {
        alert("Reader not found");
        navigate("/readers");
      })
      .finally(() => setFetchLoading(false));
  }, [readerId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/readers/${readerId}`, { location, city, isActive });
      navigate("/readers");
    } catch {
      alert("Failed to update reader");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/readers")}>← Back</button>
        <h2>Edit Reader</h2>
        {!fetchLoading && <span className="record-count">{readerId}</span>}
      </header>

      <div className="page-body narrow">
        {fetchLoading ? (
          <div className="state-msg"><div className="spinner" />Loading reader...</div>
        ) : (
          <div className="card">
            <form onSubmit={handleUpdate}>
              <p className="form-section-title">Reader Details</p>
              <div className="form-group">
                <label>Reader ID</label>
                <input type="text" value={readerId} disabled />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Chennai" required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={isActive} onChange={(e) => setIsActive(e.target.value === "true")}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="btn-group">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/readers")}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditReader;
