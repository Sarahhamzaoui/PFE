import React, { useEffect, useRef } from "react";
import "../Styles/Dashboard.css";

const missions = [
  { id: 1, name: "Hamzaoui Sarah",  destination: "Paris",   start: "2026-02-20", status: "Active"   },
  { id: 2, name: "Zeraouti Lyna",   destination: "Spain",   start: "2026-01-05", status: "Pending"  },
  { id: 3, name: "Roumane Lydia",   destination: "Italy",   start: "2025-12-04", status: "Rejected" },
  { id: 4, name: "Amir Sali",       destination: "Germany", start: "2026-03-01", status: "Active"   },
  { id: 5, name: "Fatima Zohra",    destination: "Dubai",   start: "2026-03-10", status: "Pending"  },
];

const barData = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 52 },
  { label: "Mar", value: 41 }, 
  { label: "Apr", value: 67 },
  { label: "May", value: 55 },
  { label: "Jun", value: 78 },
  { label: "Jul", value: 90 },
  { label: "Aug", value: 72 },
];

function BarChart({ data }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const maxVal = Math.max(...data.map(d => d.value));
    const padLeft = 40, padBottom = 28, padTop = 16, padRight = 10;
    const chartW = W - padLeft - padRight;
    const chartH = H - padBottom - padTop;
    const barCount = data.length;
    const barW = (chartW / barCount) * 0.5;
    const gap = chartW / barCount;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - padRight, y);
      ctx.strokeStyle = "#f0f0f5";
      ctx.lineWidth = 1;
      ctx.stroke();
      const label = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillStyle = "#aab0c0";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(label, padLeft - 6, y + 4);
    }

    // Bars
    data.forEach((d, i) => {
      const x = padLeft + gap * i + gap / 2 - barW / 2;
      const barH = (d.value / maxVal) * chartH;
      const y = padTop + chartH - barH;

      // Rounded top bar
      const r = 5;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();

      // Gradient fill
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, "#5B8DEF");
      grad.addColorStop(1, "#3B6CF8");
      ctx.fillStyle = grad;
      ctx.fill();

      // X label
      ctx.fillStyle = "#aab0c0";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.label, x + barW / 2, H - 8);
    });
  }, [data]);

  return <canvas ref={canvasRef} width={380} height={180} style={{ width: "100%", height: "180px" }} />;
}

function DonutChart({ approved, pending, urgent }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const total = approved + pending + urgent;
    const slices = [
      { value: approved, color: "#4CAF82" },
      { value: pending,  color: "#F5A623" },
      { value: urgent,   color: "#E05252" },
    ];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = 68;
    const innerR = 42;
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    slices.forEach(slice => {
      const angle = (slice.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      startAngle += angle;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.fillStyle = "#1a2340";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, cx, cy - 7);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#aab0c0";
    ctx.fillText("missions", cx, cy + 10);
  }, [approved, pending, urgent]);

  return <canvas ref={canvasRef} width={160} height={160} />;
}

function Dashboard() {
  const total    = missions.length;
  const approved = missions.filter(m => m.status === "Active").length;
  const pending  = missions.filter(m => m.status === "Pending").length;
  const urgent   = missions.filter(m => m.status === "Rejected").length;

  return (
    <div className="db-page">

      {/* Header */}
      <div className="db-header">
        <div>
          <h1 className="db-greeting">Dashboard Overview 👋</h1>
          <p className="db-sub">Here's what's happening with your missions.</p>
        </div>
        <div className="db-header-right">
          <span className="db-date-badge">This month ▾</span>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="db-cards-grid">

        <div className="db-card db-card--blue">
          <div className="db-card__top">
            <span className="db-card__label">Total Missions</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{total}</p>
          <p className="db-card__sub">All time</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Approved</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{approved}</p>
          <p className="db-card__sub db-card__sub--green">↑ Currently ongoing</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Pending</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{pending}</p>
          <p className="db-card__sub db-card__sub--amber">↑ Awaiting approval</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Urgent</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{urgent}</p>
          <p className="db-card__sub db-card__sub--red">↑ Needs attention</p>
        </div>

      </div>

      {/* Charts row */}
      <div className="db-charts-grid">

        {/* Bar chart */}
        <div className="db-section db-section--wide">
          <div className="db-section__header">
            <p className="db-section__title">Missions over time</p>
            <span className="db-date-badge">This year ▾</span>
          </div>
          <BarChart data={barData} />
        </div>

        {/* Donut */}
        <div className="db-section">
          <div className="db-section__header">
            <p className="db-section__title">By status</p>
          </div>
          <div className="db-donut-wrapper">
            <DonutChart approved={approved} pending={pending} urgent={urgent} />
            <div className="db-legend">
              <div className="db-legend__item">
                <span className="db-legend__dot" style={{ background: "#4CAF82" }} />
                <span className="db-legend__label">Approved</span>
                <span className="db-legend__val">{approved}</span>
              </div>
              <div className="db-legend__item">
                <span className="db-legend__dot" style={{ background: "#F5A623" }} />
                <span className="db-legend__label">Pending</span>
                <span className="db-legend__val">{pending}</span>
              </div>
              <div className="db-legend__item">
                <span className="db-legend__dot" style={{ background: "#E05252" }} />
                <span className="db-legend__label">Urgent</span>
                <span className="db-legend__val">{urgent}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent missions table */}
      <div className="db-section" style={{ marginTop: "1rem" }}>
        <div className="db-section__header">
          <p className="db-section__title">Recent missions</p>
          <a className="db-view-all" href="#">View all →</a>
        </div>
        <table className="db-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Destination</th>
              <th>Start date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((m, i) => (
              <tr key={m.id}>
                <td className="db-table__num">{i + 1}</td>
                <td className="db-table__name">{m.name}</td>
                <td>{m.destination}</td>
                <td>{m.start}</td>
                <td>
                  <span className={`db-badge db-badge--${m.status.toLowerCase()}`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;
