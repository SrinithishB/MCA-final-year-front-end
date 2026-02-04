import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/viewReaders.css";

const ViewReader = () => {
  const { readerId } = useParams();
  const navigate = useNavigate();
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReader = async () => {
      try {
        const res = await api.get(`/readers/${readerId}`);
        setReader(res.data.reader);
      } catch {
        alert("Reader not found");
        navigate("/readers");
      } finally {
        setLoading(false);
      }
    };

    fetchReader();
  }, [readerId, navigate]);

  if (loading) return <p className="info">Loading...</p>;
  if (!reader) return null;

  return (
    <div className="page-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/readers")}>
          ← Back
        </button>
        <h2>Reader Details</h2>
      </div>

      <div className="form-card">
        <p>
          <strong>Reader ID:</strong> {reader.readerId}
        </p>
        <p>
          <strong>Location:</strong> {reader.location}
        </p>
        <p>
          <strong>Status:</strong> {reader.isActive ? "Active" : "Inactive"}
        </p>
      </div>
    </div>
  );
};

export default ViewReader;
