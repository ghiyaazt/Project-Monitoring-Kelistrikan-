import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainApp from './src/navigation/MainApp';
import { DEMO_USER, RegisterData, User } from './src/data/mock';
import { nameFromEmail } from './src/utils/format';
import { colors } from './src/theme';

const PHONE_W = 414; // lebar bingkai (termasuk pinggiran)
const PHONE_H = 868; // tinggi bingkai maksimum

interface FrameProps {
  tone: 'green' | 'white'; // warna area status bar mengikuti layar di bawahnya
  height: number;
  children: React.ReactNode;
}

function PhoneFrame({ tone, height, children }: FrameProps) {
  const light = tone === 'green';
  return (
    <View style={styles.stage}>
      <View style={[styles.device, { height }]}>
        <View style={styles.screen}>
          <View
            style={[
              styles.statusBar,
              { backgroundColor: light ? colors.greenBrand : colors.white },
            ]}
          >
            <Text style={[styles.statusText, light && styles.statusTextLight]}>
              9:41
            </Text>
            <Text style={[styles.statusText, light && styles.statusTextLight]}>
              📶 🔋
            </Text>
          </View>
          <View style={styles.screenBody}>{children}</View>
          <View style={styles.homeBarWrap}>
            <View style={styles.homeBar} />
          </View>
        </View>
        <View style={styles.island} pointerEvents="none" />
      </View>
    </View>
  );
}

type AuthScreen = 'login' | 'register';

function App() {
  // Data user hanya disimpan di memori (dummy) sampai backend tersambung.
  const [users, setUsers] = useState<User[]>([DEMO_USER]);
  const [current, setCurrent] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [notice, setNotice] = useState('');
  const [prefill, setPrefill] = useState('');
  const { width, height } = useWindowDimensions();

  const framed = Platform.OS === 'web' && width >= 600;

  const handleLogin = (email: string, password: string): string | null => {
    const user = users.find(
      u => u.email === email.trim().toLowerCase() && u.password === password,
    );
    if (!user) return 'Email atau password salah.';
    setCurrent(user);
    setNotice('');
    setPrefill('');
    return null;
  };

  const handleRegister = (data: RegisterData): string | null => {
    if (users.some(u => u.email === data.email))
      return 'Email sudah terdaftar. Silakan masuk.';
    // Di mobile, role otomatis "penghuni"
    setUsers(prev => [
      ...prev,
      { ...data, name: nameFromEmail(data.email), role: 'penghuni' },
    ]);
    setPrefill(data.email);
    setNotice('Pendaftaran berhasil sebagai Penghuni. Silakan masuk.');
    setAuthScreen('login');
    return null;
  };

  const handleLogout = () => {
    setCurrent(null);
    setAuthScreen('login');
  };

  const body = current ? (
    <MainApp key={current.email} user={current} onLogout={handleLogout} />
  ) : authScreen === 'login' ? (
    <LoginScreen
      key={prefill || 'login'}
      onLogin={handleLogin}
      onGoRegister={() => {
        setNotice('');
        setAuthScreen('register');
      }}
      initialEmail={prefill}
      notice={notice}
    />
  ) : (
    <RegisterScreen
      onRegister={handleRegister}
      onGoLogin={() => setAuthScreen('login')}
    />
  );

  const tone = current ? 'white' : 'green';

  if (framed) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <PhoneFrame tone={tone} height={Math.min(PHONE_H, height - 32)}>
          {body}
        </PhoneFrame>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle={current ? 'dark-content' : 'light-content'} />
      <View style={styles.outer}>
        <SafeAreaView style={styles.inner}>{body}</SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // layar penuh (HP asli / jendela sempit)
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
  },
  inner: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: colors.bg },

  // bingkai HP (web, jendela lebar)
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  device: {
    width: PHONE_W,
    padding: 12,
    borderRadius: 58,
    borderWidth: 3,
    borderColor: '#6F6580',
    backgroundColor: '#1B1823',
    shadowColor: '#0F172A',
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
  },
  screen: {
    flex: 1,
    borderRadius: 46,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  statusBar: {
    height: 48,
    paddingHorizontal: 30,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: { fontSize: 13, fontWeight: '700', color: colors.text },
  statusTextLight: { color: colors.white },
  screenBody: { flex: 1, backgroundColor: colors.bg },
  homeBarWrap: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  homeBar: {
    width: 120,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#0F172A',
    opacity: 0.8,
  },
  island: {
    position: 'absolute',
    top: 21,
    left: (PHONE_W - 112) / 2,
    width: 112,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    zIndex: 50,
  },
});

export default App;
