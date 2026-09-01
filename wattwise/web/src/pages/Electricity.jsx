function Electricity() {
  return (
    <div className="electricity-page">
      {/* HEADER */}
      <div className="electricity-header">
        <div>
          <h1>Listrik</h1>
          <p>Monitoring konsumsi listrik kamar secara real-time</p>
        </div>

        <div className="iot-status">
          <span className="status-dot"></span>
          Alat Terhubung
        </div>
      </div>

      {/* FILTER */}
      <div className="electricity-filter">
        <div>
          <label>Kamar</label>
          <select>
            <option>Semua Kamar</option>
            <option>Kamar 01</option>
            <option>Kamar 02</option>
            <option>Kamar 03</option>
            <option>Kamar 08</option>
            <option>Kamar 12</option>
          </select>
        </div>

        <div>
          <label>Periode</label>
          <select>
            <option>Hari ini</option>
            <option>7 hari terakhir</option>
            <option>30 hari terakhir</option>
          </select>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="electricity-stats">
        <div className="electricity-stat-card">
          <div className="electricity-stat-icon green">⚡</div>
          <div>
            <span>Total Konsumsi</span>
            <h2>24.8 kWh</h2>
            <small>Hari ini</small>
          </div>
        </div>

        <div className="electricity-stat-card">
          <div className="electricity-stat-icon blue">◉</div>
          <div>
            <span>Daya Saat Ini</span>
            <h2>1.24 kW</h2>
            <small>Real-time</small>
          </div>
        </div>

        <div className="electricity-stat-card">
          <div className="electricity-stat-icon orange">⚠</div>
          <div>
            <span>Anomali</span>
            <h2>3</h2>
            <small className="danger-text">Perlu diperiksa</small>
          </div>
        </div>

        <div className="electricity-stat-card">
          <div className="electricity-stat-icon purple">⌁</div>
          <div>
            <span>Perangkat Aktif</span>
            <h2>47</h2>
            <small>4 titik / kamar</small>
          </div>
        </div>
      </div>

      {/* MONITORING CARD */}
      <section className="electricity-card">
        <div className="electricity-card-header">
          <div>
            <h2>Konsumsi Listrik</h2>
            <p>Pemakaian listrik seluruh kamar hari ini</p>
          </div>

          <span className="live-badge">
            <span></span>
            Live
          </span>
        </div>

        <div className="electricity-chart">
          <div className="chart-y">
            <span>3 kW</span>
            <span>2 kW</span>
            <span>1 kW</span>
            <span>0 kW</span>
          </div>

          <div className="chart-area">
            <div className="grid-line line-1"></div>
            <div className="grid-line line-2"></div>
            <div className="grid-line line-3"></div>
            <div className="grid-line line-4"></div>

            <div className="fake-chart">
              <span className="point point-1"></span>
              <span className="point point-2"></span>
              <span className="point point-3"></span>
              <span className="point point-4"></span>
              <span className="point point-5"></span>
              <span className="point point-6"></span>
              <span className="point point-7"></span>
            </div>

            <div className="chart-x">
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

      {/* TITIK LISTRIK */}
      <section className="electricity-card">
        <div className="electricity-card-header">
          <div>
            <h2>Monitoring Titik Listrik</h2>
            <p>Status penggunaan perangkat per kamar</p>
          </div>

          <button className="detail-button">Lihat semua →</button>
        </div>

        <div className="device-grid">
          {/* LAMPU */}
          <div className="device-card">
            <div className="device-top">
              <div className="device-icon green-device">💡</div>
              <span className="normal-badge">Normal</span>
            </div>

            <h3>Lampu</h3>
            <p>12 perangkat aktif</p>

            <div className="device-power">
              <strong>0.18 kW</strong>
              <span>Saat ini</span>
            </div>
          </div>

          {/* CHARGER */}
          <div className="device-card">
            <div className="device-top">
              <div className="device-icon yellow-device">⚡</div>
              <span className="anomaly-badge">Anomali</span>
            </div>

            <h3>Charger HP</h3>
            <p>14 perangkat aktif</p>

            <div className="device-power">
              <strong>0.42 kW</strong>
              <span>Saat ini</span>
            </div>
          </div>

          {/* LAPTOP */}
          <div className="device-card">
            <div className="device-top">
              <div className="device-icon blue-device">💻</div>
              <span className="normal-badge">Normal</span>
            </div>

            <h3>Laptop</h3>
            <p>9 perangkat aktif</p>

            <div className="device-power">
              <strong>0.51 kW</strong>
              <span>Saat ini</span>
            </div>
          </div>

          {/* KIPAS */}
          <div className="device-card">
            <div className="device-top">
              <div className="device-icon orange-device">🌀</div>
              <span className="normal-badge">Normal</span>
            </div>

            <h3>Kipas</h3>
            <p>12 perangkat aktif</p>

            <div className="device-power">
              <strong>0.13 kW</strong>
              <span>Saat ini</span>
            </div>
          </div>
        </div>
      </section>

      {/* ANOMALY TABLE */}
      <section className="electricity-card">
        <div className="electricity-card-header">
          <div>
            <h2>Anomali Terdeteksi</h2>
            <p>Perangkat dengan penggunaan listrik tidak normal</p>
          </div>

          <span className="anomaly-count">3 Anomali</span>
        </div>

        <div className="electricity-table">
          <div className="table-row table-head">
            <span>Kamar</span>
            <span>Perangkat</span>
            <span>Daya</span>
            <span>Durasi</span>
            <span>Status</span>
          </div>

          <div className="table-row">
            <span>Kamar 08</span>
            <span>⚡ Charger</span>
            <span>0.38 kW</span>
            <span>3 jam</span>
            <span className="anomaly-badge">Tinggi</span>
          </div>

          <div className="table-row">
            <span>Kamar 12</span>
            <span>💻 Laptop</span>
            <span>0.31 kW</span>
            <span>5 jam</span>
            <span className="warning-badge">Sedang</span>
          </div>

          <div className="table-row">
            <span>Kamar 03</span>
            <span>💡 Lampu</span>
            <span>0.12 kW</span>
            <span>8 jam</span>
            <span className="warning-badge">Sedang</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Electricity;
