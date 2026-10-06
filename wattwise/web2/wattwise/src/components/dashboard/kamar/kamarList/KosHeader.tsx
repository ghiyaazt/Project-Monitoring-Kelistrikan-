import React from 'react';

interface Kos {
  id: string;
  nama: string;
  alamat: string;
  jumlahKamar: number;
}

interface KosHeaderProps {
  kos: Kos;
  kamarTerisi: number;
  onTambahKamar: () => void;
  onPengaturan?: () => void;
  onBack?: () => void;
}

const KosHeader: React.FC<KosHeaderProps> = ({ 
  kos, 
  kamarTerisi, 
  onTambahKamar,
  onPengaturan,
  onBack 
}) => {
  return (
    <div className="kamar-header">
      <div className="kamar-header-left">
        {onBack && (
          <button
            onClick={onBack}
            className="kamar-back-btn"
            title="Kembali ke Daftar Kos"
          >
            <svg className="kamar-back-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="kamar-title">{kos.nama}</h1>
          <p className="kamar-subtitle">
            {kos.alamat} · {kamarTerisi} / {kos.jumlahKamar} kamar terisi
          </p>
        </div>
      </div>
      <div className="kamar-header-actions">
        {onPengaturan && (
          <button
            onClick={onPengaturan}
            className="kamar-btn-primary"
          >
            <svg className="kamar-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Pengaturan Kos
          </button>
        )}
        <button
          onClick={onTambahKamar}
          className="kamar-btn-primary"
        >
          <svg className="kamar-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kamar
        </button>
      </div>
    </div>
  );
};

export default KosHeader;
