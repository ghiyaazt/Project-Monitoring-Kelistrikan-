import { Alert, Platform } from 'react-native';

// Mengembalikan URI foto yang dipilih, atau null kalau dibatalkan.
// Web: pakai input file bawaan browser.
// HP asli: nanti diganti react-native-image-picker (belum dipasang).
export function pickImage(): Promise<string | null> {
  if (Platform.OS !== 'web') {
    Alert.alert(
      'Belum tersedia',
      'Upload foto di HP butuh library react-native-image-picker yang belum dipasang. Untuk sekarang coba lewat versi web (npm run web).',
    );
    return Promise.resolve(null);
  }

  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files && input.files[0];
      resolve(file ? URL.createObjectURL(file) : null);
    };
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}
