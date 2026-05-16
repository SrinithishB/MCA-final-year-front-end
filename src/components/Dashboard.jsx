import { Link } from "react-router-dom";
import "../css/dashboard.css";
import StatsDashboard from "./StatsDashboard";

const cards = [
  { to: "/readers/add",       icon: "📡", title: "Add Reader",          desc: "Register a new RFID reader device" },
  { to: "/readers",           icon: "🗂️", title: "View Readers",        desc: "Manage all registered readers" },
  { to: "/drugs/add",         icon: "💊", title: "Add Drug",            desc: "Register a new drug batch" },
  { to: "/drugs",             icon: "📋", title: "View Drugs",          desc: "View drugs and their status" },
  { to: "/rfid/live",         icon: "🔴", title: "Live RFID Scan",      desc: "Real-time hardware monitoring" },
  { to: "/logs/temperature",  icon: "🌡️", title: "Temperature Logs",    desc: "Environmental monitoring history" },
  { to: "/logs/traceability", icon: "🔍", title: "Traceability Logs",   desc: "Track drug movement across hospital" },
];

const Dashboard = () => (
  <div className="dashboard-wrapper">
    <header className="dashboard-topbar">
      <div className="dashboard-brand">
        <div className="brand-icon">🏥</div>
        <div className="brand-text">
          <h1>MediTrack</h1>
          <span>Smart Hospital Drug Monitoring System</span>
        </div>
      </div>
      <div className="topbar-status">
        <span className="topbar-status-dot" />
        System Online
      </div>
    </header>

    <div className="dashboard-body">
      <p className="section-title">Quick Actions</p>
      <div className="card-grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="dashboard-card">
            <div className="card-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
            <span className="card-arrow">→</span>
          </Link>
        ))}
      </div>
      <StatsDashboard />
    </div>
  </div>
);

export default Dashboard;
