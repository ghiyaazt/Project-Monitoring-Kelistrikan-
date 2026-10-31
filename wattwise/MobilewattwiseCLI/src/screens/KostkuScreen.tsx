import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '../components/Card';
import { colors } from '../theme';
import { kostById, Room } from '../data/mock';

interface Props {
  rooms: Room[]; // kamar yang dihuni user
  onOpenKost: (kostId: string) => void;
}

export default function KostkuScreen({ rooms, onOpenKost }: Props) {
  const kostIds = Array.from(new Set(rooms.map(r => r.kostId)));

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.intro}>
        Kost yang kamu huni. Ketuk untuk melihat kamarmu di sana.
      </Text>

      {kostIds.length === 0 && (
        <Card style={styles.empty}>
          <Text style={styles.emptyTitle}>Belum ada kost yang kamu huni</Text>
          <Text style={styles.emptyText}>
            Hubungi pemilik kost agar kamu ditambahkan sebagai penghuni kamar.
          </Text>
        </Card>
      )}

      {kostIds.map(id => {
        const kost = kostById(id);
        if (!kost) return null;
        const count = rooms.filter(r => r.kostId === id).length;
        return (
          <TouchableOpacity
            key={id}
            activeOpacity={0.8}
            onPress={() => onOpenKost(id)}
          >
            <Card style={styles.card}>
              <View style={styles.top}>
                <View style={styles.icon}>
                  <Text style={styles.iconText}>🔑</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{kost.name}</Text>
                  <Text style={styles.address} numberOfLines={1}>
                    {kost.address}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
              <View style={styles.bottom}>
                <Text style={styles.count}>
                  <Text style={styles.countNum}>{count}</Text> kamar dihuni
                </Text>
                <Text style={styles.owner}>Pemilik: {kost.ownerName}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  intro: { fontSize: 12, color: colors.textSoft, marginBottom: 12 },
  card: { marginBottom: 12, padding: 16 },
  top: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: { fontSize: 20 },
  name: { fontSize: 15, fontWeight: '800', color: colors.text },
  address: { fontSize: 11, color: colors.textSoft, marginTop: 2 },
  chevron: { fontSize: 24, color: colors.textMute, marginLeft: 8 },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  count: { fontSize: 12, color: colors.textSoft },
  countNum: { fontWeight: '800', color: colors.text },
  owner: { fontSize: 12, color: colors.textSoft },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  emptyText: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
