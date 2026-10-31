import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface Props {
  label: string;
  value: string;
  last?: boolean;
}

export default function InfoRow({ label, value, last }: Props) {
  return (
    <View style={[styles.row, !last && styles.border]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  border: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 12, color: colors.textSoft, marginRight: 16 },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
});
