import { useEffect, useState } from "react";
import api from "../services/api";
import "../css/statsDashboard.css";

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats")
      .then((res) => setStats(res.data.statistics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state-msg"><div className="spinner" />Loading statistics...</div>;
  if (!stats) return null;

  const items = [
    { label: "Total Drugs",      value: stats.totalDrugs,        icon: "💊", cls: "" },
    { label: "Compromised",      value: stats.compromisedDrugs,  icon: "⚠️", cls: "danger" },
    { label: "Cold Storage",     value: stats.coldStorageDrugs,  icon: "❄️", cls: "highlight" },
    { label: "Temp Logs",        value: stats.temperatureLogs,   icon: "🌡️", cls: "" },
    { label: "Trace Logs",       value: stats.traceabilityLogs,  icon: "🔍", cls: "" },
    { label: "Compromise Rate",  value: stats.compromiseRate,    icon: "📊", cls: stats.compromisedDrugs > 0 ? "danger" : "success" },
  ];

  return (
    <div className="stats-section">
      <p className="section-title">System Statistics</p>
      <div className="stats-grid">
        {items.map((item) => (
          <div key={item.label} className={`stat-card ${item.cls}`}>
            <div className="stat-icon">{item.icon}</div>
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsDashboard;
