import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Card from '../components/Card';
import RoomCard from '../components/RoomCard';
import { colors } from '../theme';
import { kostById, Room } from '../data/mock';

interface Props {
  rooms: Room[];
  onOpenRoom: (roomId: string) => void;
}

export default function DaftarKamarScreen({ rooms, onOpenRoom }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.intro}>Semua kamar yang sedang kamu huni.</Text>

      {rooms.length === 0 && (
        <Card style={styles.empty}>
          <Text style={styles.emptyTitle}>Belum ada kamar</Text>
          <Text style={styles.emptyText}>
            Kamu belum terdaftar sebagai penghuni kamar mana pun.
          </Text>
        </Card>
      )}

      {rooms.map(r => (
        <RoomCard
          key={r.id}
          room={r}
          kostName={kostById(r.kostId)?.name}
          onPress={() => onOpenRoom(r.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  intro: { fontSize: 12, color: colors.textSoft, marginBottom: 12 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  emptyText: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 6,
    textAlign: 'center',
  },
});
