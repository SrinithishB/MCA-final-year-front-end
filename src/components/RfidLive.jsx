import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import WebDashboard from "./WebDashboard";
import "../css/rfidScan.css";
import "../css/logs.css";

const RfidLive = () => {
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [logs, setLogs] = useState([]);

  const fetchLatestScan = async () => {
    try {
      const res = await api.get("/rfid/latest");
      setScan(res.data.scan);
    } catch {
      setScan(null);
      setLogs([]);
    }
  };

  const fetchTraceLogs = async (rfidTag) => {
    try {
      const res = await api.get(`/traceability/logs/${rfidTag}`);
      setLogs(res.data.logs);
    } catch {
      setLogs([]);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchLatestScan, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scan?.rfidTag && scan.drugName !== "UNKNOWN") {
      fetchTraceLogs(scan.rfidTag);
    } else {
      setLogs([]);
    }
  }, [scan?.rfidTag]);

  const isCounterfeit = scan?.event === "COUNTERFEIT_DETECTED" || scan?.drugName === "UNKNOWN";
  const isDanger = isCounterfeit || scan?.isCompromised;

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Live RFID Monitor</h2>
        <div className="live-indicator">
          <span className="live-dot" />
          Live
        </div>
      </header>

      <div className="page-body" style={{ maxWidth: 1400 }}>

        {/* ── Waiting state ── */}
        {!scan && (
          <div className="state-msg">
            <div className="spinner" />
            Waiting for RFID scan...
          </div>
        )}

        {/* ── Everything below only renders after a scan ── */}
        {scan && (
          <>
            {/* Scan status banner */}
            <div className={`scan-status-card ${isDanger ? "danger" : "safe"}`}>
              <div className="status-label">Scan Result</div>
              <div className="status-title">
                {isCounterfeit
                  ? "⚠ Counterfeit Medicine Detected"
                  : scan.isCompromised
                  ? "⚠ Drug Compromised"
                  : "✓ Drug Safe"}
              </div>
              <div className="scan-meta">
                <div className="scan-meta-item">
                  <div className="meta-label">RFID Tag</div>
                  <div className="meta-value">{scan.rfidTag}</div>
                </div>
                <div className="scan-meta-item">
                  <div className="meta-label">Drug Name</div>
                  <div className="meta-value">
                    {isCounterfeit ? "Unknown / Unregistered" : scan.drugName}
                  </div>
                </div>
                <div className="scan-meta-item">
                  <div className="meta-label">Location</div>
                  <div className="meta-value">{scan.location}</div>
                </div>
                {scan.event && (
                  <div className="scan-meta-item">
                    <div className="meta-label">Event</div>
                    <div className="meta-value" style={{ fontSize: 11 }}>{scan.event}</div>
                  </div>
                )}
                {scan.temperatureMin != null && (
                  <div className="scan-meta-item">
                    <div className="meta-label">Safe Temp Range</div>
                    <div className="meta-value">{scan.temperatureMin}°C – {scan.temperatureMax}°C</div>
                  </div>
                )}
              </div>
            </div>

            {/* Drug temperature dashboard — only for known, non-counterfeit drugs */}
            {!isCounterfeit && (
              <div style={{ marginTop: 24 }}>
                <p className="section-title">Drug Temperature Dashboard</p>
                <WebDashboard scan={scan} />
              </div>
            )}

            {/* Traceability log */}
            {!isCounterfeit && (
              <div className="card" style={{ marginTop: 20 }}>
                <div className="trace-section-title">
                  Traceability Log — {scan.rfidTag}
                </div>
                {logs.length === 0 ? (
                  <div className="state-msg" style={{ padding: "28px 0" }}>
                    No movement history recorded
                  </div>
                ) : (
                  <table className="data-table" style={{ border: "none", borderRadius: 0 }}>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Reader ID</th>
                        <th>Location</th>
                        <th>City</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                            {new Date(log.timestamp * 1000).toLocaleString()}
                          </td>
                          <td><code>{log.readerID}</code></td>
                          <td>{log.location}</td>
                          <td>{log.city || "Chennai"}</td>
                          <td>
                            <span className={`badge ${log.violated ? "compromised" : "safe"}`}>
                              {log.violated ? "⚠ Compromised" : "✓ Safe"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RfidLive;
