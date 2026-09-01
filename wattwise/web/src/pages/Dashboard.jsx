import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Electricity from "./Electricity";

function Dashboard() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar
        current={page}
        onNavigate={setPage}
        onLogout={() => window.location.reload()}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* =========================
            DASHBOARD PAGE
        ========================= */}
        {page === "dashboard" && (
          <>
            {/* Header */}
            <div className="dashboard-header">
              <div>
                <h1>Dashboard</h1>
                <p>Selamat datang kembali di KosManager 👋</p>
              </div>

              <div className="dashboard-date">
                <span>📅</span>
                Senin, 1 September 2026
              </div>
            </div>

            {/* STATISTICS */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon green">🏠</div>

                <div>
                  <p>Total Kamar</p>
                  <h2>20</h2>
                  <span className="stat-info">12 terisi · 8 kosong</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon yellow">⚡</div>

                <div>
                  <p>Konsumsi Listrik</p>
                  <h2>24.8 kWh</h2>
                  <span className="stat-info">Hari ini</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon red">⚠️</div>

                <div>
                  <p>Anomali Terdeteksi</p>
                  <h2>3</h2>
                  <span className="stat-danger">Perlu diperiksa</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">💳</div>

                <div>
                  <p>Pembayaran</p>
                  <h2>15 / 20</h2>
                  <span className="stat-info">Sudah membayar</span>
                </div>
              </div>
            </div>

            {/* MONITORING */}
            <section className="dashboard-section">
              <div className="section-header">
                <div>
                  <h2>Monitoring Listrik</h2>
                  <p>Konsumsi listrik hari ini</p>
                </div>

                <button className="view-button">Lihat detail →</button>
              </div>

              <div className="monitor-card">
                <div className="monitor-top">
                  <div>
                    <span className="monitor-label">Total konsumsi</span>

                    <h2>24.8 kWh</h2>

                    <span className="monitor-up">↑ 8.4% dari kemarin</span>
                  </div>

                  <div className="live-status">
                    <span></span>
                    Live
                  </div>
                </div>

                {/* Grafik sederhana */}
                <div className="chart">
                  <div className="chart-line">
                    <div className="chart-point p1"></div>
                    <div className="chart-point p2"></div>
                    <div className="chart-point p3"></div>
                    <div className="chart-point p4"></div>
                    <div className="chart-point p5"></div>
                    <div className="chart-point p6"></div>
                    <div className="chart-point p7"></div>
                  </div>

                  <div className="chart-labels">
                    <span>00:00</span>
                    <span>04:00</span>
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                  </div>
                </div>
              </div>
            </section>

            {/* BOTTOM SECTION */}
            <div className="dashboard-bottom">
              {/* ANOMALY */}
              <section className="content-card">
                <div className="card-header">
                  <div>
                    <h2>Anomali Terbaru</h2>
                    <p>Perangkat dengan penggunaan tidak normal</p>
                  </div>

                  <button>Lihat semua</button>
                </div>

                <div className="anomaly-item">
                  <div className="device-icon red-bg">⚡</div>

                  <div className="anomaly-info">
                    <strong>Kamar 08 · Charger</strong>

                    <span>Penggunaan tinggi selama 3 jam</span>
                  </div>

                  <span className="badge-danger">Tinggi</span>
                </div>

                <div className="anomaly-item">
                  <div className="device-icon orange-bg">💻</div>

                  <div className="anomaly-info">
                    <strong>Kamar 12 · Laptop</strong>

                    <span>Konsumsi di atas rata-rata</span>
                  </div>

                  <span className="badge-warning">Sedang</span>
                </div>

                <div className="anomaly-item">
                  <div className="device-icon yellow-bg">💡</div>

                  <div className="anomaly-info">
                    <strong>Kamar 03 · Lampu</strong>

                    <span>Menyala di luar jam normal</span>
                  </div>

                  <span className="badge-warning">Sedang</span>
                </div>
              </section>

              {/* ROOM */}
              <section className="content-card">
                <div className="card-header">
                  <div>
                    <h2>Status Kamar</h2>
                    <p>Kondisi kamar saat ini</p>
                  </div>

                  <button>Lihat semua</button>
                </div>

                <div className="room-summary">
                  <div className="room-number green-text">
                    12
                    <span>Terisi</span>
                  </div>

                  <div className="room-number blue-text">
                    8<span>Kosong</span>
                  </div>
                </div>

                <div className="room-progress">
                  <div className="occupied"></div>
                  <div className="empty"></div>
                </div>

                <div className="room-legend">
                  <span>
                    <i className="dot green-dot"></i>
                    Terisi 60%
                  </span>

                  <span>
                    <i className="dot blue-dot"></i>
                    Kosong 40%
                  </span>
                </div>
              </section>
            </div>
          </>
        )}

        {/* =========================
            ELECTRICITY PAGE
        ========================= */}
        {page === "electricity" && <Electricity />}
      </main>
    </div>
  );
}

export default Dashboard;
