import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

export type TabKey = 'home' | 'daftarKost' | 'kostku' | 'kamar' | 'profil';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'daftarKost', label: 'Daftar Kost', icon: '🏘️' },
  { key: 'kostku', label: 'Kostku', icon: '🔑' },
  { key: 'kamar', label: 'Kamar', icon: '🚪' },
  { key: 'profil', label: 'Profil', icon: '👤' },
];

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export default function TabBar({ active, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {tabs.map(t => {
        const isActive = t.key === active;
        return (
          <TouchableOpacity
            key={t.key}
            style={styles.item}
            onPress={() => onChange(t.key)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.indicator, isActive && styles.indicatorActive]}
            />
            <Text style={[styles.icon, !isActive && styles.iconInactive]}>
              {t.icon}
            </Text>
            <Text
              style={[styles.label, isActive && styles.labelActive]}
              numberOfLines={1}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 6,
  },
  item: { flex: 1, alignItems: 'center', paddingBottom: 6 },
  indicator: {
    height: 3,
    width: 28,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 7,
  },
  indicatorActive: { backgroundColor: colors.green },
  icon: { fontSize: 20 },
  iconInactive: { opacity: 0.55 },
  label: {
    fontSize: 10,
    color: colors.textMute,
    marginTop: 3,
    fontWeight: '600',
  },
  labelActive: { color: colors.green, fontWeight: '700' },
});
