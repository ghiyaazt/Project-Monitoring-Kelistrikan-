import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../components/Card';
import Pill from '../../components/Pill';
import { colors } from '../../theme';
import { occupantsByRoom } from '../../data/mock';

interface Props {
  roomId: string;
  userEmail: string;
}

export default function KamarPenghuniTab({ roomId, userEmail }: Props) {
  const list = occupantsByRoom[roomId] ?? [];

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.intro}>{list.length} penghuni di kamar ini.</Text>

      {list.map(o => {
        const isMe = o.email === userEmail;
        return (
          <Card
            key={o.id}
            tone={isMe ? 'green' : 'default'}
            style={styles.item}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {o.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{o.name}</Text>
                {isMe && <Pill label="Kamu" tone="green" />}
              </View>
              <Text style={styles.sub}>{o.phone}</Text>
              <Text style={styles.sub}>Menghuni sejak {o.since}</Text>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  intro: { fontSize: 12, color: colors.textSoft, marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.greenBrand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.white },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '800', color: colors.text, marginRight: 8 },
  sub: { fontSize: 11, color: colors.textSoft, marginTop: 2 },
});
