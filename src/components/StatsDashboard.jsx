import { useEffect, useState } from "react";
import api from "../services/api";
import "../css/statsDashboard.css";

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data.statistics);
      } catch {
        alert("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="info">Loading statistics...</p>;
  if (!stats) return <p className="info">No statistics available</p>;

  return (
    <div className="stats-container">
      <h2>System Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Drugs</h3>
          <p>{stats.totalDrugs}</p>
        </div>

        <div className="stat-card danger">
          <h3>Compromised Drugs</h3>
          <p>{stats.compromisedDrugs}</p>
        </div>

        <div className="stat-card">
          <h3>Cold Storage Drugs</h3>
          <p>{stats.coldStorageDrugs}</p>
        </div>

        <div className="stat-card">
          <h3>Temperature Logs</h3>
          <p>{stats.temperatureLogs}</p>
        </div>

        <div className="stat-card">
          <h3>Traceability Logs</h3>
          <p>{stats.traceabilityLogs}</p>
        </div>

        <div className="stat-card highlight">
          <h3>Compromise Rate</h3>
          <p>{stats.compromiseRate}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
