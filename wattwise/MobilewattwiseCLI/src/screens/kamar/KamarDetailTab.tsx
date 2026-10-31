import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../components/Card';
import InfoRow from '../../components/InfoRow';
import Pill from '../../components/Pill';
import { colors } from '../../theme';
import { Kost, Room } from '../../data/mock';
import { rupiah } from '../../utils/format';

interface Props {
  room: Room;
  kost: Kost;
}

export default function KamarDetailTab({ room, kost }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.card}>
        <InfoRow label="Kost" value={kost.name} />
        <InfoRow label="Alamat" value={kost.address} />
        <InfoRow label="Nomor kamar" value={room.name} />
        <InfoRow label="Lantai" value={String(room.floor)} />
        <InfoRow label="Ukuran" value={room.size} />
        <InfoRow label="Harga sewa" value={`${rupiah(room.price)} /bulan`} />
        <InfoRow label="Mulai dihuni" value={room.since} />
        <InfoRow
          label="Sensor listrik"
          value={room.deviceId ?? 'Belum terpasang'}
          last
        />
      </Card>

      <Text style={styles.section}>Fasilitas kamar</Text>
      <View style={styles.chips}>
        {room.facilities.map(f => (
          <View key={f} style={styles.chip}>
            <Pill label={f} tone="gray" />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  card: { paddingVertical: 4, paddingHorizontal: 16 },
  section: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSoft,
    marginTop: 18,
    marginBottom: 10,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: 8, marginBottom: 8 },
});
