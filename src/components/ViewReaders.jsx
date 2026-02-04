import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/viewReaders.css";

const ViewReaders = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchReaders = async () => {
    try {
      const response = await api.get("/readers");
      setReaders(response.data.readers || []);
    } catch (err) {
      setError("Failed to load readers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  const handleDelete = async (readerId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${readerId}?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/readers/${readerId}`);
      setReaders((prev) =>
        prev.filter((reader) => reader.readerId !== readerId)
      );
    } catch (err) {
      alert("❌ Failed to delete reader");
    }
  };

  const handleBack = () => {
    navigate("/"); // dashboard
  };

  if (loading) return <p className="info">Loading readers...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="view-readers-container">
      <div className="header">
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>
        <h2>RFID Readers</h2>
      </div>

      {readers.length === 0 ? (
        <p className="info">No readers found</p>
      ) : (
        <table className="readers-table">
          <thead>
            <tr>
              <th>Reader ID</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {readers.map((reader) => (
              <tr key={reader._id}>
                <td>{reader.readerId}</td>
                <td>{reader.location}</td>
                <td>
                  <span
                    className={
                      reader.isActive ? "status active" : "status inactive"
                    }
                  >
                    {reader.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/readers/view/${reader.readerId}`)}
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/readers/edit/${reader.readerId}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(reader.readerId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewReaders;
