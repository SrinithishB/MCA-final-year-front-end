import { Link } from "react-router-dom";
import "../css/dashboard.css";
import StatsDashboard from "./StatsDashboard";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Smart Hospital Drug Monitoring Dashboard</h1>
      <p className="subtitle">Manage Drug using IoT and Blockchain</p>

      <div className="card-grid">
        <Link to="/readers/add" className="dashboard-card">
          <h3>Add Reader</h3>
          <p>Create a new RFID reader</p>
        </Link>

        <Link to="/readers" className="dashboard-card">
          <h3>View Readers</h3>
          <p>See all registered readers</p>
        </Link>

        <Link to="/drugs/add" className="dashboard-card">
          <h3>Add Drug</h3>
          <p>Register a new drug batch</p>
        </Link>

        <Link to="/drugs" className="dashboard-card">
          <h3>View Drugs</h3>
          <p>View registered drugs and status</p>
        </Link>

        <Link to="/rfid/live" className="dashboard-card">
          <h3>Live RFID Scan</h3>
          <p>Real-time RFID hardware monitoring</p>
        </Link>

        <Link to="/logs/temperature" className="dashboard-card">
          <h3>Temperature Logs</h3>
          <p>View environmental monitoring history</p>
        </Link>

        <Link to="/logs/traceability" className="dashboard-card">
          <h3>Traceability Logs</h3>
          <p>Track drug movement across hospital</p>
        </Link>
      </div>
      <StatsDashboard/>
    </div>
  );
};

export default Dashboard;
