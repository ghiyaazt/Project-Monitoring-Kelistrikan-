import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';

export type Tone = 'default' | 'blue' | 'green' | 'purple' | 'red' | 'amber';

export const tones: Record<Tone, { bg: string; border: string; fg: string }> = {
  default: { bg: colors.card, border: colors.border, fg: colors.text },
  blue: { bg: colors.blueSoft, border: colors.blueLine, fg: colors.blue },
  green: { bg: '#F0FDF4', border: colors.greenLine, fg: colors.green },
  purple: {
    bg: colors.purpleSoft,
    border: colors.purpleLine,
    fg: colors.purple,
  },
  red: { bg: colors.redSoft, border: colors.redLine, fg: colors.red },
  amber: { bg: colors.amberSoft, border: colors.amberLine, fg: colors.amber },
};

interface Props {
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function Card({ tone = 'default', style, children }: Props) {
  const t = tones[tone];
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.bg, borderColor: t.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 14,
  },
});
