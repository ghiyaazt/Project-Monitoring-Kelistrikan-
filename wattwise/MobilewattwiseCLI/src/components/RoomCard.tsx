import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from './Card';
import Pill from './Pill';
import { colors } from '../theme';
import { billsForRoom, Room } from '../data/mock';
import { rupiah } from '../utils/format';

interface Props {
  room: Room;
  kostName?: string;
  onPress: () => void;
}

export default function RoomCard({ room, kostName, onPress }: Props) {
  const latest = billsForRoom(room)[0];
  const paid = latest.status === 'lunas';

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.top}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>🚪</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{room.name}</Text>
            <Text style={styles.sub} numberOfLines={1}>
              {kostName ? `${kostName} · ` : ''}Lantai {room.floor} ·{' '}
              {room.size}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.price}>
            {rupiah(room.price)}
            <Text style={styles.unit}> /bulan</Text>
          </Text>
          <Pill
            label={paid ? 'Tagihan lunas' : 'Belum lunas'}
            tone={paid ? 'green' : 'amber'}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  sub: { fontSize: 11, color: colors.textSoft, marginTop: 2 },
  chevron: { fontSize: 24, color: colors.textMute, marginLeft: 8 },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  price: { fontSize: 14, fontWeight: '800', color: colors.text },
  unit: { fontSize: 11, fontWeight: '600', color: colors.textMute },
});
