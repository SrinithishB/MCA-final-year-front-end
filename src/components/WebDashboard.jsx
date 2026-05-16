import { useEffect, useState, useRef, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell
} from "recharts";
import api from "../services/api";
import "../css/webDashboard.css";

const fmtTime = (ts) => {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
};

const TempTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-time">{label}</div>
      <div className="tooltip-row">
        <span className="tooltip-dot" style={{ background: "#e01010" }} />
        <span className="tooltip-label">Temp</span>
        <span className="tooltip-val">{payload[0]?.value?.toFixed(1)}°C</span>
      </div>
      {payload[1] && (
        <div className="tooltip-row">
          <span className="tooltip-dot" style={{ background: "#3b82f6" }} />
          <span className="tooltip-label">Humidity</span>
          <span className="tooltip-val">{payload[1]?.value?.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

/* Receives the scanned drug's rfidTag, temperatureMin, temperatureMax */
const WebDashboard = ({ scan }) => {
  const [tempHistory, setTempHistory] = useState([]);
  const [latestTemp, setLatestTemp] = useState(null);
  const rfidTag = scan?.rfidTag;

  const fetchTemp = useCallback(async () => {
    if (!rfidTag) return;
    try {
      // Fetch temperature logs filtered to this specific drug's RFID tag
      const res = await api.get(`/temperature/logs?limit=60`);
      const all = res.data.logs || [];

      // Filter only logs for this drug's RFID tag
      const filtered = all
        .filter((l) => l.rfidTag === rfidTag)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((l) => ({
          time: fmtTime(new Date(l.timestamp)),
          temp: parseFloat(l.temperature),
          humidity: parseFloat(l.humidity),
          ts: new Date(l.timestamp).getTime(),
        }));

      setTempHistory(filtered);
      if (filtered.length) setLatestTemp(filtered[filtered.length - 1]);
    } catch {}
  }, [rfidTag]);

  useEffect(() => {
    setTempHistory([]);
    setLatestTemp(null);
    if (!rfidTag) return;
    fetchTemp();
    const t = setInterval(fetchTemp, 3000);
    return () => clearInterval(t);
  }, [rfidTag, fetchTemp]);

  if (!scan) return null;

  const tempMin = scan.temperatureMin ?? null;
  const tempMax = scan.temperatureMax ?? null;

  const allTemps = tempHistory.map((p) => p.temp);
  const yMin = allTemps.length ? Math.floor(Math.min(...allTemps, tempMin ?? Infinity) - 2) : 0;
  const yMax = allTemps.length ? Math.ceil(Math.max(...allTemps, tempMax ?? -Infinity) + 3) : 40;

  const tempStatus = latestTemp
    ? (tempMax && latestTemp.temp > tempMax) || (tempMin && latestTemp.temp < tempMin)
      ? "hot" : latestTemp.temp > 28 ? "warm" : "ok"
    : null;

  return (
    <div className="wb-root">

      {/* ── Drug KPI row ── */}
      <div className="wb-drug-kpi">
        <div className="wb-drug-kpi-item">
          <span className="wb-kpi-label">Drug</span>
          <span className="wb-kpi-val">{scan.drugName}</span>
        </div>
        <div className="wb-drug-kpi-item">
          <span className="wb-kpi-label">RFID Tag</span>
          <span className="wb-kpi-val mono">{rfidTag}</span>
        </div>
        <div className="wb-drug-kpi-item">
          <span className="wb-kpi-label">Live Temp</span>
          <span className={`wb-kpi-val wb-temp-badge ${tempStatus || "ok"}`}>
            {latestTemp ? `${latestTemp.temp.toFixed(1)}°C` : "—"}
          </span>
        </div>
        <div className="wb-drug-kpi-item">
          <span className="wb-kpi-label">Live Humidity</span>
          <span className="wb-kpi-val mono">
            {latestTemp ? `${latestTemp.humidity.toFixed(0)}%` : "—"}
          </span>
        </div>
        {tempMin != null && (
          <div className="wb-drug-kpi-item">
            <span className="wb-kpi-label">Safe Range</span>
            <span className="wb-kpi-val mono">{tempMin}°C – {tempMax}°C</span>
          </div>
        )}
        <div className="wb-drug-kpi-item">
          <span className="wb-kpi-label">Readings</span>
          <span className="wb-kpi-val">{tempHistory.length}</span>
        </div>
      </div>

      {/* ── Main chart grid ── */}
      <div className="wb-grid">

        {/* Temperature area chart */}
        <div className="wb-panel wb-panel-chart">
          <div className="wb-panel-header">
            <div className="wb-panel-title">
              <span className="wb-panel-dot" style={{ background: "#e01010" }} />
              Temperature — {scan.drugName}
            </div>
            <div className="wb-panel-meta">
              {latestTemp && (
                <span className={`wb-temp-badge ${tempStatus}`}>
                  {latestTemp.temp.toFixed(1)}°C
                </span>
              )}
              <span className="wb-panel-freq">↻ 3s</span>
            </div>
          </div>

          {tempHistory.length === 0 ? (
            <div className="wb-empty">
              <div className="spinner" />
              No temperature readings for {rfidTag} yet...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={tempHistory} margin={{ top: 12, right: 20, bottom: 0, left: -4 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e01010" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e01010" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(201,16,16,0.07)" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#6b4040", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false} axisLine={false}
                  interval={Math.max(1, Math.floor(tempHistory.length / 7))}
                />
                <YAxis
                  domain={[yMin, yMax]}
                  tick={{ fill: "#6b4040", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${v}°`}
                  width={34}
                />
                <Tooltip content={<TempTooltip />} />
                {tempMax != null && (
                  <ReferenceLine
                    y={tempMax}
                    stroke="#dc2626" strokeDasharray="5 3" strokeWidth={1.5}
                    label={{ value: `Max ${tempMax}°C`, fill: "#dc2626", fontSize: 10, fontFamily: "JetBrains Mono", position: "insideTopRight" }}
                  />
                )}
                {tempMin != null && (
                  <ReferenceLine
                    y={tempMin}
                    stroke="#3b82f6" strokeDasharray="5 3" strokeWidth={1.5}
                    label={{ value: `Min ${tempMin}°C`, fill: "#3b82f6", fontSize: 10, fontFamily: "JetBrains Mono", position: "insideBottomRight" }}
                  />
                )}
                <Area
                  type="monotone" dataKey="temp"
                  stroke="#e01010" strokeWidth={2}
                  fill="url(#tempGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#e01010", strokeWidth: 0 }}
                />
                <Area
                  type="monotone" dataKey="humidity"
                  stroke="#3b82f6" strokeWidth={1.5}
                  fill="url(#humGrad)"
                  dot={false}
                  activeDot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                  strokeDasharray="6 2"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          <div className="wb-chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#e01010" }} />Temperature (°C)
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#3b82f6", opacity: 0.7 }} />Humidity (%)
            </span>
            {tempMax != null && (
              <span className="legend-item">
                <span className="legend-dash" style={{ borderColor: "#dc2626" }} />Safe max
              </span>
            )}
            {tempMin != null && (
              <span className="legend-item">
                <span className="legend-dash" style={{ borderColor: "#3b82f6" }} />Safe min
              </span>
            )}
          </div>
        </div>

        {/* Humidity bar chart */}
        <div className="wb-panel wb-panel-hum">
          <div className="wb-panel-header">
            <div className="wb-panel-title">
              <span className="wb-panel-dot" style={{ background: "#3b82f6" }} />
              Humidity — Last {Math.min(tempHistory.length, 20)} readings
            </div>
          </div>
          {tempHistory.length === 0 ? (
            <div className="wb-empty" style={{ padding: "32px 0" }}>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={tempHistory.slice(-20)}
                margin={{ top: 8, right: 12, bottom: 0, left: -20 }}
                barSize={8}
              >
                <CartesianGrid stroke="rgba(201,16,16,0.06)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis
                  tick={{ fill: "#6b4040", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  tickLine={false} axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v) => [`${v.toFixed(1)}%`, "Humidity"]}
                  contentStyle={{ background: "#181818", border: "1px solid #550000", borderRadius: 4, fontFamily: "JetBrains Mono", fontSize: 11, color: "#f0eaea" }}
                  cursor={{ fill: "rgba(201,16,16,0.05)" }}
                />
                <Bar dataKey="humidity" radius={[2, 2, 0, 0]}>
                  {tempHistory.slice(-20).map((e, i) => (
                    <Cell
                      key={i}
                      fill={e.humidity > 70 ? "#dc2626" : e.humidity > 55 ? "#d97706" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
};

export default WebDashboard;
