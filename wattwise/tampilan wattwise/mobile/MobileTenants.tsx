import { useState } from "react";
import { rooms } from "../data/mockData";
import type { Room } from "../data/mockData";

const occupied = rooms.filter(r => r.status === "occupied" && r.tenant);
const vacant = rooms.filter(r => r.status === "vacant");

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

const emptyForm = { name: "", phone: "", email: "", nik: "", occupation: "", room: "", checkIn: "" };

export default function MobileTenants() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Room | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showCheckout, setShowCheckout] = useState(false);

  const shown = occupied.filter(r =>
    r.tenant!.name.toLowerCase().includes(search.toLowerCase()) || r.number.includes(search)
  );

  return (
    <div className="pb-4 space-y-4">
      {/* Stats bar */}
      <div className="mx-4 flex gap-3">
        <div className="flex-1 bg-green-50 border border-green-200 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{occupied.length}</p>
          <p className="text-xs text-green-600 mt-0.5">Penghuni Aktif</p>
        </div>
        <div className="flex-1 bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{vacant.length}</p>
          <p className="text-xs text-amber-600 mt-0.5">Kamar Kosong</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari penghuni atau kamar..."
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-500 transition" />
        </div>
      </div>

      {/* Tenant cards */}
      <div className="px-4 space-y-2">
        {shown.map(room => {
          const tenant = room.tenant!;
          const colorIdx = parseInt(room.id.replace("r", "")) % avatarColors.length;
          return (
            <button key={room.id} onClick={() => setSelected(room)}
              className="w-full text-left bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 active:bg-slate-50 transition">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColors[colorIdx]}`}>
                {initials(tenant.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tenant.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{tenant.occupation}</p>
                <p className="text-xs text-slate-400 mt-0.5">{tenant.phone}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {room.number}
                </span>
                <p className={`text-[10px] mt-1.5 font-medium px-2 py-0.5 rounded-full text-center ${room.type === "VIP" ? "bg-purple-100 text-purple-700" : room.type === "Deluxe" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                  {room.type}
                </p>
              </div>
            </button>
          );
        })}
        {shown.length === 0 && (
          <div className="py-10 text-center text-slate-400 text-sm">Tidak ada penghuni ditemukan</div>
        )}
      </div>

      {/* FAB */}
      <div className="px-4">
        <button onClick={() => { setShowAdd(true); setForm(emptyForm); }}
          className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Tambah Penghuni
        </button>
      </div>

      {/* Detail sheet */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${avatarColors[parseInt(selected.id.replace("r","")) % avatarColors.length]}`}>
                {initials(selected.tenant!.name)}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selected.tenant!.name}</p>
                <p className="text-sm text-slate-500">{selected.tenant!.occupation}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              {[
                ["No. Kamar", selected.number],
                ["Tipe", selected.type],
                ["Harga Sewa", `Rp ${selected.price.toLocaleString("id-ID")}/bln`],
                ["Masuk", selected.tenant!.checkIn],
                ["Telepon", selected.tenant!.phone],
                ["Email", selected.tenant!.email],
                ["NIK", selected.tenant!.nik],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                  <p className="text-slate-700 font-semibold break-all text-sm">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setShowCheckout(true); setSelected(null); }}
                className="py-3.5 rounded-2xl border border-red-200 text-red-600 text-sm font-semibold">Check-out</button>
              <button onClick={() => setSelected(null)}
                className="py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-bold">Edit Data</button>
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-3 py-2 text-sm text-slate-400 font-medium">Tutup</button>
          </div>
        </div>
      )}

      {/* Add tenant sheet */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tambah Penghuni Baru</h3>
            <div className="space-y-4">
              {[
                { key: "name", label: "Nama Lengkap", type: "text", ph: "Budi Santoso" },
                { key: "nik", label: "NIK (KTP)", type: "text", ph: "3271012501980001" },
                { key: "phone", label: "No. Telepon", type: "tel", ph: "081234567890" },
                { key: "email", label: "Email", type: "email", ph: "budi@email.com" },
                { key: "occupation", label: "Pekerjaan", type: "text", ph: "Mahasiswa / Karyawan" },
                { key: "checkIn", label: "Tanggal Masuk", type: "date", ph: "" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.ph}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pilih Kamar</label>
                <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">Pilih kamar kosong...</option>
                  {vacant.map(r => <option key={r.id} value={r.number}>Kamar {r.number} — {r.type} (Rp {r.price.toLocaleString("id-ID")}/bln)</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={() => setShowAdd(false)} className="py-3.5 rounded-2xl bg-green-600 text-white text-sm font-bold">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout confirm */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6 text-center space-y-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2" />
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <p className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konfirmasi Check-out</p>
            <p className="text-sm text-slate-500">Penghuni akan dikeluarkan dan kamar jadi kosong.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowCheckout(false)} className="py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={() => setShowCheckout(false)} className="py-3.5 rounded-2xl bg-red-500 text-white text-sm font-bold">Check-out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
