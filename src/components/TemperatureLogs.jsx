import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/logs.css";

const TemperatureLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/temperature/logs?limit=100");
        setLogs(res.data.logs || []);
      } catch {
        alert("Failed to load temperature logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p className="info">Loading temperature logs...</p>;

  return (
    <div className="logs-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Temperature Logs</h2>
      </div>

      {logs.length === 0 ? (
        <p className="info">No temperature logs found</p>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Temperature (°C)</th>
              <th>Humidity (%)</th>
              <th>RFID Tag</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.temperature}</td>
                <td>{log.humidity}</td>
                <td>{log.rfidTag || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TemperatureLogs;
