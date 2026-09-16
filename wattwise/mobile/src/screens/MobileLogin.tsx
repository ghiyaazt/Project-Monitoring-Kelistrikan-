import { useState } from "react";

interface Props {
  onLogin: () => void;
}

export default function MobileLogin({ onLogin }: Props) {
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
    <div className="flex flex-col min-h-full bg-white">
      {/* Top gradient hero */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-blue-700 px-6 pt-16 pb-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-4 backdrop-blur-sm">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>WattWise</h1>
        <p className="text-white/70 text-sm mt-1">Sistem Manajemen Kos Terpadu</p>
      </div>

      {/* Form card */}
      <div className="flex-1 bg-slate-50 rounded-t-3xl -mt-5 px-6 pt-8 pb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Selamat Datang</h2>
        <p className="text-sm text-slate-500 mb-6">Masuk ke akun Anda</p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@kos.id"
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-slate-900 placeholder-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-slate-900 placeholder-slate-400 pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPass
                  ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>
          </div>

          <div className="text-right">
            <button type="button" className="text-xs text-blue-600 font-medium">Lupa password?</button>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-bold transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Memverifikasi...</>
            ) : "Masuk"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-100 rounded-2xl">
          <p className="text-xs text-slate-500 text-center">Demo akun:</p>
          <p className="text-xs text-center font-mono text-slate-700 mt-1">salsabila@wattwise.id / kamar03</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          {["IoT Realtime", "Pembayaran", "Penghuni"].map((t, i) => (
            <span key={t} className="flex items-center gap-1.5">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-300" />}
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
