import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type PillTone = 'green' | 'red' | 'amber' | 'blue' | 'gray';

const map: Record<PillTone, { bg: string; fg: string }> = {
  green: { bg: colors.greenSoft, fg: colors.greenDark },
  red: { bg: '#FEE2E2', fg: colors.red },
  amber: { bg: '#FEF3C7', fg: '#B45309' },
  blue: { bg: '#DBEAFE', fg: colors.blue },
  gray: { bg: '#F1F5F9', fg: colors.textSoft },
};

interface Props {
  label: string;
  tone?: PillTone;
  dot?: boolean;
  solid?: boolean; // merah solid, dipakai untuk label "Baru"
}

export default function Pill({
  label,
  tone = 'green',
  dot = false,
  solid = false,
}: Props) {
  const c = map[tone];
  return (
    <View style={[styles.pill, { backgroundColor: solid ? colors.red : c.bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: c.fg }]} />}
      <Text style={[styles.text, { color: solid ? colors.white : c.fg }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  text: { fontSize: 11, fontWeight: '700' },
});
