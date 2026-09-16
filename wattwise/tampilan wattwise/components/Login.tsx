import { useState } from "react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === "salsabila@wattwise.id" && password === "kamar03") onLogin();
      else setError("Email atau password salah.");
    }, 900);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[460px] shrink-0 bg-gradient-to-br from-green-600 via-green-700 to-blue-700 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>WattWise</span>
            <p className="text-white/60 text-xs">Kos Monitoring</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Monitoring listrik kos<br />berbasis IoT & ML
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Pantau konsumsi daya real-time, deteksi anomali otomatis, dan kelola efisiensi energi kamar Anda.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: "⚡", label: "Real-time via ESP32", sub: "Data daya, tegangan, dan arus langsung dari sensor" },
              { icon: "🔍", label: "Deteksi Anomali ML", sub: "Lonjakan listrik tidak wajar terdeteksi otomatis" },
              { icon: "📊", label: "Riwayat & Analitik", sub: "Tren konsumsi per hari, minggu, dan bulan" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-white/60 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/20 pt-6">
            <p className="text-white/40 text-xs">© 2026 WattWise. Sistem monitoring listrik IoT untuk kos.</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>WattWise</p>
              <p className="text-xs text-slate-400">Kos Monitoring</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Selamat datang</h1>
          <p className="text-sm text-slate-500 mb-8">Masuk untuk memantau listrik kamar Anda</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="salsabila@wattwise.id"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-slate-900 pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  {showPass
                    ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              <div className="mt-2 text-right">
                <button type="button" className="text-xs text-blue-600 hover:text-blue-700 transition">Lupa password?</button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Memverifikasi...</>
                : "Masuk"
              }
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Demo: <span className="font-mono text-slate-600">salsabila@wattwise.id</span> / <span className="font-mono text-slate-600">kamar03</span>
          </p>

          <p className="mt-4 text-center text-xs text-slate-400">
            Belum punya akun? <button className="text-green-600 font-medium hover:underline">Daftar</button>
          </p>
        </div>
      </div>
    </div>
  );
}
