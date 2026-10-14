import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme';
import { DEMO_USER } from '../data/mock';

interface Props {
  onLogin: (email: string, password: string) => string | null; // null = sukses, selain itu pesan error
  onGoRegister: () => void;
  initialEmail?: string;
  notice?: string;
}

export default function LoginScreen({
  onLogin,
  onGoRegister,
  initialEmail,
  notice,
}: Props) {
  const [email, setEmail] = useState(initialEmail || DEMO_USER.email);
  const [password, setPassword] = useState(
    initialEmail ? '' : DEMO_USER.password,
  );
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState<'email' | 'password' | null>(null);
  const [error, setError] = useState('');

  const submit = () => {
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    const err = onLogin(email, password);
    if (err) setError(err);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <View style={styles.logo}>
            <Text style={styles.logoText}>⚡</Text>
          </View>
          <Text style={styles.brand}>WattWise</Text>
          <Text style={styles.tagline}>Sistem Manajemen Kos Terpadu</Text>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>Masuk ke akun Anda</Text>

          {notice ? (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>{notice}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, focus === 'email' && styles.inputFocus]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocus('email')}
            onBlur={() => setFocus(null)}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="nama@email.com"
            placeholderTextColor={colors.textMute}
          />

          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.input,
              styles.passwordRow,
              focus === 'password' && styles.inputFocus,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocus('password')}
              onBlur={() => setFocus(null)}
              secureTextEntry={!show}
              autoCapitalize="none"
              placeholder="Masukkan password"
              placeholderTextColor={colors.textMute}
              onSubmitEditing={submit}
            />
            <TouchableOpacity
              onPress={() => setShow(s => !s)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.eye}>{show ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Lupa password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={submit}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Masuk</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={onGoRegister}>
              <Text style={styles.registerLink}>Daftar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demo}>
            <Text style={styles.demoLabel}>Demo akun:</Text>
            <Text style={styles.demoValue}>
              {DEMO_USER.email} / {DEMO_USER.password}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.greenBrand },
  scroll: { flexGrow: 1 },
  hero: {
    alignItems: 'center',
    paddingTop: 44,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    right: -70,
    bottom: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(37,99,235,0.45)',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 30, color: colors.white },
  brand: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
  },
  tagline: { color: '#D1FAE5', fontSize: 13, marginTop: 4 },
  sheet: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: {
    fontSize: 14,
    color: colors.textSoft,
    marginTop: 2,
    marginBottom: 18,
  },
  notice: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: colors.greenLine,
    marginBottom: 14,
  },
  noticeText: { fontSize: 12, fontWeight: '700', color: colors.greenDark },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  inputFocus: { borderColor: '#22C55E' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, fontSize: 14, color: colors.text, height: '100%' },
  eye: { fontSize: 16 },
  error: { color: colors.red, fontSize: 12, marginBottom: 4 },
  forgot: { alignSelf: 'flex-end', marginBottom: 18 },
  forgotText: { color: colors.blue, fontSize: 12, fontWeight: '600' },
  button: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: '800' },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  registerText: { fontSize: 13, color: colors.textSoft },
  registerLink: { fontSize: 13, fontWeight: '800', color: colors.green },
  demo: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
  },
  demoLabel: { fontSize: 12, color: colors.textSoft },
  demoValue: { fontSize: 12, color: colors.text, marginTop: 4 },
});
