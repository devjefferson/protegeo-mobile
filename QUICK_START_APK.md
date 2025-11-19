# 🚀 Quick Start - Gerar APK

## Comandos Rápidos

### 1. Primeira Vez (Adicionar Android)
```bash
# Build do projeto
npm run build

# Adicionar plataforma Android
npm run cap:add:android

# Sincronizar
npm run cap:sync

# Abrir no Android Studio
npm run cap:open:android
```

### 2. Build e Sincronizar (Após Mudanças)
```bash
# Build completo e abrir Android Studio
npm run android:build

# Ou apenas sincronizar
npm run android:apk
```

### 3. Gerar APK no Android Studio

1. Abra o projeto no Android Studio (`npm run cap:open:android`)
2. **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. Para Release: **Build > Generate Signed Bundle / APK**

### 4. Gerar APK via Linha de Comando

```bash
cd android
./gradlew assembleDebug    # APK Debug
./gradlew assembleRelease   # APK Release (requer keystore)
```

## 📍 Localização dos APKs

- **Debug:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release:** `android/app/build/outputs/apk/release/app-release.apk`

## ⚠️ Importante

- **Primeira vez:** Instale Android Studio e configure `ANDROID_HOME`
- **Release:** Crie um keystore antes de gerar APK release
- **Veja o guia completo:** `ANDROID_BUILD_GUIDE.md`

## 🔧 Troubleshooting

```bash
# Limpar build
cd android && ./gradlew clean

# Verificar configuração
npx cap doctor
```

