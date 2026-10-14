import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Card, { Tone } from '../components/Card';
import { colors } from '../theme';
import { kostById, roomById } from '../data/mock';
import { LIMIT_WATT, Notif, NotifType } from '../data/notifs';

interface Props {
  notifs: Notif[];
  onOpen: (n: Notif) => void;
  onReadAll: () => void;
  onSimulate?: () => void; // tombol uji coba (opsional)
}

type Filter = 'semua' | 'belum';

const look: Record<
  NotifType,
  { tone: Tone; icon: string; bg: string; fg: string }
> = {
  lonjakan: { tone: 'red', icon: '⚡', bg: '#FEE2E2', fg: colors.red },
  daya_tinggi: { tone: 'amber', icon: '⚠', bg: '#FEF3C7', fg: colors.amber },
  info: { tone: 'default', icon: '✓', bg: colors.greenSoft, fg: colors.green },
};

export default function NotifikasiScreen({
  notifs,
  onOpen,
  onReadAll,
  onSimulate,
}: Props) {
  const [filter, setFilter] = useState<Filter>('semua');

  const unread = notifs.filter(n => !n.read).length;
  const list = filter === 'belum' ? notifs.filter(n => !n.read) : notifs;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <Text style={styles.intro}>
          Peringatan jika terjadi lonjakan listrik di kamarmu (batas{' '}
          {LIMIT_WATT} W).
        </Text>
        {unread > 0 && (
          <TouchableOpacity onPress={onReadAll}>
            <Text style={styles.link}>Tandai semua{'\n'}dibaca</Text>
          </TouchableOpacity>
        )}
      </View>

      {unread > 0 ? (
        <Card tone="blue" style={styles.banner}>
          <View style={styles.bannerDot} />
          <Text style={styles.bannerText}>
            {unread} notifikasi belum dibaca
          </Text>
        </Card>
      ) : (
        <Card tone="green" style={styles.banner}>
          <Text style={[styles.bannerText, { color: colors.greenDark }]}>
            Semua notifikasi sudah dibaca
          </Text>
        </Card>
      )}

      <View style={styles.segment}>
        <TouchableOpacity
          style={[
            styles.segmentItem,
            filter === 'semua' && styles.segmentActive,
          ]}
          onPress={() => setFilter('semua')}
        >
          <Text
            style={[
              styles.segmentText,
              filter === 'semua' && styles.segmentTextActive,
            ]}
          >
            Semua ({notifs.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentItem,
            filter === 'belum' && styles.segmentActive,
          ]}
          onPress={() => setFilter('belum')}
        >
          <Text
            style={[
              styles.segmentText,
              filter === 'belum' && styles.segmentTextActive,
            ]}
          >
            Belum dibaca ({unread})
          </Text>
        </TouchableOpacity>
      </View>

      {list.length === 0 && (
        <Card style={styles.empty}>
          <Text style={styles.emptyTitle}>
            {notifs.length === 0
              ? 'Belum ada notifikasi'
              : 'Tidak ada yang belum dibaca'}
          </Text>
          <Text style={styles.emptyText}>
            {notifs.length === 0
              ? 'Peringatan lonjakan listrik dari kamarmu akan muncul di sini.'
              : 'Semua notifikasi sudah kamu baca.'}
          </Text>
        </Card>
      )}

      {list.map(n => {
        const l = look[n.type];
        const room = roomById(n.roomId);
        const kost = room ? kostById(room.kostId) : undefined;
        return (
          <TouchableOpacity
            key={n.id}
            activeOpacity={0.8}
            onPress={() => onOpen(n)}
          >
            <Card tone={n.read ? 'default' : l.tone} style={styles.item}>
              <View style={[styles.icon, { backgroundColor: l.bg }]}>
                <Text style={[styles.iconText, { color: l.fg }]}>{l.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, n.read && styles.titleRead]}>
                    {n.title}
                  </Text>
                  {!n.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.body}>{n.body}</Text>
                <Text style={styles.meta}>
                  {room ? room.name : 'Kamar'}
                  {kost ? ` · ${kost.name}` : ''} · {n.when}
                </Text>
                {n.type !== 'info' && (
                  <Text style={[styles.link, styles.itemLink]}>
                    Lihat monitoring WattWise ›
                  </Text>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}

      {onSimulate && (
        <TouchableOpacity
          style={styles.simulate}
          onPress={onSimulate}
          activeOpacity={0.85}
        >
          <Text style={styles.simulateText}>
            🧪 Uji coba: simulasikan lonjakan listrik
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  intro: {
    fontSize: 12,
    color: colors.textSoft,
    flex: 1,
    marginRight: 12,
    lineHeight: 17,
  },
  link: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
    textAlign: 'right',
  },

  banner: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bannerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginRight: 8,
  },
  bannerText: { fontSize: 12, fontWeight: '700', color: colors.blue },

  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    backgroundColor: '#E8EDF3',
    marginBottom: 14,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: colors.white },
  segmentText: { fontSize: 12, fontWeight: '700', color: colors.textSoft },
  segmentTextActive: { color: colors.green },

  item: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: { fontSize: 18, fontWeight: '800' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 14, fontWeight: '800', color: colors.text, flex: 1 },
  titleRead: { fontWeight: '700', color: '#475569' },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.blue,
    marginLeft: 8,
  },
  body: { fontSize: 12, color: colors.textSoft, marginTop: 4, lineHeight: 17 },
  meta: { fontSize: 11, color: colors.textMute, marginTop: 6 },
  itemLink: { textAlign: 'left', marginTop: 8 },

  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  emptyText: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },

  simulate: {
    marginTop: 8,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#FCA5A5',
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulateText: { fontSize: 12, fontWeight: '800', color: colors.red },
});
