import { useState } from "react";
import { rooms } from "../data/mockData";
import type { Room } from "../data/mockData";

const occupiedRooms = rooms.filter(r => r.status === "occupied" && r.tenant);
const vacantRooms = rooms.filter(r => r.status === "vacant");

const avatarColors = [
  "bg-green-100 text-green-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function TenantCard({ room, onClick }: { room: Room; onClick: () => void }) {
  const tenant = room.tenant!;
  const colorIdx = parseInt(room.id.replace("r", "")) % avatarColors.length;
  return (
    <button
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-green-300 hover:shadow-sm transition w-full flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColors[colorIdx]}`}>
          {initials(tenant.name)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tenant.name}</p>
          <p className="text-xs text-slate-400">{tenant.occupation}</p>
        </div>
        <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {room.number}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {tenant.phone}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Masuk: {tenant.checkIn}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${room.type === "VIP" ? "bg-purple-100 text-purple-700" : room.type === "Deluxe" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
          {room.type}
        </span>
        <span className="text-[11px] text-slate-400">Rp {room.price.toLocaleString("id-ID")}/bln</span>
      </div>
    </button>
  );
}

const emptyForm = { name: "", phone: "", email: "", nik: "", occupation: "", room: "", checkIn: "" };

export default function Tenants() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Room | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showCheckout, setShowCheckout] = useState(false);

  const shown = occupiedRooms.filter(r =>
    r.tenant!.name.toLowerCase().includes(search.toLowerCase()) ||
    r.number.includes(search)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Data Penghuni</h1>
          <p className="text-sm text-slate-500 mt-0.5">{occupiedRooms.length} penghuni aktif · {vacantRooms.length} kamar tersedia</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Tambah Penghuni
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari penghuni atau nomor kamar..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map(room => (
          <TenantCard key={room.id} room={room} onClick={() => setSelected(room)} />
        ))}
        {shown.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">Tidak ada penghuni ditemukan.</div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Detail Penghuni</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${avatarColors[parseInt(selected.id.replace("r", "")) % avatarColors.length]}`}>
                {initials(selected.tenant!.name)}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selected.tenant!.name}</p>
                <p className="text-sm text-slate-500">{selected.tenant!.occupation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "No. Kamar", value: selected.number },
                { label: "Tipe", value: selected.type },
                { label: "Harga Sewa", value: `Rp ${selected.price.toLocaleString("id-ID")}/bln` },
                { label: "Tanggal Masuk", value: selected.tenant!.checkIn },
                { label: "No. Telepon", value: selected.tenant!.phone },
                { label: "Email", value: selected.tenant!.email },
                { label: "NIK", value: selected.tenant!.nik },
                { label: "Pekerjaan", value: selected.tenant!.occupation },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                  <p className="text-slate-700 font-medium break-all">{f.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowCheckout(true); setSelected(null); }}
                className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
              >
                Check-out
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
              >
                Edit Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add tenant modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tambah Penghuni Baru</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {[
                { key: "name", label: "Nama Lengkap", placeholder: "Budi Santoso", type: "text" },
                { key: "nik", label: "NIK (KTP)", placeholder: "3271012501980001", type: "text" },
                { key: "phone", label: "No. Telepon", placeholder: "081234567890", type: "tel" },
                { key: "email", label: "Email", placeholder: "budi@email.com", type: "email" },
                { key: "occupation", label: "Pekerjaan", placeholder: "Mahasiswa / Karyawan...", type: "text" },
                { key: "checkIn", label: "Tanggal Masuk", placeholder: "", type: "date" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Pilih Kamar</label>
                <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">Pilih kamar kosong...</option>
                  {vacantRooms.map(r => (
                    <option key={r.id} value={r.number}>Kamar {r.number} — {r.type} (Rp {r.price.toLocaleString("id-ID")}/bln)</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition">
                Simpan Penghuni
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout confirm */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konfirmasi Check-out</h3>
            <p className="text-sm text-slate-500">Penghuni akan dikeluarkan dari kamar dan status kamar berubah menjadi kosong.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCheckout(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">Batal</button>
              <button onClick={() => setShowCheckout(false)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition">Check-out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
