import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/viewDrugs.css";

const ViewDrugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchDrugs = async () => {
    try {
      const res = await api.get("/drugs");
      setDrugs(res.data.drugs || []);
    } catch (err) {
      setError("Failed to load drugs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  if (loading) return <p className="info">Loading drugs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="view-drugs-container">
      {/* Header */}
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Drugs</h2>
      </div>

      {drugs.length === 0 ? (
        <p className="info">No drugs found</p>
      ) : (
        <table className="drugs-table">
          <thead>
            <tr>
              <th>RFID</th>
              <th>Drug</th>
              <th>Batch</th>
              <th>Manufacturer</th>
              <th>MFG</th>
              <th>EXP</th>
              <th>Cold Storage</th>
              <th>Limits</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {drugs.map((drug) => {
              const expired =
                drug.expiryDate &&
                new Date(drug.expiryDate) < new Date();

              return (
                <tr key={drug._id}>
                  <td>{drug.rfidTag}</td>
                  <td>{drug.drugName}</td>
                  <td>{drug.batchNumber}</td>
                  <td>{drug.manufacturerName}</td>

                  <td>
                    {drug.manufactureDate
                      ? new Date(drug.manufactureDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className={expired ? "expired" : ""}>
                    {drug.expiryDate
                      ? new Date(drug.expiryDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{drug.requiresColdStorage ? "Yes" : "No"}</td>

                  <td>
                    {drug.requiresColdStorage ? (
                      <span className="limits">
                        {drug.temperatureMin}–{drug.temperatureMax}°C / ≤
                        {drug.humidityMax}%
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    <span
                      className={
                        drug.isCompromised || expired
                          ? "status compromised"
                          : "status safe"
                      }
                    >
                      {expired
                        ? "Expired"
                        : drug.isCompromised
                        ? "Compromised"
                        : "Safe"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewDrugs;
