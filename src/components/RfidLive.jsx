import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/rfidScan.css";

const RfidLive = () => {
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("Waiting for RFID scan...");

  const fetchLatestScan = async () => {
    try {
      const res = await api.get("/rfid/latest");
      setScan(res.data.scan);
      setMessage("");
    } catch {
      setScan(null);
      setLogs([]);
      setMessage("Waiting for RFID scan...");
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
  }, [scan]);

  const isCounterfeit =
    scan?.event === "COUNTERFEIT_DETECTED" ||
    scan?.drugName === "UNKNOWN";

  return (
    <div className="page-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Live RFID Monitor</h2>
      </div>

      {!scan ? (
        <p className="info">{message}</p>
      ) : (
        <>
          {/* STATUS CARD */}
          <div
            className={`result-card ${
              isCounterfeit || scan.isCompromised ? "error" : "success"
            }`}
          >
            <p>
              <strong>Status:</strong>{" "}
              {isCounterfeit
                ? "COUNTERFEIT MEDICINE"
                : scan.isCompromised
                ? "COMPROMISED"
                : "SAFE"}
            </p>

            <p><strong>RFID:</strong> {scan.rfidTag}</p>

            <p>
              <strong>Drug:</strong>{" "}
              {isCounterfeit ? "Unknown / Fake" : scan.drugName}
            </p>

            <p>
              <strong>Current Location:</strong> {scan.location}
            </p>
          </div>

          {/* TRACEABILITY LOG */}
          {!isCounterfeit && (
            <div className="trace-card">
              <h3>Traceability Log</h3>

              {logs.length === 0 ? (
                <p className="info">No movement history found</p>
              ) : (
                <table className="trace-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Reader</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index}>
                        <td>{new Date(log.timestamp * 1000).toLocaleString()}</td>
                        <td>{log.readerID}</td>
                        <td>{log.location}</td>
                        <td>
                          {log.violated ? (
                            <span className="danger-text">Compromised</span>
                          ) : (
                            <span className="safe-text">Safe</span>
                          )}
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
  );
};

export default RfidLive;