import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import { Kost, Room } from '../data/mock';
import KamarDetailTab from './kamar/KamarDetailTab';
import KamarPenghuniTab from './kamar/KamarPenghuniTab';
import KamarTagihanTab from './kamar/KamarTagihanTab';
import KamarWattwiseTab from './kamar/KamarWattwiseTab';

export type KamarTab = 'detail' | 'penghuni' | 'tagihan' | 'wattwise';

interface Props {
  room: Room;
  kost: Kost;
  userEmail: string;
  initialTab?: KamarTab; // tab yang dibuka pertama kali
}

const inner: { key: KamarTab; label: string }[] = [
  { key: 'detail', label: 'Detail' },
  { key: 'penghuni', label: 'Penghuni' },
  { key: 'tagihan', label: 'Tagihan' },
  { key: 'wattwise', label: 'WattWise' },
];

export default function KamarScreen({
  room,
  kost,
  userEmail,
  initialTab,
}: Props) {
  const [tab, setTab] = useState<KamarTab>(initialTab ?? 'detail');

  return (
    <View style={styles.flex}>
      <View style={styles.tabs}>
        {inner.map(t => {
          const active = t.key === tab;
          return (
            <TouchableOpacity
              key={t.key}
              style={styles.tab}
              onPress={() => setTab(t.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label}
              </Text>
              <View
                style={[styles.underline, active && styles.underlineActive]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.flex}>
        {tab === 'detail' && <KamarDetailTab room={room} kost={kost} />}
        {tab === 'penghuni' && (
          <KamarPenghuniTab roomId={room.id} userEmail={userEmail} />
        )}
        {tab === 'tagihan' && <KamarTagihanTab room={room} />}
        {tab === 'wattwise' && <KamarWattwiseTab room={room} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingTop: 12 },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMute,
    marginBottom: 10,
  },
  tabTextActive: { color: colors.green },
  underline: {
    height: 3,
    width: '60%',
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  underlineActive: { backgroundColor: colors.green },
});
