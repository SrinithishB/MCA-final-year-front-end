import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/logs.css";

const TraceabilityLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/traceability/logs?limit=100")
      .then((res) => setLogs(res.data.logs || []))
      .catch(() => alert("Failed to load traceability logs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Traceability Logs</h2>
        {!loading && <span className="record-count">{logs.length} records</span>}
      </header>

      <div className="page-body">
        {loading ? (
          <div className="state-msg"><div className="spinner" />Loading traceability logs...</div>
        ) : logs.length === 0 ? (
          <div className="state-msg">No traceability logs found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>RFID Tag</th>
                <th>Drug Name</th>
                <th>Batch</th>
                <th>Reader</th>
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
                  <td><code>{log.rfidTag}</code></td>
                  <td style={{ fontWeight: 600 }}>{log.drugName}</td>
                  <td><span className="mono">{log.batchNumber}</span></td>
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
    </div>
  );
};

export default TraceabilityLogs;
