# Fix: Filename Longer Than 260 Characters

## 🔴 Masalah
Build Android gagal dengan error:
```
ninja: error: Stat(...): Filename longer than 260 characters
```

Ini terjadi karena path project terlalu panjang:
```
D:\Ahli Jenjang\Kuliah\Project\Project-Monitoring-Kelistrikan-\wattwise\mobile\...
```

Windows memiliki limitasi 260 karakter untuk path file (MAX_PATH).

## ✅ Solusi 1: Pindahkan Project (RECOMMENDED)

### Langkah-langkah:

1. **Tutup semua terminal dan VS Code**

2. **Pindahkan folder project ke path yang lebih pendek:**
   ```powershell
   # Buat folder baru di D:\
   New-Item -ItemType Directory -Path "D:\WattWise" -Force
   
   # Copy seluruh project
   Copy-Item -Path "D:\Ahli Jenjang\Kuliah\Project\Project-Monitoring-Kelistrikan-\wattwise\*" -Destination "D:\WattWise\" -Recurse -Force
   ```

3. **Buka project dari lokasi baru:**
   ```powershell
   cd D:\WattWise\mobile
   ```

4. **Hapus folder node_modules dan build cache:**
   ```powershell
   Remove-Item -Path ".\node_modules" -Recurse -Force
   Remove-Item -Path ".\android\.gradle" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path ".\android\app\.cxx" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path ".\android\app\build" -Recurse -Force -ErrorAction SilentlyContinue
   ```

5. **Reinstall dependencies:**
   ```powershell
   npm install
   ```

6. **Clean build Android:**
   ```powershell
   cd android
   .\gradlew clean
   cd ..
   ```

7. **Run app:**
   ```powershell
   npm run android
   ```

### Perbandingan Path:

❌ **Sekarang (TERLALU PANJANG):**
```
D:\Ahli Jenjang\Kuliah\Project\Project-Monitoring-Kelistrikan-\wattwise\mobile\android\app\.cxx\...
Panjang: ~200+ karakter
```

✅ **Setelah dipindah (OK):**
```
D:\WattWise\mobile\android\app\.cxx\...
Panjang: ~50 karakter
```

## ✅ Solusi 2: Enable Long Path di Windows (Alternatif)

Jika tidak bisa pindah project, enable long path support di Windows:

### Cara 1: Via Registry Editor

1. **Buka Registry Editor:**
   ```
   Win + R → ketik: regedit → Enter
   ```

2. **Navigate ke:**
   ```
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem
   ```

3. **Edit atau buat DWORD (32-bit):**
   - Name: `LongPathsEnabled`
   - Value: `1`

4. **Restart komputer**

### Cara 2: Via PowerShell (Admin)

```powershell
# Run PowerShell as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

5. **Restart komputer**

6. **Setelah restart, clean build:**
   ```powershell
   cd D:\Ahli Jenjang\Kuliah\Project\Project-Monitoring-Kelistrikan-\wattwise\mobile
   
   Remove-Item -Path ".\android\.gradle" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path ".\android\app\.cxx" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path ".\android\app\build" -Recurse -Force -ErrorAction SilentlyContinue
   
   cd android
   .\gradlew clean
   cd ..
   
   npm run android
   ```

## ✅ Solusi 3: Gunakan WSL (Windows Subsystem for Linux)

Jika solusi 1 & 2 tidak work, bisa pakai WSL yang tidak punya limitasi 260 karakter.

## 🎯 Rekomendasi

**PINDAHKAN PROJECT** (Solusi 1) adalah cara paling efektif dan pasti berhasil.

Path yang disarankan:
- `D:\WattWise\` 
- `C:\Projects\WattWise\`
- `D:\Dev\WattWise\`

Hindari path dengan:
- Spasi: "Ahli Jenjang"
- Nama terlalu panjang: "Project-Monitoring-Kelistrikan-"
- Nested terlalu dalam

## 📝 Notes

- Setelah pindah, update path di Git jika ada
- Update workspace di VS Code
- Backup folder lama dulu sebelum hapus
