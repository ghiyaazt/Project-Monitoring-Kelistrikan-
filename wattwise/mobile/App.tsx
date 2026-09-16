/**
 * WattWise Mobile App
 * React Native Application
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>WattWise</Text>
        <Text style={styles.subtitle}>Sistem Monitoring Kelistrikan</Text>
        <Text style={styles.info}>
          App sedang dalam pengembangan.{'\n'}
          Struktur folder src sudah dibuat dengan screens dari tampilan mobile.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  info: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default App;
