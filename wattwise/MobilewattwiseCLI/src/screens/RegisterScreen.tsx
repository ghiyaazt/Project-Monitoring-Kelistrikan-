import React, { useState } from 'react';
import {
  Image,
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
import { Gender, RegisterData } from '../data/mock';
import { pickImage } from '../utils/pickImage';

interface Props {
  onRegister: (data: RegisterData) => string | null; // null = sukses, selain itu pesan error
  onGoLogin: () => void;
}

const genders: Gender[] = ['Laki-laki', 'Perempuan'];
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ onRegister, onGoLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [ktpUri, setKtpUri] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [error, setError] = useState('');

  const chooseKtp = async () => {
    const uri = await pickImage();
    if (uri) setKtpUri(uri);
  };

  const submit = () => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!emailRe.test(email.trim()))
      return setError('Format email belum benar.');
    if (password.length < 6) return setError('Password minimal 6 karakter.');
    if (!/^\+?\d{9,15}$/.test(cleanPhone))
      return setError('Nomor telepon tidak valid (9-15 digit).');
    if (!ktpUri) return setError('Foto KTP wajib diunggah.');

    const err = onRegister({
      email: email.trim().toLowerCase(),
      password,
      phone: cleanPhone,
      gender: gender ?? undefined,
      ktpUri,
    });
    if (err) setError(err);
  };

  const inputStyle = (key: string) => [
    styles.input,
    focus === key && styles.inputFocus,
  ];

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
          <Text style={styles.brand}>Buat Akun</Text>
          <Text style={styles.tagline}>Daftar sebagai penghuni WattWise</Text>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={inputStyle('email')}
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
          <View style={[...inputStyle('password'), styles.passwordRow]}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocus('password')}
              onBlur={() => setFocus(null)}
              secureTextEntry={!show}
              autoCapitalize="none"
              placeholder="Minimal 6 karakter"
              placeholderTextColor={colors.textMute}
            />
            <TouchableOpacity
              onPress={() => setShow(s => !s)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.eye}>{show ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>No. telepon</Text>
          <TextInput
            style={inputStyle('phone')}
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setFocus('phone')}
            onBlur={() => setFocus(null)}
            keyboardType="phone-pad"
            placeholder="08xxxxxxxxxx"
            placeholderTextColor={colors.textMute}
          />

          <Text style={styles.label}>
            Gender <Text style={styles.optional}>(opsional)</Text>
          </Text>
          <View style={styles.genderRow}>
            {genders.map(g => {
              const active = gender === g;
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, active && styles.genderBtnActive]}
                  onPress={() => setGender(active ? null : g)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.genderText,
                      active && styles.genderTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Foto KTP</Text>
          <TouchableOpacity
            style={styles.ktpBox}
            onPress={chooseKtp}
            activeOpacity={0.85}
          >
            {ktpUri ? (
              <>
                <Image
                  source={{ uri: ktpUri }}
                  style={styles.ktpImage}
                  resizeMode="cover"
                />
                <Text style={styles.ktpChange}>Ketuk untuk ganti foto</Text>
              </>
            ) : (
              <>
                <Text style={styles.ktpIcon}>🪪</Text>
                <Text style={styles.ktpText}>Ketuk untuk unggah foto KTP</Text>
                <Text style={styles.ktpHint}>
                  Pastikan tulisan terlihat jelas
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.roleInfo}>
            <Text style={styles.roleInfoText}>
              Akun mobile otomatis terdaftar sebagai Penghuni.
            </Text>
          </View>

          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={submit}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Daftar</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={onGoLogin}>
              <Text style={styles.loginLink}>Masuk</Text>
            </TouchableOpacity>
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
    paddingTop: 28,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    right: -70,
    bottom: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(37,99,235,0.45)',
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 24, color: colors.white },
  brand: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
  },
  tagline: { color: '#D1FAE5', fontSize: 13, marginTop: 4 },
  sheet: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    marginTop: 4,
  },
  optional: { fontWeight: '500', color: colors.textMute },
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

  genderRow: { flexDirection: 'row', marginBottom: 12 },
  genderBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  genderBtnActive: { borderColor: '#22C55E', backgroundColor: '#F0FDF4' },
  genderText: { fontSize: 13, fontWeight: '700', color: colors.textSoft },
  genderTextActive: { color: colors.greenDark },

  ktpBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    minHeight: 120,
    marginBottom: 12,
  },
  ktpIcon: { fontSize: 30 },
  ktpText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.greenDark,
    marginTop: 6,
  },
  ktpHint: { fontSize: 11, color: colors.textSoft, marginTop: 2 },
  ktpImage: { width: '100%', height: 150, borderRadius: 10 },
  ktpChange: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.greenDark,
    marginTop: 8,
  },

  roleInfo: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.blueLine,
  },
  roleInfoText: { fontSize: 12, color: colors.blue, fontWeight: '600' },

  error: { color: colors.red, fontSize: 12, marginTop: 12 },
  button: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: '800' },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  loginText: { fontSize: 13, color: colors.textSoft },
  loginLink: { fontSize: 13, fontWeight: '800', color: colors.green },
});
