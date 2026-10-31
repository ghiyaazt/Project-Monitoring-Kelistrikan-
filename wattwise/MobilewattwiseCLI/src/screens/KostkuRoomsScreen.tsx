import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import RoomCard from '../components/RoomCard';
import { colors } from '../theme';
import { Kost, Room } from '../data/mock';

interface Props {
  kost: Kost;
  rooms: Room[]; // kamar user di kost ini
  onOpenRoom: (roomId: string) => void;
}

export default function KostkuRoomsScreen({ kost, rooms, onOpenRoom }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.intro}>
        {rooms.length} kamar yang kamu huni di {kost.name}.
      </Text>
      {rooms.map(r => (
        <RoomCard key={r.id} room={r} onPress={() => onOpenRoom(r.id)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  intro: { fontSize: 12, color: colors.textSoft, marginBottom: 12 },
});
