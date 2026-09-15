import { useEffect, useRef, useState } from "react";
import "./Landing.css";

// Simple animated "voltage pulse" line — the recurring visual motif of the page.
// Draws an EKG-like waveform that redraws itself, representing live electricity monitoring.
function PulseLine() {
  const pathRef = useRef(null);

  return (
    <svg
      className="pulse-svg"
      viewBox="0 0 600 160"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        ref={pathRef}
        className="pulse-line"
        fill="none"
        points="0,80 60,80 90,30 120,130 150,80 260,80 290,45 320,115 350,80 460,80 490,20 520,140 550,80 600,80"
      />
    </svg>
  );
}

// Ticks a display number up toward a target once it enters view — used once, for the hero stat.
function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [value, ref];
}

const steps = [
  {
    n: "01",
    title: "Pasang titik pantau",
    body: "Hubungkan alat pemantau ke titik listrik yang mau diawasi — per kamar, per lantai, atau seluruh bangunan.",
  },
  {
    n: "02",
    title: "Pantau secara real-time",
    body: "Data pemakaian masuk langsung ke dashboard. Lihat pola konsumsi tiap titik dari mana saja.",
  },
  {
    n: "03",
    title: "Deteksi anomali otomatis",
    body: "Sistem menandai lonjakan atau pola aneh yang beda dari kebiasaan — sebelum jadi masalah besar.",
  },
  {
    n: "04",
    title: "Dapat notifikasi",
    body: "Begitu ada anomali, kamu langsung dapat notifikasi lengkap dengan detail titik dan waktunya.",
  },
];

const features = [
  {
    title: "Riwayat pemakaian",
    body: "Bandingkan konsumsi listrik antar hari, minggu, atau bulan dalam satu tampilan.",
    size: "large",
  },
  {
    title: "Multi-titik",
    body: "Satu dashboard buat semua titik listrik, gak perlu bolak-balik aplikasi.",
    size: "small",
  },
  {
    title: "Manajemen penghuni",
    body: "Kalau kamu kelola kos atau kontrakan, tiap penghuni bisa dipetakan ke titik listriknya sendiri.",
    size: "small",
  },
  {
    title: "Laporan siap pakai",
    body: "Unduh ringkasan pemakaian dan anomali kapan pun dibutuhkan.",
    size: "large",
  },
];

export default function Landing({ onGetStarted }) {
  const [statValue, statRef] = useCountUp(2450);

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <span className="lp-logo">
            Watt<span className="lp-logo-accent">Wise</span>
          </span>
          <nav className="lp-nav-links">
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#fitur">Fitur</a>
            <a href="#kontak">Kontak</a>
          </nav>
          <button onClick={onGetStarted} className="lp-nav-cta">
            Masuk
          </button>
        </div>
      </header>

      <main>
        <section className="lp-hero">
          <div className="lp-hero-text">
            <p className="lp-eyebrow">Pemantauan listrik yang gak bikin panik</p>
            <h1>
              Tau titik boros dan titik bahaya, sebelum tagihan yang kasih tau.
            </h1>
            <p className="lp-hero-sub">
              WattWise mengawasi tiap titik listrik secara real-time dan
              menandai pola yang gak wajar — jadi kamu bisa gerak duluan,
              bukan baru tahu pas sudah telat.
            </p>
            <div className="lp-hero-actions">
              <button onClick={onGetStarted} className="lp-btn-primary">
                Coba WattWise
              </button>
              <a href="#cara-kerja" className="lp-btn-ghost">
                Lihat cara kerjanya
              </a>
            </div>
          </div>

          <div className="lp-hero-visual" ref={statRef}>
            <div className="lp-pulse-card">
              <PulseLine />
              <div className="lp-pulse-readout">
                <span className="lp-pulse-value">
                  {statValue.toLocaleString("id-ID")}
                  <span className="lp-pulse-unit">kWh</span>
                </span>
                <span className="lp-pulse-label">
                  dipantau bulan ini, 0 anomali terlewat
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-marquee" aria-hidden="true">
          <div className="lp-marquee-track">
            <span>ARUS NORMAL</span>
            <span>·</span>
            <span>TEGANGAN STABIL</span>
            <span>·</span>
            <span>ANOMALI TERDETEKSI</span>
            <span>·</span>
            <span>NOTIFIKASI TERKIRIM</span>
            <span>·</span>
            <span>ARUS NORMAL</span>
            <span>·</span>
            <span>TEGANGAN STABIL</span>
            <span>·</span>
            <span>ANOMALI TERDETEKSI</span>
            <span>·</span>
            <span>NOTIFIKASI TERKIRIM</span>
            <span>·</span>
          </div>
        </section>

        <section id="cara-kerja" className="lp-steps">
          <h2>Empat langkah, bukan empat aplikasi</h2>
          <div className="lp-steps-list">
            {steps.map((step) => (
              <div className="lp-step" key={step.n}>
                <span className="lp-step-n">{step.n}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="fitur" className="lp-features">
          <div className="lp-features-head">
            <h2>Semua yang perlu kamu lihat, satu dashboard</h2>
            <p>Gak ada fitur yang dipaksain. Cuma yang benar-benar kepakai.</p>
          </div>
          <div className="lp-features-grid">
            {features.map((f) => (
              <div className={`lp-feature lp-feature-${f.size}`} key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="kontak" className="lp-cta">
          <h2>Mulai pantau titik listrikmu hari ini</h2>
          <p>Gratis buat dicoba, gak perlu kartu kredit.</p>
          <button onClick={onGetStarted} className="lp-btn-primary">
            Buat akun
          </button>
        </section>
      </main>

      <footer className="lp-footer">
        <span>
          Watt<span className="lp-logo-accent">Wise</span>
        </span>
        <span className="lp-footer-copy">© 2026 WattWise</span>
      </footer>
    </div>
  );
}