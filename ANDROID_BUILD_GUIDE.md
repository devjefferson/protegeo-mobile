# Guia Completo - Gerar APK Android

## 📋 Pré-requisitos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Instalar Android Studio
- Baixe e instale o [Android Studio](https://developer.android.com/studio)
- Durante a instalação, certifique-se de instalar:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (AVD)
  - SDK Build Tools

### 3. Configurar Variáveis de Ambiente
Adicione ao seu `~/.zshrc` ou `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Depois execute:
```bash
source ~/.zshrc  # ou source ~/.bash_profile
```

### 4. Verificar Instalação
```bash
java -version        # Deve ser Java 11 ou superior
adb version          # Android Debug Bridge
```

## 🚀 Passo a Passo para Gerar APK

### Passo 1: Adicionar Plataforma Android

Se ainda não adicionou a plataforma Android:

```bash
npm run cap:add:android
```

Ou manualmente:
```bash
npx cap add android
```

### Passo 2: Build do Projeto Web

Primeiro, faça o build do projeto:

```bash
npm run build
```

Isso gera os arquivos em `/dist` que serão copiados para o app Android.

### Passo 3: Sincronizar com Capacitor

Sincronize os arquivos web com o projeto Android:

```bash
npm run cap:sync
```

Ou use o script completo:
```bash
npm run android:build
```

### Passo 4: Abrir no Android Studio

```bash
npm run cap:open:android
```

Ou:
```bash
npx cap open android
```

### Passo 5: Configurar Assinatura (Release)

#### 5.1. Gerar Keystore

```bash
keytool -genkey -v -keystore protegeo-release.keystore -alias protegeo -keyalg RSA -keysize 2048 -validity 10000
```

**Importante:** Guarde a senha e as informações do keystore em local seguro!

#### 5.2. Configurar Gradle

Edite `android/app/build.gradle` e adicione antes do bloco `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

E dentro do bloco `android {`, adicione:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

#### 5.3. Criar arquivo key.properties

Crie `android/key.properties`:

```properties
storePassword=sua_senha_aqui
keyPassword=sua_senha_aqui
keyAlias=protegeo
storeFile=../protegeo-release.keystore
```

**⚠️ IMPORTANTE:** Adicione `key.properties` e `*.keystore` ao `.gitignore`!

### Passo 6: Gerar APK no Android Studio

#### Opção A: APK Debug (para testes)

1. No Android Studio, vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Aguarde a compilação
3. O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Opção B: APK Release (para distribuição)

1. No Android Studio, vá em **Build > Generate Signed Bundle / APK**
2. Selecione **APK**
3. Escolha o keystore criado anteriormente
4. Preencha as senhas
5. Selecione **release** como build variant
6. Clique em **Finish**
7. O APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

### Passo 7: Gerar APK via Linha de Comando

#### Debug APK:
```bash
cd android
./gradlew assembleDebug
```

O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK:
```bash
cd android
./gradlew assembleRelease
```

O APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

## 📱 Instalar APK no Dispositivo

### Via ADB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Via Transferência Manual:
1. Copie o arquivo `.apk` para o dispositivo
2. No dispositivo, ative "Fontes desconhecidas" nas configurações
3. Abra o arquivo e instale

## 🔧 Configurações Importantes

### Permissões Android

O app precisa das seguintes permissões (já configuradas no Capacitor):

- **INTERNET** - Para requisições HTTP
- **ACCESS_FINE_LOCATION** - Para GPS
- **ACCESS_COARSE_LOCATION** - Para localização aproximada
- **CAMERA** - Para tirar fotos
- **READ_EXTERNAL_STORAGE** - Para acessar galeria (Android < 13)
- **WRITE_EXTERNAL_STORAGE** - Para salvar fotos (Android < 13)

Essas permissões são solicitadas automaticamente pelo Capacitor quando necessário.

### Versão do App

Para atualizar a versão do app, edite:

1. **package.json**: `"version": "0.0.1"`
2. **android/app/build.gradle**: 
   ```gradle
   defaultConfig {
       versionCode 1
       versionName "0.0.1"
   }
   ```

### Nome do App

O nome do app está configurado em:
- **capacitor.config.ts**: `appName: 'ProtegeOC'`
- **android/app/src/main/res/values/strings.xml**: Será gerado automaticamente

## 🐛 Troubleshooting

### Erro: "SDK location not found"
```bash
# Crie o arquivo android/local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### Erro: "Gradle sync failed"
```bash
cd android
./gradlew clean
./gradlew build
```

### Erro: "Execution failed for task ':app:mergeDebugResources'"
```bash
cd android
./gradlew clean
rm -rf .gradle
./gradlew build
```

### Erro: "Keystore file not found"
- Verifique o caminho no `key.properties`
- Use caminho relativo: `storeFile=../protegeo-release.keystore`

### APK muito grande
- Use ProGuard para minificar (já configurado)
- Remova assets desnecessários
- Use Android App Bundle (AAB) em vez de APK

## 📦 Gerar Android App Bundle (AAB)

Para publicar na Google Play Store, é recomendado usar AAB:

```bash
cd android
./gradlew bundleRelease
```

O AAB estará em: `android/app/build/outputs/bundle/release/app-release.aab`

## 🔐 Segurança

### ⚠️ NUNCA faça commit de:
- `*.keystore`
- `key.properties`
- `android/local.properties`
- Senhas ou chaves de API

Esses arquivos já estão no `.gitignore`.

## 📚 Scripts Úteis

Adicionei os seguintes scripts ao `package.json`:

```bash
npm run cap:add:android      # Adicionar plataforma Android
npm run cap:sync             # Sincronizar arquivos web
npm run cap:open:android     # Abrir no Android Studio
npm run android:build       # Build completo e abrir Android Studio
npm run android:apk          # Build e sincronizar (pronto para gerar APK)
```

## ✅ Checklist Antes de Gerar APK

- [ ] Build do projeto web executado (`npm run build`)
- [ ] Capacitor sincronizado (`npm run cap:sync`)
- [ ] Ícones e splash screens configurados
- [ ] Versão do app atualizada
- [ ] Permissões Android verificadas
- [ ] Keystore criado (para release)
- [ ] `key.properties` configurado (para release)
- [ ] Testado em dispositivo/emulador

## 🎯 Próximos Passos

1. **Testar o APK** em dispositivos reais
2. **Otimizar performance** se necessário
3. **Configurar ProGuard** para minificar código
4. **Criar ícones e splash screens** nativos
5. **Preparar para Google Play Store** (AAB, screenshots, descrição)

## 📖 Recursos Adicionais

- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/guide)
- [Google Play Console](https://play.google.com/console)

