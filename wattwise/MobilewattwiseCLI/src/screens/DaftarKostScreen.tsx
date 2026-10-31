import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '../components/Card';
import Pill from '../components/Pill';
import { colors } from '../theme';
import { allKost } from '../data/mock';
import { rupiah } from '../utils/format';

interface Props {
  onOpenKost: (id: string) => void;
}

const typeTone = { Putra: 'blue', Putri: 'amber', Campur: 'gray' } as const;

export default function DaftarKostScreen({ onOpenKost }: Props) {
  const [q, setQ] = useState('');
  const list = allKost.filter(k =>
    `${k.name} ${k.address}`.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.intro}>Kost yang sudah terdaftar di WattWise.</Text>

      <TextInput
        style={styles.search}
        value={q}
        onChangeText={setQ}
        placeholder="Cari nama atau alamat kost"
        placeholderTextColor={colors.textMute}
      />

      {list.length === 0 && (
        <Card style={styles.empty}>
          <Text style={styles.emptyTitle}>Kost tidak ditemukan</Text>
          <Text style={styles.emptyText}>Coba kata kunci lain.</Text>
        </Card>
      )}

      {list.map(k => (
        <TouchableOpacity
          key={k.id}
          activeOpacity={0.8}
          onPress={() => onOpenKost(k.id)}
        >
          <Card style={styles.card}>
            <View style={styles.top}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>🏘️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{k.name}</Text>
                <Text style={styles.address} numberOfLines={1}>
                  {k.address}
                </Text>
              </View>
              <Pill label={k.type} tone={typeTone[k.type]} />
            </View>
            <View style={styles.bottom}>
              <Text style={styles.price}>
                Mulai {rupiah(k.priceFrom)}
                <Text style={styles.unit}> /bulan</Text>
              </Text>
              <Text
                style={[styles.avail, k.availableRooms === 0 && styles.full]}
              >
                {k.availableRooms > 0
                  ? `${k.availableRooms} kamar kosong`
                  : 'Penuh'}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  intro: { fontSize: 12, color: colors.textSoft, marginBottom: 12 },
  search: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
    marginBottom: 14,
  },
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
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  price: { fontSize: 13, fontWeight: '800', color: colors.text },
  unit: { fontSize: 11, fontWeight: '600', color: colors.textMute },
  avail: { fontSize: 12, fontWeight: '700', color: colors.green },
  full: { color: colors.red },
  empty: { alignItems: 'center', paddingVertical: 28 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  emptyText: { fontSize: 12, color: colors.textSoft, marginTop: 4 },
});
