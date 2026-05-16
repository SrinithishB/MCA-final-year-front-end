import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/viewDrugs.css";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";

const ViewDrugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/drugs")
      .then((res) => setDrugs(res.data.drugs || []))
      .catch(() => setError("Failed to load drugs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Drug Registry</h2>
        {!loading && !error && (
          <span className="record-count">{drugs.length} records</span>
        )}
      </header>

      <div className="page-body">
        {loading ? (
          <div className="state-msg"><div className="spinner" />Loading drug registry...</div>
        ) : error ? (
          <div className="state-msg" style={{ color: "var(--danger)" }}>{error}</div>
        ) : drugs.length === 0 ? (
          <div className="state-msg">No drugs found in registry</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>RFID Tag</th>
                <th>Drug Name</th>
                <th>Batch</th>
                <th>Manufacturer</th>
                <th>Manufactured</th>
                <th>Expires</th>
                <th>Cold Storage</th>
                <th>Limits</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {drugs.map((drug) => {
                const expired = drug.expiryDate && new Date(drug.expiryDate) < new Date();
                const status = expired ? "expired" : drug.isCompromised ? "compromised" : "safe";
                return (
                  <tr key={drug._id}>
                    <td><code>{drug.rfidTag}</code></td>
                    <td className="drug-name">{drug.drugName}</td>
                    <td><span className="mono">{drug.batchNumber}</span></td>
                    <td>{drug.manufacturerName}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmt(drug.manufactureDate)}</td>
                    <td className={expired ? "expired-cell" : ""} style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {fmt(drug.expiryDate)}
                    </td>
                    <td style={{ color: drug.requiresColdStorage ? "#60a5fa" : "var(--text-muted)" }}>
                      {drug.requiresColdStorage ? "Yes" : "No"}
                    </td>
                    <td>
                      {drug.requiresColdStorage
                        ? <span className="limits-text">{drug.temperatureMin}–{drug.temperatureMax}°C · ≤{drug.humidityMax}%</span>
                        : <span style={{ color: "var(--text-faint)" }}>—</span>}
                    </td>
                    <td>
                      <span className={`badge ${status}`}>
                        {status === "safe" ? "✓ Safe" : status === "expired" ? "⚠ Expired" : "⚠ Compromised"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewDrugs;
