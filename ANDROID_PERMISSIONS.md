# Permissões Android - ProtegeOC

## 📋 Permissões Necessárias

O app ProtegeOC precisa das seguintes permissões para funcionar corretamente:

### 1. Localização (GPS)
- **INTERNET** - Para requisições HTTP e geocoding
- **ACCESS_FINE_LOCATION** - Para obter localização precisa via GPS
- **ACCESS_COARSE_LOCATION** - Para localização aproximada via rede

**Uso:** Capturar coordenadas ao criar ocorrências e exibir no mapa.

### 2. Câmera e Galeria
- **CAMERA** - Para tirar fotos das ocorrências
- **READ_EXTERNAL_STORAGE** - Para acessar fotos da galeria (Android < 13)
- **READ_MEDIA_IMAGES** - Para acessar fotos da galeria (Android 13+)

**Uso:** Adicionar fotos às ocorrências.

### 3. Internet
- **INTERNET** - Para requisições HTTP (Firebase, Supabase, Mapbox)

**Uso:** Todas as operações de rede do app.

## 🔧 Configuração Automática

O Capacitor configura automaticamente essas permissões quando você adiciona a plataforma Android. As permissões são adicionadas ao `AndroidManifest.xml` automaticamente.

### Verificação Manual

Após adicionar a plataforma Android, verifique o arquivo:
`android/app/src/main/AndroidManifest.xml`

Deve conter algo como:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" 
                     android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    
    <!-- Para Android 13+ -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.location" android:required="false" />
    <uses-feature android:name="android.hardware.location.gps" android:required="false" />
</manifest>
```

## 📱 Solicitação de Permissões em Runtime

O Capacitor solicita permissões automaticamente quando necessário. No entanto, você pode verificar e solicitar manualmente:

### Exemplo de Código (Opcional)

```typescript
import { Permissions } from '@capacitor/core';

// Verificar permissão de localização
const checkLocationPermission = async () => {
  const result = await Permissions.query({ name: 'location' });
  if (result.state === 'denied') {
    await Permissions.request({ name: 'location' });
  }
};

// Verificar permissão de câmera
const checkCameraPermission = async () => {
  const result = await Permissions.query({ name: 'camera' });
  if (result.state === 'denied') {
    await Permissions.request({ name: 'camera' });
  }
};
```

## 🔒 Permissões Sensíveis (Android 6.0+)

Para Android 6.0 (API 23) e superior, algumas permissões são solicitadas em runtime:

- **Localização** - Solicitada quando o usuário tenta usar GPS
- **Câmera** - Solicitada quando o usuário tenta tirar foto
- **Armazenamento** - Solicitada quando o usuário tenta acessar galeria

## ⚠️ Notas Importantes

1. **Android 13+ (API 33+):**
   - `READ_EXTERNAL_STORAGE` foi substituído por `READ_MEDIA_IMAGES`
   - O Capacitor lida com isso automaticamente

2. **Permissões de Localização:**
   - O app funciona melhor com `ACCESS_FINE_LOCATION`
   - Se negada, pode usar `ACCESS_COARSE_LOCATION` como fallback

3. **Permissões de Câmera:**
   - Alguns dispositivos podem não ter câmera
   - Use `android:required="false"` no manifest

## 🧪 Testando Permissões

### No Emulador:
1. Vá em **Settings > Apps > ProtegeOC > Permissions**
2. Teste concedendo/negando cada permissão
3. Verifique o comportamento do app

### No Dispositivo Real:
1. Instale o APK
2. Teste cada funcionalidade que requer permissão
3. Verifique se as solicitações aparecem corretamente

## 📚 Recursos

- [Capacitor Permissions](https://capacitorjs.com/docs/guides/permissions)
- [Android Permissions Guide](https://developer.android.com/training/permissions/usage-notes)
- [Android 13 Permissions](https://developer.android.com/about/versions/13/behavior-changes-13)

