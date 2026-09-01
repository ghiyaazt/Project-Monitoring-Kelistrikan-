import { useState } from "react";

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Login berhasil → masuk ke Dashboard
    onLogin();
  };

  return (
    <div className="login-page">
      {/* ================= LEFT PANEL ================= */}
      <div className="login-left">
        {/* BRAND */}
        <div className="login-brand">
          <div className="brand-icon">⌂</div>
          <span>KosManager</span>
        </div>

        {/* FEATURES */}
        <div className="login-features">
          <div className="feature">
            <span className="feature-icon">🏠</span>
            <span>Pantau kamar kosong & terisi secara real-time</span>
          </div>

          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Monitor listrik IoT per kamar & deteksi anomali</span>
          </div>

          <div className="feature">
            <span className="feature-icon">💳</span>
            <span>Kelola pembayaran kos dengan mudah</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="login-footer">
          © 2026 KosManager. Sistem manajemen kos terpadu.
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="login-right">
        <div className="login-form-container">
          <h1>Selamat datang</h1>

          <p className="login-subtitle">Masuk ke sistem manajemen kos Anda</p>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="admin@kos.id"
                defaultValue="admin@kos.id"
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  defaultValue="admin123"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Tampilkan password"
                >
                  ◉
                </button>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="forgot-password">
                <button type="button">Lupa password?</button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button type="submit" className="login-button">
              Masuk
            </button>
          </form>

          {/* DEMO ACCOUNT */}
          <div className="demo-login">
            Demo: <span>admin@kos.id / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
