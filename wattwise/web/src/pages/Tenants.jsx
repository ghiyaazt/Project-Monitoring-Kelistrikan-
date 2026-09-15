import { useState } from "react";

function Tenants() {
  const [search, setSearch] = useState("");

  const tenants = [
    {
      name: "Budi Santoso",
      room: "101",
      type: "Mahasiswa",
      phone: "081234567890",
      date: "2025-03-01",
      package: "Standard",
      price: "Rp 800.000/bln",
      color: "blue",
    },
    {
      name: "Sari Dewi",
      room: "102",
      type: "Karyawan Swasta",
      phone: "082345678901",
      date: "2024-11-15",
      package: "Standard",
      price: "Rp 800.000/bln",
      color: "purple",
    },
    {
      name: "Ahmad Rizki",
      room: "201",
      type: "Freelancer",
      phone: "083456789012",
      date: "2025-01-10",
      package: "Deluxe",
      price: "Rp 1.200.000/bln",
      color: "green",
    },
    {
      name: "Rina Marlina",
      room: "202",
      type: "Guru",
      phone: "084567890123",
      date: "2024-09-01",
      package: "Deluxe",
      price: "Rp 1.200.000/bln",
      color: "blue",
    },
    {
      name: "Deni Kurniawan",
      room: "204",
      type: "Karyawan BUMN",
      phone: "085678901234",
      date: "2025-05-20",
      package: "Deluxe",
      price: "Rp 1.200.000/bln",
      color: "yellow",
    },
    {
      name: "Mega Putri",
      room: "301",
      type: "Dokter",
      phone: "086789012345",
      date: "2024-07-01",
      package: "VIP",
      price: "Rp 1.800.000/bln",
      color: "pink",
    },
    {
      name: "Fajar Hidayat",
      room: "303",
      type: "Programmer",
      phone: "087890123456",
      date: "2025-02-14",
      package: "VIP",
      price: "Rp 1.800.000/bln",
      color: "blue",
    },
    {
      name: "Lita Anggraeni",
      room: "304",
      type: "Wiraswasta",
      phone: "088901234567",
      date: "2024-12-01",
      package: "VIP",
      price: "Rp 1.800.000/bln",
      color: "purple",
    },
  ];

  const filteredTenants = tenants.filter((tenant) =>
    `${tenant.name} ${tenant.room}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="tenants-page">
      <div className="tenants-header">
        <div>
          <h1>Data Penghuni</h1>
          <p>{tenants.length} penghuni aktif · 3 kamar tersedia</p>
        </div>

        <button className="add-tenant-button">
          <span>♙</span>
          Tambah Penghuni
        </button>
      </div>

      <div className="tenant-search">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Cari penghuni atau nomor kamar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tenant-grid">
        {filteredTenants.map((tenant) => (
          <div className="tenant-card" key={tenant.room}>
            <div className="tenant-card-top">
              <div className={`tenant-avatar ${tenant.color}`}>
                {tenant.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .substring(0, 2)}
              </div>

              <div className="tenant-main-info">
                <h3>{tenant.name}</h3>
                <p>{tenant.type}</p>
              </div>

              <span className="tenant-room">{tenant.room}</span>
            </div>

            <div className="tenant-details">
              <div className="tenant-detail-item">
                <span>♧</span>
                <span>{tenant.phone}</span>
              </div>

              <div className="tenant-detail-item">
                <span>▣</span>
                <span>Masuk: {tenant.date}</span>
              </div>
            </div>

            <div className="tenant-package">
              <span className={`package-badge ${tenant.package.toLowerCase()}`}>
                {tenant.package}
              </span>

              <span className="tenant-price">{tenant.price}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="tenant-empty">
          <span>⌕</span>
          <p>Penghuni tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}

export default Tenants;
