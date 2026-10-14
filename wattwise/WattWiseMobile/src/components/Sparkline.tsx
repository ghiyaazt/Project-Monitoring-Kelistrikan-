import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

interface Props {
  data: number[];
  height?: number;
  limit?: number; // garis batas daya (putus-putus)
}

// Grafik batang sederhana tanpa library tambahan (aman untuk native & web).
export default function Sparkline({ data, height = 130, limit }: Props) {
  const top = Math.max(...data, limit ?? 0) * 1.08;
  const bottom = Math.min(...data) * 0.7;
  const range = top - bottom || 1;

  return (
    <View style={{ height }}>
      {limit !== undefined && (
        <View
          style={[
            styles.limit,
            { bottom: ((limit - bottom) / range) * height },
          ]}
        />
      )}
      <View style={styles.row}>
        {data.map((v, i) => {
          const last = i === data.length - 1;
          return (
            <View key={i} style={styles.col}>
              <View
                style={{
                  height: Math.max(6, ((v - bottom) / range) * height),
                  backgroundColor: last ? colors.blue : '#BFDBFE',
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', alignItems: 'flex-end' },
  col: { flex: 1, paddingHorizontal: 1.5, justifyContent: 'flex-end' },
  limit: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#FBBF24',
    zIndex: 1,
  },
});
