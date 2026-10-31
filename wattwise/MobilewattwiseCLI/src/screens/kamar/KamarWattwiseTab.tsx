import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card, { tones } from '../../components/Card';
import Pill from '../../components/Pill';
import Sparkline from '../../components/Sparkline';
import { colors } from '../../theme';
import { anomalies, devices, initialPowerSeries, Room } from '../../data/mock';
import useLivePower from '../../hooks/useLivePower';

interface Props {
  room: Room;
}

const LIMIT_WATT = 550;

function Metric({
  tone,
  label,
  note,
  value,
  unit,
  live,
}: {
  tone: 'blue' | 'green' | 'purple';
  label: string;
  note: string;
  value: string;
  unit: string;
  live?: boolean;
}) {
  return (
    <Card tone={tone} style={styles.metric}>
      <View style={{ flex: 1 }}>
        <View style={styles.metricLabelRow}>
          <Text style={[styles.metricLabel, { color: tones[tone].fg }]}>
            {label}
          </Text>
          {live && (
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          )}
        </View>
        <Text style={styles.metricNote}>{note}</Text>
      </View>
      <Text style={styles.metricValue}>
        {value} <Text style={styles.metricUnit}>{unit}</Text>
      </Text>
    </Card>
  );
}

function LiveView({ room }: { room: Room }) {
  const live = useLivePower(initialPowerSeries);
  const newCount = anomalies.filter(a => a.baru).length;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.source}>Data dari ESP32 · {room.deviceId}</Text>

      <Metric
        tone="blue"
        label="Daya Saat Ini"
        note="Diperbarui barusan"
        value={String(live.power)}
        unit="W"
        live
      />
      <Metric
        tone="green"
        label="Tegangan"
        note="Stabil"
        value={String(live.voltage)}
        unit="V"
      />
      <Metric
        tone="purple"
        label="Arus"
        note="Diperbarui barusan"
        value={live.current.toFixed(2)}
        unit="A"
      />

      <Card style={styles.chart}>
        <Text style={styles.chartTitle}>Grafik Real-time</Text>
        <Text style={styles.chartSub}>Pembaruan otomatis setiap detik</Text>
        <View style={{ marginTop: 18 }}>
          <Sparkline data={live.series} height={140} limit={LIMIT_WATT} />
        </View>
        <Text style={styles.chartLegend}>
          Garis putus-putus: batas daya {LIMIT_WATT} W
        </Text>
      </Card>

      <View style={styles.row}>
        <Card tone="green" style={styles.half}>
          <Text style={styles.halfLabel}>Status Sensor</Text>
          <Text style={[styles.halfValue, { color: colors.green }]}>
            TERHUBUNG
          </Text>
          <Text style={styles.halfNote}>ESP32</Text>
        </Card>
        <Card tone="green" style={styles.half}>
          <Text style={styles.halfLabel}>Last Update</Text>
          <Text style={styles.halfValue}>{live.updatedAt}</Text>
          <Text style={styles.halfNote}>WIB</Text>
        </Card>
      </View>

      <Text style={styles.section}>Perangkat aktif</Text>
      <View style={styles.grid}>
        {devices.map(d => (
          <Card key={d.id} style={styles.deviceCard}>
            <Text style={styles.deviceName}>{d.name}</Text>
            <Text style={styles.deviceWatt}>
              {d.watt} <Text style={styles.deviceUnit}>W</Text>
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(100, (d.watt / 270) * 100)}%`,
                    backgroundColor: d.color,
                  },
                ]}
              />
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionNoMargin}>Anomali terbaru</Text>
        {newCount > 0 && <Pill label={`${newCount} Baru`} tone="red" />}
      </View>
      {anomalies.map(a => (
        <Card
          key={a.id}
          tone={a.baru ? 'red' : 'default'}
          style={styles.anomaly}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.anomalyName}>{a.device}</Text>
            <Text style={styles.anomalySub}>
              {a.watt} W terdeteksi · {a.date}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.anomalyTime}>{a.time}</Text>
            <Text style={styles.anomalyDelta}>{a.delta}</Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

export default function KamarWattwiseTab({ room }: Props) {
  if (!room.deviceId) {
    return (
      <View style={styles.noSensor}>
        <Text style={styles.noSensorIcon}>📡</Text>
        <Text style={styles.noSensorTitle}>Sensor belum terpasang</Text>
        <Text style={styles.noSensorText}>
          Kamar ini belum punya sensor WattWise, jadi data listrik belum bisa
          ditampilkan. Hubungi pemilik kost untuk pemasangan.
        </Text>
      </View>
    );
  }
  return <LiveView room={room} />;
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 28 },
  source: { fontSize: 12, color: colors.textSoft, marginBottom: 12 },

  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 16,
  },
  metricLabelRow: { flexDirection: 'row', alignItems: 'center' },
  metricLabel: { fontSize: 13, fontWeight: '800' },
  liveRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 4,
  },
  liveText: { fontSize: 10, fontWeight: '700', color: colors.green },
  metricNote: { fontSize: 11, color: colors.textSoft, marginTop: 4 },
  metricValue: { fontSize: 30, fontWeight: '800', color: colors.text },
  metricUnit: { fontSize: 16, fontWeight: '700', color: colors.textMute },

  chart: { padding: 16, marginBottom: 12 },
  chartTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  chartSub: { fontSize: 12, color: colors.textSoft, marginTop: 2 },
  chartLegend: { fontSize: 10, color: colors.textMute, marginTop: 10 },

  row: { flexDirection: 'row' },
  half: { flex: 1, marginRight: 10 },
  halfLabel: { fontSize: 12, color: colors.textSoft },
  halfValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 6,
  },
  halfNote: { fontSize: 11, color: colors.textMute, marginTop: 2 },

  section: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSoft,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionNoMargin: { fontSize: 13, fontWeight: '800', color: colors.textSoft },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  deviceCard: { width: '47%', marginHorizontal: '1.5%', marginBottom: 10 },
  deviceName: { fontSize: 12, color: colors.textSoft },
  deviceWatt: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  deviceUnit: { fontSize: 13, fontWeight: '600', color: colors.textMute },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEF2F6',
    marginTop: 10,
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 3 },

  anomaly: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  anomalyName: { fontSize: 14, fontWeight: '800', color: colors.text },
  anomalySub: { fontSize: 11, color: colors.textSoft, marginTop: 3 },
  anomalyTime: { fontSize: 11, color: colors.textMute },
  anomalyDelta: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.red,
    marginTop: 4,
  },

  noSensor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noSensorIcon: { fontSize: 40 },
  noSensorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 10,
  },
  noSensorText: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
