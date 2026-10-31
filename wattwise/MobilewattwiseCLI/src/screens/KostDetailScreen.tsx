import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import InfoRow from '../components/InfoRow';
import Pill from '../components/Pill';
import { colors } from '../theme';
import { Kost } from '../data/mock';
import { rupiah } from '../utils/format';

interface Props {
  kost: Kost;
}

export default function KostDetailScreen({ kost }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <Text style={styles.heroType}>Kost {kost.type}</Text>
        <Text style={styles.heroName}>{kost.name}</Text>
        <Text style={styles.heroAddress}>{kost.address}</Text>
      </View>

      <Card style={styles.card}>
        <InfoRow
          label="Harga mulai"
          value={`${rupiah(kost.priceFrom)} /bulan`}
        />
        <InfoRow
          label="Kamar tersedia"
          value={`${kost.availableRooms} dari ${kost.totalRooms} kamar`}
        />
        <InfoRow label="Pemilik" value={kost.ownerName} />
        <InfoRow label="Kontak pemilik" value={kost.ownerPhone} last />
      </Card>

      <Text style={styles.section}>Fasilitas</Text>
      <View style={styles.chips}>
        {kost.facilities.map(f => (
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
  hero: {
    backgroundColor: colors.greenBrand,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 14,
  },
  heroCircle: {
    position: 'absolute',
    right: -60,
    bottom: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(37,99,235,0.5)',
  },
  heroType: { fontSize: 11, color: '#D1FAE5', fontWeight: '700' },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    marginTop: 4,
  },
  heroAddress: { fontSize: 12, color: '#D1FAE5', marginTop: 4 },
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
