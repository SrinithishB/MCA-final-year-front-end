import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/logs.css";

const TemperatureLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/temperature/logs?limit=100")
      .then((res) => setLogs(res.data.logs || []))
      .catch(() => alert("Failed to load temperature logs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Temperature Logs</h2>
        {!loading && <span className="record-count">{logs.length} records</span>}
      </header>

      <div className="page-body">
        {loading ? (
          <div className="state-msg"><div className="spinner" />Loading temperature logs...</div>
        ) : logs.length === 0 ? (
          <div className="state-msg">No temperature logs found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>Temperature (°C)</th>
                <th>Humidity (%)</th>
                <th>RFID Tag</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log._id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{String(i + 1).padStart(3, "0")}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", color: log.temperature > 30 ? "var(--danger)" : "var(--text)" }}>
                    {log.temperature}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{log.humidity}</td>
                  <td>
                    {log.rfidTag
                      ? <code>{log.rfidTag}</code>
                      : <span style={{ color: "var(--text-faint)" }}>—</span>}
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

export default TemperatureLogs;
