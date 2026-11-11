// Router configuration placeholder
// Future: dapat digunakan untuk React Router setup

export const routes = {
  landing: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  kamarList: '/kamar',
  detailKamar: '/kamar/:id',
  penghuni: '/penghuni',
  laporanKeuangan: '/laporan-keuangan',
  pengaturan: '/pengaturan',
  profil: '/profil',
} as const;

export type RoutePath = typeof routes[keyof typeof routes];
