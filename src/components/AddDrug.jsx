import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/addDrug.css";

const INITIAL = {
  rfidTag: "", drugName: "", batchNumber: "", manufacturerName: "",
  description: "", manufactureDate: "", expiryDate: "",
  requiresColdStorage: false, temperatureMin: "", temperatureMax: "", humidityMax: "",
};

const AddDrug = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const payload = { ...form };
    if (!form.requiresColdStorage) {
      delete payload.temperatureMin;
      delete payload.temperatureMax;
      delete payload.humidityMax;
    }
    try {
      const res = await api.post("/drugs", payload);
      if (res.data.success) {
        setMessage({ type: "success", text: "Drug registered successfully" });
        setForm(INITIAL);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage({ type: "error", text: "RFID tag already exists in system" });
      } else {
        setMessage({ type: "error", text: err.response?.data?.message || "Failed to register drug" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Register Drug</h2>
      </header>

      <div className="page-body narrow">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <p className="form-section-title">Identification</p>
            <div className="form-group">
              <label>RFID Tag</label>
              <input name="rfidTag" value={form.rfidTag} onChange={handleChange} placeholder="e.g. RFID_001" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Drug Name</label>
                <input name="drugName" value={form.drugName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Batch Number</label>
                <input name="batchNumber" value={form.batchNumber} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Manufacturer</label>
              <input name="manufacturerName" value={form.manufacturerName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description <span style={{ color: "var(--text-faint)", fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="2" placeholder="Optional notes about this drug batch..." />
            </div>

            <p className="form-section-title">Dates</p>
            <div className="form-row">
              <div className="form-group">
                <label>Manufacture Date</label>
                <input type="date" name="manufactureDate" value={form.manufactureDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />
              </div>
            </div>

            <p className="form-section-title">Storage Requirements</p>
            <div className="checkbox-group">
              <input type="checkbox" id="coldStorage" name="requiresColdStorage" checked={form.requiresColdStorage} onChange={handleChange} />
              <label htmlFor="coldStorage">Requires Cold Storage</label>
            </div>

            {form.requiresColdStorage && (
              <div className="form-row" style={{ marginTop: 12 }}>
                <div className="form-group">
                  <label>Min Temperature (°C)</label>
                  <input type="number" name="temperatureMin" value={form.temperatureMin} onChange={handleChange} step="0.1" required />
                </div>
                <div className="form-group">
                  <label>Max Temperature (°C)</label>
                  <input type="number" name="temperatureMax" value={form.temperatureMax} onChange={handleChange} step="0.1" required />
                </div>
                <div className="form-group">
                  <label>Max Humidity (%)</label>
                  <input type="number" name="humidityMax" value={form.humidityMax} onChange={handleChange} step="1" required />
                </div>
              </div>
            )}

            <div className="btn-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Registering..." : "Register Drug"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
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

export default AddDrug;
