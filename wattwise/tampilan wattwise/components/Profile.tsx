import { useState } from "react";

export default function Profile() {
  const [form, setForm] = useState({
    name: "Hendra Wijaya",
    email: "admin@kos.id",
    phone: "0812-3456-7890",
    role: "Pemilik Kos",
    kosName: "Kos Bahagia",
    address: "Jl. Merdeka No. 12, Bandung, Jawa Barat 40111",
    bankName: "BCA",
    bankAccount: "1234567890",
    bankHolder: "Hendra Wijaya",
  });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"personal" | "kos" | "bank">("personal");

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 transition bg-white";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Profil Saya</h1>
        <p className="text-sm text-slate-500 mt-0.5">Kelola informasi akun dan data kos Anda</p>
      </div>

      {/* Avatar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          HW
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{form.name}</p>
          <p className="text-sm text-slate-500">{form.role}</p>
          <p className="text-sm text-slate-400 mt-0.5">{form.email}</p>
        </div>
        <button className="ml-auto px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
          Ubah Foto
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(["personal", "kos", "bank"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t === "personal" ? "Data Pribadi" : t === "kos" ? "Info Kos" : "Rekening"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        {tab === "personal" && (
          <>
            <h2 className="font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Data Pribadi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Peran</label>
                <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">No. Telepon</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Ganti Password</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="password" placeholder="Password lama" className={inputCls} />
                <input type="password" placeholder="Password baru" className={inputCls} />
              </div>
            </div>
          </>
        )}

        {tab === "kos" && (
          <>
            <h2 className="font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Informasi Kos</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Kos</label>
              <input type="text" value={form.kosName} onChange={e => setForm(f => ({ ...f, kosName: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat Lengkap</label>
              <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Kamar", value: "12" },
                { label: "Lantai", value: "3" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                  <input type="number" defaultValue={f.value} className={inputCls} />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "bank" && (
          <>
            <h2 className="font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Informasi Rekening</h2>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 mb-2">
              Rekening ini akan ditampilkan kepada penghuni sebagai tujuan transfer pembayaran sewa.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Bank</label>
                <select value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}
                  className={inputCls}>
                  {["BCA", "BNI", "BRI", "Mandiri", "CIMB Niaga", "Permata"].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">No. Rekening</label>
                <input type="text" value={form.bankAccount} onChange={e => setForm(f => ({ ...f, bankAccount: e.target.value }))} className={inputCls} style={{ fontFamily: "'JetBrains Mono', monospace" }} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Pemilik Rekening</label>
                <input type="text" value={form.bankHolder} onChange={e => setForm(f => ({ ...f, bankHolder: e.target.value }))} className={inputCls} />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={save}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${saved ? "bg-green-100 text-green-700" : "bg-green-600 hover:bg-green-700 text-white"}`}
          >
            {saved ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Tersimpan
              </>
            ) : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
