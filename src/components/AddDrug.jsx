import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/addDrug.css";

const AddDrug = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rfidTag: "",
    drugName: "",
    batchNumber: "",
    manufacturerName: "",
    description: "",
    manufactureDate: "",
    expiryDate: "",
    requiresColdStorage: false,
    temperatureMin: "",
    temperatureMax: "",
    humidityMax: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Build payload dynamically
    const payload = { ...form };

    if (!form.requiresColdStorage) {
      delete payload.temperatureMin;
      delete payload.temperatureMax;
      delete payload.humidityMax;
    }

    try {
      const res = await api.post("/drugs", payload);

      if (res.data.success) {
        setMessage("✅ Drug added successfully");
        setForm({
          rfidTag: "",
          drugName: "",
          batchNumber: "",
          manufacturerName: "",
          description: "",
          manufactureDate: "",
          expiryDate: "",
          requiresColdStorage: false,
          temperatureMin: "",
          temperatureMax: "",
          humidityMax: "",
        });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        alert("⚠️ RFID tag already exists");
      } else {
        setMessage(`❌ ${err.response?.data?.message || "Failed to add drug"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Add Drug</h2>
      </div>

      {/* Form */}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>RFID Tag</label>
            <input name="rfidTag" value={form.rfidTag} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Drug Name</label>
            <input name="drugName" value={form.drugName} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Batch Number</label>
            <input name="batchNumber" value={form.batchNumber} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Manufacturer Name</label>
            <input name="manufacturerName" value={form.manufacturerName} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
          </div>

          <div className="form-row">
            <label>Manufacture Date</label>
            <input type="date" name="manufactureDate" value={form.manufactureDate} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Expiry Date</label>
            <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />
          </div>

          {/* Cold Storage Toggle */}
          <div className="form-row checkbox-row">
            <input
              type="checkbox"
              name="requiresColdStorage"
              checked={form.requiresColdStorage}
              onChange={handleChange}
            />
            <label>Requires Cold Storage</label>
          </div>

          {/* 🔥 Conditional Cold Storage Parameters */}
          {form.requiresColdStorage && (
            <>
              <div className="form-row">
                <label>Min Temperature (°C)</label>
                <input
                  type="number"
                  name="temperatureMin"
                  value={form.temperatureMin}
                  onChange={handleChange}
                  step="0.1"
                  required
                />
              </div>

              <div className="form-row">
                <label>Max Temperature (°C)</label>
                <input
                  type="number"
                  name="temperatureMax"
                  value={form.temperatureMax}
                  onChange={handleChange}
                  step="0.1"
                  required
                />
              </div>

              <div className="form-row">
                <label>Max Humidity (%)</label>
                <input
                  type="number"
                  name="humidityMax"
                  value={form.humidityMax}
                  onChange={handleChange}
                  step="1"
                  required
                />
              </div>
            </>
          )}

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Drug"}
            </button>

            <button type="button" className="cancel-btn" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AddDrug;
