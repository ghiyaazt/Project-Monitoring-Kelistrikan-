function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>WattWise</h1>

        <p className="login-subtitle">Monitoring listrik kamar kos</p>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Masukkan email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Masukkan password" />
        </div>

        <button className="login-button">Login</button>

        <p className="register-text">
          Belum punya akun? <span>Daftar</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
