# 🛠️ Development Scripts

Utility scripts untuk membantu development WattWise.

## 📋 Available Scripts

### 1. **Clear Cache** 🧹
Membersihkan semua file cache development.

```bash
# Via npm
npm run clear-cache

# Direct
pwsh scripts/clear-cache.ps1
```

**Apa yang dibersihkan:**
- `node_modules/.cache/` - Webpack & Babel cache
- `build/` - Production build folder
- `.eslintcache` - ESLint cache
- `tsconfig.tsbuildinfo` - TypeScript build info

**Kapan digunakan:**
- Hot reload tidak bekerja
- Module not found errors
- Stale component renders
- Setelah update dependencies

---

### 2. **Clean Start** 🚀
Clear cache + restart development server.

```bash
# Via npm (RECOMMENDED)
npm run clean-start

# Direct
pwsh scripts/clean-start.ps1
```

**Proses yang dilakukan:**
1. ✅ Clear semua cache
2. ✅ Kill process di port 3000
3. ✅ Start fresh dev server

**Kapan digunakan:**
- Error "nav is not defined"
- Hot reload issues
- Setelah merge/pull code baru
- Setelah switch branch

---

### 3. **Quick Fix** ⚡
One-command solution untuk fix dev issues.

```bash
# Via npm (FASTEST)
npm run fix

# Direct
pwsh scripts/fix-dev.ps1
```

**Proses yang dilakukan:**
- Clear cache (silent)
- Kill port 3000 (silent)
- Restart server

**Kapan digunakan:**
- Saat terburu-buru
- Error sederhana yang butuh restart cepat

---

## 🔧 Troubleshooting

### Error: "nav is not defined"

**Penyebab:** Hot reload cache masih menyimpan kode lama

**Solusi:**
```bash
npm run clean-start
```

Lalu di browser: **Ctrl + Shift + R** (hard refresh)

---

### Error: "Port 3000 is already in use"

**Solusi 1 - Otomatis:**
```bash
npm run clean-start  # Otomatis kill port 3000
```

**Solusi 2 - Manual:**
```powershell
# Cari process di port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Kill process
Stop-Process -Id <PID> -Force
```

---

### Error: Module not found setelah update

**Solusi:**
```bash
# 1. Clear cache
npm run clear-cache

# 2. Reinstall dependencies
npm install

# 3. Start fresh
npm start
```

---

### Hot reload tidak bekerja

**Checklist:**
1. ✅ Clear cache: `npm run clear-cache`
2. ✅ Hard refresh browser: `Ctrl + Shift + R`
3. ✅ Check file watcher limit (Linux/Mac):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```
4. ✅ Restart VS Code
5. ✅ Restart PC (last resort)

---

## 📝 Script Details

### clear-cache.ps1
- **Language:** PowerShell
- **Platform:** Windows, Mac (pwsh), Linux (pwsh)
- **Safe:** Tidak menghapus `node_modules/` atau source code

### clean-start.ps1
- **Language:** PowerShell
- **Dependencies:** Requires `clear-cache.ps1`
- **Network:** Checks port 3000 availability

### fix-dev.ps1
- **Language:** PowerShell
- **Speed:** Fast (silent mode)
- **Minimal output:** Untuk quick fix

---

## 🎯 Best Practices

### Daily Development:
```bash
npm start  # Normal start
```

### After Pull/Merge:
```bash
npm run clean-start  # Clear cache + start
```

### Hot Reload Issues:
```bash
npm run fix  # Quick fix
```

### After Dependencies Update:
```bash
npm run clear-cache
npm install
npm start
```

---

## 💡 Tips

1. **Keyboard Shortcut** - Create alias in your shell:
   ```powershell
   # PowerShell profile (~\Documents\PowerShell\Profile.ps1)
   function fix { npm run fix }
   function cs { npm run clean-start }
   ```

2. **VS Code Task** - Add to `.vscode/tasks.json`:
   ```json
   {
     "label": "Clean Start",
     "type": "npm",
     "script": "clean-start"
   }
   ```

3. **Git Hook** - Auto clear cache on checkout:
   ```bash
   # .git/hooks/post-checkout
   #!/bin/sh
   npm run clear-cache
   ```

---

## 🐛 Known Issues

### Issue: Scripts tidak jalan di Mac/Linux
**Solution:** Install PowerShell Core:
```bash
# Mac
brew install powershell

# Linux
sudo snap install powershell --classic
```

### Issue: Permission denied
**Solution:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## 📚 Related Documentation

- [Create React App - Troubleshooting](https://create-react-app.dev/docs/troubleshooting/)
- [Webpack Caching](https://webpack.js.org/guides/caching/)
- [PowerShell Documentation](https://docs.microsoft.com/powershell/)

---

**Made with ❤️ for WattWise Development**
