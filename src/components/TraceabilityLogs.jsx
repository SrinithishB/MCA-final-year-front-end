import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/logs.css";

const TraceabilityLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/traceability/logs?limit=100");
        setLogs(res.data.logs || []);
      } catch {
        alert("Failed to load traceability logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p className="info">Loading traceability logs...</p>;

  return (
    <div className="logs-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Traceability Logs</h2>
      </div>

      {logs.length === 0 ? (
        <p className="info">No traceability logs found</p>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>RFID Tag</th>
              <th>Drug Name</th>
              <th>Batch</th>
              <th>Reader</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.rfidTag}</td>
                <td>{log.drugName}</td>
                <td>{log.batchNumber}</td>
                <td>{log.readerID}</td>
                <td>{log.location}</td>
                <td>
                  <span className={log.isCompromised ? "status compromised" : "status safe"}>
                    {log.isCompromised ? "Compromised" : "Safe"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TraceabilityLogs;
