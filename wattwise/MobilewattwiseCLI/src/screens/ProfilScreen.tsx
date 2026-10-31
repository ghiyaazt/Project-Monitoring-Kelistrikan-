import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '../components/Card';
import InfoRow from '../components/InfoRow';
import Pill from '../components/Pill';
import { colors } from '../theme';
import { User } from '../data/mock';

interface Props {
  user: User;
  roomCount: number;
  onLogout: () => void;
}

export default function ProfilScreen({ user, roomCount, onLogout }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <Pill label="Penghuni" tone="green" />
      </Card>

      <Card style={styles.info}>
        <InfoRow label="No. telepon" value={user.phone} />
        <InfoRow label="Gender" value={user.gender ?? '-'} />
        <InfoRow
          label="Foto KTP"
          value={user.ktpUri ? 'Sudah diunggah' : 'Belum diunggah'}
        />
        <InfoRow label="Kamar dihuni" value={`${roomCount} kamar`} last />
      </Card>

      <TouchableOpacity
        style={styles.logout}
        onPress={onLogout}
        activeOpacity={0.85}
      >
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>

      <Text style={styles.version}>WattWise Mobile v0.0.1</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.greenBrand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: colors.white },
  name: { fontSize: 16, fontWeight: '800', color: colors.text },
  email: { fontSize: 12, color: colors.textSoft, marginTop: 2 },
  info: { paddingVertical: 4, paddingHorizontal: 16 },
  logout: {
    marginTop: 24,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.redSoft,
    borderWidth: 1,
    borderColor: colors.redLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { fontSize: 14, fontWeight: '800', color: colors.red },
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMute,
    marginTop: 16,
  },
});
