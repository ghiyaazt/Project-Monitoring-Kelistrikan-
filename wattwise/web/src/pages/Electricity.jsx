import { useState } from "react";

function Electricity() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const rooms = [
    {
      room: "Kamar 01",
      consumption: "1.12 kWh",
      power: "0.08 kW",
      status: "Normal",
      statusClass: "normal",
      duration: "-",
      resident: "Andi Pratama",
      phone: "0812-3456-7890",
      description: "Konsumsi listrik dalam batas normal.",
    },
    {
      room: "Kamar 03",
      consumption: "2.84 kWh",
      power: "0.12 kW",
      status: "Normal",
      statusClass: "normal",
      duration: "-",
      resident: "Siti Rahma",
      phone: "0813-4567-8901",
      description: "Konsumsi listrik dalam batas normal.",
    },
    {
      room: "Kamar 08",
      consumption: "7.42 kWh",
      power: "0.38 kW",
      status: "Anomali",
      statusClass: "danger",
      duration: "3 jam",
      resident: "Budi Santoso",
      phone: "0812-9876-5432",
      description: "Konsumsi listrik di atas pola normal.",
    },
    {
      room: "Kamar 12",
      consumption: "6.18 kWh",
      power: "0.31 kW",
      status: "Sedang",
      statusClass: "warning",
      duration: "5 jam",
      resident: "Dina Permata",
      phone: "0821-2345-6789",
      description: "Konsumsi listrik di atas rata-rata.",
    },
  ];

  return (
    <div className="electricity-page">
      {/* HEADER */}
      <div className="electricity-header">
        <div>
          <h1>Monitoring Listrik</h1>
          <p>Monitoring konsumsi listrik berdasarkan meteran kamar</p>
        </div>

        <div className="iot-status">
          <span className="status-dot"></span>
          Meteran Terhubung
        </div>
      </div>

      {/* MONITORING KAMAR */}
      <section className="electricity-card">
        <div className="electricity-card-header">
          <div>
            <h2>Monitoring Kamar</h2>
            <p>Status konsumsi listrik berdasarkan meteran kamar</p>
          </div>
        </div>

        <div className="room-monitor-grid">
          {rooms.map((room) => (
            <div
              key={room.room}
              className={`room-monitor-card ${room.statusClass}`}
            >
              <div className="room-card-top">
                <span className="room-name">{room.room}</span>

                <span className={`room-status ${room.statusClass}`}>
                  {room.status}
                </span>
              </div>

              <span className="room-label">Konsumsi hari ini</span>

              <h2>{room.consumption}</h2>

              <div className="room-card-divider"></div>

              <div className="room-power">
                <div>
                  <strong>{room.power}</strong>
                  <span>Daya saat ini</span>
                </div>

                <button
                  className="room-detail-button"
                  onClick={() => setSelectedRoom(room)}
                >
                  Lihat Detail →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAIL ANOMALI / RINGKASAN */}
      <section className="electricity-card">
        <div className="electricity-card-header">
          <div>
            <h2>Anomali Terdeteksi</h2>
            <p>Kamar dengan penggunaan listrik tidak normal</p>
          </div>

          <span className="anomaly-count">3 Anomali</span>
        </div>

        <div className="electricity-table">
          <div className="table-row table-head">
            <span>Kamar</span>
            <span>Total Konsumsi</span>
            <span>Daya Saat Ini</span>
            <span>Durasi</span>
            <span>Status</span>
            <span>Aksi</span>
          </div>

          {rooms
            .filter((room) => room.statusClass !== "normal")
            .map((room) => (
              <div className="table-row" key={room.room}>
                <span>{room.room}</span>
                <span>{room.consumption}</span>
                <span>{room.power}</span>
                <span>{room.duration}</span>

                <span>
                  <span className={`room-status ${room.statusClass}`}>
                    {room.status}
                  </span>
                </span>

                <button
                  className="table-detail-button"
                  onClick={() => setSelectedRoom(room)}
                >
                  Detail →
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* DETAIL MODAL */}
      {selectedRoom && (
        <div
          className="room-detail-overlay"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="room-detail-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* DETAIL HEADER */}
            <div className="detail-panel-header">
              <div>
                <h2>Detail {selectedRoom.room}</h2>
                <p>Monitoring konsumsi listrik kamar</p>
              </div>

              <button
                className="detail-close"
                onClick={() => setSelectedRoom(null)}
              >
                ×
              </button>
            </div>

            {/* STATUS */}
            <div className={`detail-alert ${selectedRoom.statusClass}`}>
              <div className="detail-alert-icon">
                {selectedRoom.statusClass === "danger" ? "⚠" : "✓"}
              </div>

              <div>
                <strong>
                  {selectedRoom.statusClass === "danger"
                    ? "Anomali Terdeteksi"
                    : selectedRoom.status === "warning"
                      ? "Konsumsi Di Atas Rata-rata"
                      : "Konsumsi Normal"}
                </strong>

                <span>{selectedRoom.description}</span>
              </div>

              <span className={`room-status ${selectedRoom.statusClass}`}>
                {selectedRoom.status}
              </span>
            </div>

            {/* STAT DETAIL */}
            <div className="detail-stats">
              <div className="detail-stat">
                <span className="detail-stat-icon green-icon">⚡</span>

                <div>
                  <strong>{selectedRoom.consumption}</strong>
                  <span>Total konsumsi</span>
                </div>
              </div>

              <div className="detail-stat">
                <span className="detail-stat-icon blue-icon">◉</span>

                <div>
                  <strong>{selectedRoom.power}</strong>
                  <span>Daya saat ini</span>
                </div>
              </div>

              <div className="detail-stat">
                <span className="detail-stat-icon orange-icon">◷</span>

                <div>
                  <strong>
                    {selectedRoom.duration === "-"
                      ? "Tidak ada"
                      : selectedRoom.duration}
                  </strong>
                  <span>Durasi anomali</span>
                </div>
              </div>

              <div className="detail-stat">
                <span className="detail-stat-icon purple-icon">⌁</span>

                <div>
                  <strong>2.84 kW</strong>
                  <span>Rata-rata normal</span>
                </div>
              </div>
            </div>

            {/* GRAFIK */}
            <div className="detail-chart-card">
              <div className="detail-chart-header">
                <div>
                  <h3>Grafik Konsumsi Listrik</h3>
                  <p>Pola penggunaan listrik hari ini</p>
                </div>

                <select defaultValue="today">
                  <option value="today">Hari ini</option>
                  <option value="week">7 hari terakhir</option>
                  <option value="month">30 hari terakhir</option>
                </select>
              </div>

              <div className="detail-chart">
                <div className="chart-grid grid-a"></div>
                <div className="chart-grid grid-b"></div>
                <div className="chart-grid grid-c"></div>
                <div className="chart-grid grid-d"></div>

                <div className="normal-line"></div>
                <div className="actual-line"></div>

                <div className="chart-values">
                  <span>3 kW</span>
                  <span>2 kW</span>
                  <span>1 kW</span>
                  <span>0 kW</span>
                </div>

                <div className="detail-chart-labels">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>24:00</span>
                </div>
              </div>

              <div className="chart-legend">
                <span>
                  <i className="legend-normal"></i>
                  Pola Normal
                </span>

                <span>
                  <i className="legend-actual"></i>
                  Penggunaan Aktual
                </span>

                <span>
                  <i className="legend-limit"></i>
                  Batas Anomali
                </span>
              </div>
            </div>

            {/* INFO KAMAR + PENGHUNI */}
            <div className="detail-info-grid">
              {/* INFO KAMAR */}
              <div className="info-card">
                <h3>Informasi Kamar</h3>

                <div className="info-row">
                  <span>Kamar</span>
                  <strong>{selectedRoom.room}</strong>
                </div>

                <div className="info-row">
                  <span>Penghuni</span>
                  <strong>{selectedRoom.resident}</strong>
                </div>

                <div className="info-row">
                  <span>No. Telepon</span>
                  <strong>{selectedRoom.phone}</strong>
                </div>

                <div className="info-row">
                  <span>Status Pemantauan</span>
                  <span className="active-status">Aktif</span>
                </div>

                <div className="info-row">
                  <span>Terakhir Update</span>
                  <strong>1 Sep 2026 06:15</strong>
                </div>
              </div>

              {/* HUBUNGI */}
              <div className="info-card contact-card">
                <h3>Hubungi Penghuni</h3>

                <p>
                  Hubungi penghuni untuk konfirmasi penggunaan listrik kamar.
                </p>

                <a
                  href={`https://wa.me/62${selectedRoom.phone.substring(1)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-whatsapp"
                >
                  💬 Chat WhatsApp
                </a>

                <a href={`tel:${selectedRoom.phone}`} className="contact-phone">
                  ☎ Telepon
                </a>
              </div>
            </div>

            {/* REKOMENDASI */}
            <div className="recommendation-section">
              <h3>Rekomendasi</h3>

              <div className="recommendation-grid">
                <div className="recommendation-card">
                  <span>⚠</span>
                  <p>
                    Periksa perangkat listrik yang sedang digunakan di kamar.
                  </p>
                </div>

                <div className="recommendation-card">
                  <span>💡</span>
                  <p>
                    Hindari penggunaan perangkat listrik berdaya besar
                    bersamaan.
                  </p>
                </div>

                <div className="recommendation-card">
                  <span>ⓘ</span>
                  <p>Matikan perangkat listrik yang tidak digunakan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Electricity;
