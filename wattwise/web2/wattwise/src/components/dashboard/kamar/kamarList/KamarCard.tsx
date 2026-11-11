import React from 'react';
import '../../../../styles/kamar/kamar-card.css';

interface Penghuni {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  tanggalMasuk: string;
}

interface Kamar {
  id: string;
  nama: string;
  status: 'terisi' | 'kosong';
  penghuniList?: Penghuni[];
  hargaSewa: number;
  luasKamar: number;
  fasilitas: string[];
  maxPenghuni: number;
  gambar?: string[];
  gambarProfil?: number;
}

interface KamarCardProps {
  kamar: Kamar;
  onClick?: () => void;
}

const KamarCard: React.FC<KamarCardProps> = ({ kamar, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="kamar-card"
    >
      {/* Gambar Kamar */}
      {kamar.gambar && kamar.gambar.length > 0 ? (
        <div className="kamar-card-image-container">
          <img 
            src={kamar.gambar[kamar.gambarProfil || 0]} 
            alt={kamar.nama}
            className="kamar-card-image"
          />
          {kamar.gambar.length > 1 && (
            <div className="kamar-card-image-badge">
              <svg className="kamar-card-image-badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {kamar.gambar.length}
            </div>
          )}
        </div>
      ) : null}
      
      <div className="kamar-card-body">
        <div className="kamar-flex-between kamar-card-header">
          <h3 className="kamar-card-title">
            {kamar.nama}
          </h3>
          <span className={`kamar-badge ${
            kamar.status === 'terisi'
              ? 'kamar-status-success'
              : 'kamar-status-neutral'
          }`}>
            {kamar.status === 'terisi' ? 'Terisi' : 'Kosong'}
          </span>
        </div>
        
        {kamar.penghuniList && kamar.penghuniList.length > 0 && (
          <p className="kamar-subtitle kamar-card-penghuni-info">
            <span className="kamar-card-penghuni-label">Penghuni:</span> {kamar.penghuniList.length} / {kamar.maxPenghuni} orang
          </p>
        )}
        
        <p className="kamar-subtitle kamar-card-harga-info">
          <span className="kamar-card-harga-label">Harga Sewa:</span> Rp {kamar.hargaSewa.toLocaleString('id-ID')}
        </p>

        {kamar.fasilitas && kamar.fasilitas.length > 0 && (
          <div className="kamar-card-fasilitas">
            <p className="kamar-subtitle kamar-card-fasilitas-title">
              Fasilitas:
            </p>
            <div className="kamar-card-fasilitas-list">
              {kamar.fasilitas.slice(0, 3).map(fasilitas => (
                <span
                  key={fasilitas}
                  className="kamar-badge kamar-status-info kamar-card-fasilitas-badge"
                >
                  {fasilitas}
                </span>
              ))}
              {kamar.fasilitas.length > 3 && (
                <span
                  className="kamar-badge kamar-status-neutral kamar-card-fasilitas-more"
                >
                  +{kamar.fasilitas.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KamarCard;
