import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import TabBar, { TabKey } from '../components/TabBar';
import HomeScreen from '../screens/HomeScreen';
import DaftarKostScreen from '../screens/DaftarKostScreen';
import KostDetailScreen from '../screens/KostDetailScreen';
import KostkuScreen from '../screens/KostkuScreen';
import KostkuRoomsScreen from '../screens/KostkuRoomsScreen';
import DaftarKamarScreen from '../screens/DaftarKamarScreen';
import KamarScreen, { KamarTab } from '../screens/KamarScreen';
import NotifikasiScreen from '../screens/NotifikasiScreen';
import ProfilScreen from '../screens/ProfilScreen';
import { kostById, myRoomIdsFor, Room, roomById, User } from '../data/mock';
import { makeSpikeNotif, Notif, notifsFor } from '../data/notifs';
import { colors } from '../theme';

interface Props {
  user: User;
  onLogout: () => void;
}

type Route =
  | { name: 'kostDetail'; kostId: string }
  | { name: 'kostkuRooms'; kostId: string }
  | { name: 'kamar'; roomId: string; initialTab?: KamarTab }
  | { name: 'notifikasi' };

const tabTitles: Record<TabKey, string> = {
  home: 'Home',
  daftarKost: 'Daftar Kost',
  kostku: 'Kostku',
  kamar: 'Daftar Kamar',
  profil: 'Profil',
};

export default function MainApp({ user, onLogout }: Props) {
  const [tab, setTab] = useState<TabKey>('home');
  const [stack, setStack] = useState<Route[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>(() => notifsFor(user.email));

  const myRooms = myRoomIdsFor(user.email)
    .map(roomById)
    .filter((r): r is Room => !!r);
  const kostCount = new Set(myRooms.map(r => r.kostId)).size;
  const unread = notifs.filter(n => !n.read).length;

  const push = (r: Route) => setStack(s => [...s, r]);
  const pop = () => setStack(s => s.slice(0, -1));

  const openRoom = (roomId: string) => push({ name: 'kamar', roomId });
  const openNotifs = () => push({ name: 'notifikasi' });

  // Ketuk notifikasi: tandai dibaca, lalu buka monitoring WattWise kamar terkait
  const openNotif = (n: Notif) => {
    setNotifs(prev =>
      prev.map(x => (x.id === n.id ? { ...x, read: true } : x)),
    );
    push({ name: 'kamar', roomId: n.roomId, initialTab: 'wattwise' });
  };

  const readAll = () =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  // Uji coba: bikin notifikasi lonjakan baru di kamar pertama yang punya sensor
  const simulateRoom = myRooms.find(r => r.deviceId);
  const simulateSpike = () => {
    if (!simulateRoom) return;
    const watt = 560 + Math.floor(Math.random() * 15) * 10; // 560 - 700 W
    setNotifs(prev => [makeSpikeNotif(simulateRoom.id, watt), ...prev]);
  };

  const missing = (
    <View style={styles.missing}>
      <Text style={styles.missingText}>Data tidak ditemukan.</Text>
      <TouchableOpacity style={styles.missingBtn} onPress={pop}>
        <Text style={styles.missingBtnText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );

  // ---------- HALAMAN DETAIL (tanpa tab bar, ada tombol kembali) ----------
  const top = stack[stack.length - 1];
  if (top) {
    let title = '';
    let subtitle: string | undefined;
    let body: React.ReactNode = missing;

    if (top.name === 'kostDetail') {
      const kost = kostById(top.kostId);
      if (kost) {
        title = kost.name;
        subtitle = 'Detail kost';
        body = <KostDetailScreen kost={kost} />;
      }
    } else if (top.name === 'kostkuRooms') {
      const kost = kostById(top.kostId);
      if (kost) {
        title = kost.name;
        subtitle = 'Kamar yang kamu huni';
        body = (
          <KostkuRoomsScreen
            kost={kost}
            rooms={myRooms.filter(r => r.kostId === kost.id)}
            onOpenRoom={openRoom}
          />
        );
      }
    } else if (top.name === 'notifikasi') {
      title = 'Notifikasi';
      subtitle = 'Peringatan lonjakan listrik';
      body = (
        <NotifikasiScreen
          notifs={notifs}
          onOpen={openNotif}
          onReadAll={readAll}
          onSimulate={simulateRoom ? simulateSpike : undefined}
        />
      );
    } else {
      const room = roomById(top.roomId);
      const kost = room ? kostById(room.kostId) : undefined;
      if (room && kost) {
        title = room.name;
        subtitle = kost.name;
        body = (
          <KamarScreen
            key={room.id}
            room={room}
            kost={kost}
            userEmail={user.email}
            initialTab={top.initialTab}
          />
        );
      }
    }

    return (
      <View style={styles.flex}>
        <AppHeader title={title || 'Detail'} subtitle={subtitle} onBack={pop} />
        <View style={styles.flex}>{body}</View>
      </View>
    );
  }

  // ---------- HALAMAN UTAMA (tab bar + lonceng notifikasi) ----------
  return (
    <View style={styles.flex}>
      <AppHeader
        title={tabTitles[tab]}
        onBellPress={openNotifs}
        unread={unread}
      />

      <View style={styles.flex}>
        {tab === 'home' && (
          <HomeScreen
            name={user.name}
            roomCount={myRooms.length}
            kostCount={kostCount}
          />
        )}
        {tab === 'daftarKost' && (
          <DaftarKostScreen
            onOpenKost={id => push({ name: 'kostDetail', kostId: id })}
          />
        )}
        {tab === 'kostku' && (
          <KostkuScreen
            rooms={myRooms}
            onOpenKost={id => push({ name: 'kostkuRooms', kostId: id })}
          />
        )}
        {tab === 'kamar' && (
          <DaftarKamarScreen rooms={myRooms} onOpenRoom={openRoom} />
        )}
        {tab === 'profil' && (
          <ProfilScreen
            user={user}
            roomCount={myRooms.length}
            onLogout={onLogout}
          />
        )}
      </View>

      <TabBar active={tab} onChange={setTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { fontSize: 14, color: colors.textSoft },
  missingBtn: {
    marginTop: 14,
    paddingHorizontal: 20,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingBtnText: { fontSize: 13, fontWeight: '800', color: colors.white },
});
