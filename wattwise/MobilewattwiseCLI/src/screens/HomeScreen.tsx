import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Card from '../components/Card';
import { colors } from '../theme';

interface Props {
  name: string;
  roomCount: number;
  kostCount: number;
}

export default function HomeScreen({ name, roomCount, kostCount }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.hello}>Halo, {name} 👋</Text>
      <Text style={styles.sub}>
        Kamu menghuni {roomCount} kamar di {kostCount} kost.
      </Text>

      <Card tone="amber" style={styles.card}>
        <Text style={styles.cardTitle}>Home sedang disiapkan</Text>
        <Text style={styles.cardText}>
          Tampilan Home akan dikerjakan terakhir. Untuk sekarang, pakai menu di
          bawah: Daftar Kost, Kostku, dan Kamar.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  hello: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 8 },
  sub: { fontSize: 13, color: colors.textSoft, marginTop: 4, marginBottom: 18 },
  card: { padding: 16 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  cardText: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 6,
    lineHeight: 18,
  },
});
