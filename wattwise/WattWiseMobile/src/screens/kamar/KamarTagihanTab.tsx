import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../components/Card';
import Pill from '../../components/Pill';
import { colors } from '../../theme';
import { billsForRoom, Room } from '../../data/mock';
import { rupiah } from '../../utils/format';

interface Props {
  room: Room;
}

export default function KamarTagihanTab({ room }: Props) {
  const bills = billsForRoom(room);
  const total = (b: { rent: number; electricity: number }) =>
    b.rent + b.electricity;
  const unpaid = bills.filter(b => b.status === 'belum');
  const active = unpaid[0];
  const paidSum = bills
    .filter(b => b.status === 'lunas')
    .reduce((s, b) => s + total(b), 0);
  const unpaidSum = unpaid.reduce((s, b) => s + total(b), 0);

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* RINGKASAN */}
      <View style={styles.summary}>
        <Card tone="amber" style={styles.sumCard}>
          <Text style={styles.sumLabel}>Belum dibayar</Text>
          <Text style={[styles.sumValue, { color: colors.amber }]}>
            {rupiah(unpaidSum)}
          </Text>
        </Card>
        <Card tone="green" style={styles.sumCard}>
          <Text style={styles.sumLabel}>Sudah dibayar</Text>
          <Text style={[styles.sumValue, { color: colors.green }]}>
            {rupiah(paidSum)}
          </Text>
        </Card>
      </View>

      {/* TAGIHAN AKTIF */}
      {active ? (
        <>
          <Text style={styles.section}>Tagihan aktif</Text>
          <Card style={styles.active}>
            <View style={styles.activeTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.period}>{active.period}</Text>
                <Text style={styles.due}>Jatuh tempo {active.dueDate}</Text>
              </View>
              <Pill label="Belum lunas" tone="amber" />
            </View>
            <View style={styles.sep} />
            <View style={styles.line}>
              <Text style={styles.lineLabel}>Sewa kamar</Text>
              <Text style={styles.lineValue}>{rupiah(active.rent)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.lineLabel}>Listrik</Text>
              <Text style={styles.lineValue}>{rupiah(active.electricity)}</Text>
            </View>
            <View style={styles.sep} />
            <View style={styles.line}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{rupiah(total(active))}</Text>
            </View>
          </Card>
        </>
      ) : (
        <Card tone="green" style={styles.allPaid}>
          <Text style={styles.allPaidText}>Semua tagihan sudah lunas 🎉</Text>
        </Card>
      )}

      {/* RIWAYAT */}
      <Text style={styles.section}>Riwayat tagihan</Text>
      {bills.map(b => (
        <Card key={b.id} style={styles.history}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hPeriod}>{b.period}</Text>
            <Text style={styles.hSub}>
              {b.status === 'lunas'
                ? `Dibayar ${b.paidAt}`
                : `Jatuh tempo ${b.dueDate}`}
            </Text>
          </View>
          <View style={styles.hRight}>
            <Text style={styles.hAmount}>{rupiah(total(b))}</Text>
            <Pill
              label={b.status === 'lunas' ? 'Lunas' : 'Belum lunas'}
              tone={b.status === 'lunas' ? 'green' : 'amber'}
            />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  summary: { flexDirection: 'row' },
  sumCard: { flex: 1, marginRight: 10 },
  sumLabel: { fontSize: 11, color: colors.textSoft },
  sumValue: { fontSize: 16, fontWeight: '800', marginTop: 6 },

  section: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSoft,
    marginTop: 18,
    marginBottom: 10,
  },

  active: { padding: 16 },
  activeTop: { flexDirection: 'row', alignItems: 'center' },
  period: { fontSize: 16, fontWeight: '800', color: colors.text },
  due: { fontSize: 11, color: colors.textSoft, marginTop: 3 },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  lineLabel: { fontSize: 12, color: colors.textSoft },
  lineValue: { fontSize: 13, fontWeight: '700', color: colors.text },
  totalLabel: { fontSize: 13, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 16, fontWeight: '800', color: colors.text },

  allPaid: { alignItems: 'center', paddingVertical: 18, marginTop: 18 },
  allPaidText: { fontSize: 13, fontWeight: '800', color: colors.greenDark },

  history: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  hPeriod: { fontSize: 14, fontWeight: '800', color: colors.text },
  hSub: { fontSize: 11, color: colors.textSoft, marginTop: 3 },
  hRight: { alignItems: 'flex-end' },
  hAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
});
