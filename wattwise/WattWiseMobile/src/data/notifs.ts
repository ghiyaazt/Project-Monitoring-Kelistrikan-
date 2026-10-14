import { DEMO_USER } from './mock';

export type NotifType = 'lonjakan' | 'daya_tinggi' | 'info';

export interface Notif {
  id: string;
  roomId: string;
  type: NotifType;
  title: string;
  body: string;
  when: string; // contoh: "Hari ini, 10:42"
  read: boolean;
}

// Batas daya (watt) yang dianggap lonjakan
export const LIMIT_WATT = 550;

// Notifikasi awal (dummy). Akun baru belum punya kamar, jadi kosong.
export const notifsFor = (email: string): Notif[] =>
  email === DEMO_USER.email
    ? [
        {
          id: 'n1',
          roomId: 'r1',
          type: 'lonjakan',
          title: 'Lonjakan listrik terdeteksi',
          body: `Daya mencapai 612 W, melewati batas ${LIMIT_WATT} W.`,
          when: 'Hari ini, 10:42',
          read: false,
        },
        {
          id: 'n2',
          roomId: 'r2',
          type: 'daya_tinggi',
          title: 'Daya tinggi berkepanjangan',
          body: 'Daya di atas 500 W selama lebih dari 10 menit.',
          when: 'Hari ini, 09:30',
          read: false,
        },
        {
          id: 'n3',
          roomId: 'r1',
          type: 'info',
          title: 'Sensor terhubung',
          body: 'Sensor FC24-0112 kembali terhubung ke server.',
          when: 'Kemarin, 09:00',
          read: true,
        },
        {
          id: 'n4',
          roomId: 'r1',
          type: 'lonjakan',
          title: 'Lonjakan listrik terdeteksi',
          body: `Daya mencapai 580 W, melewati batas ${LIMIT_WATT} W.`,
          when: 'Kemarin, 20:31',
          read: true,
        },
        {
          id: 'n5',
          roomId: 'r2',
          type: 'lonjakan',
          title: 'Lonjakan listrik terdeteksi',
          body: `Daya mencapai 565 W, melewati batas ${LIMIT_WATT} W.`,
          when: '12 Okt, 21:15',
          read: true,
        },
      ]
    : [];

const pad = (n: number) => String(n).padStart(2, '0');

// Dipakai tombol uji coba. Nanti diganti notifikasi dari backend / sensor.
export function makeSpikeNotif(roomId: string, watt: number): Notif {
  const d = new Date();
  return {
    id: `n${Date.now()}`,
    roomId,
    type: 'lonjakan',
    title: 'Lonjakan listrik terdeteksi',
    body: `Daya mencapai ${watt} W, melewati batas ${LIMIT_WATT} W.`,
    when: `Hari ini, ${pad(d.getHours())}:${pad(d.getMinutes())}`,
    read: false,
  };
}
