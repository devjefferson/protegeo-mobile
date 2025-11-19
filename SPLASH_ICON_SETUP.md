# Guia - Configuração de Splash Screen e Ícones

## ✅ O que foi configurado

### 1. Tela de Splash Melhorada
- ✅ Design moderno com gradiente
- ✅ Animações suaves (fade in/out, pulse)
- ✅ Logo animado com ícone de escudo
- ✅ Barra de progresso estilizada

### 2. Capacitor Config
- ✅ Plugin SplashScreen configurado
- ✅ App ID atualizado: `io.protegeo.app`
- ✅ Nome do app: `ProtegeOC`

### 3. Manifest e HTML
- ✅ Manifest.json atualizado com informações do app
- ✅ Meta tags para PWA configuradas
- ✅ Ícones configurados no manifest

## 📱 Gerando Ícones e Splash Screens

### Opção 1: Usando Capacitor Assets (Recomendado)

1. **Instalar o Capacitor Assets CLI:**
```bash
npm install -g @capacitor/assets
```

2. **Criar um ícone base:**
   - Crie uma imagem PNG de **1024x1024 pixels**
   - Salve como `icon.png` na raiz do projeto
   - O ícone deve ter fundo transparente ou sólido
   - Use o ícone de escudo (shield) como base

3. **Gerar todos os ícones e splash screens:**
```bash
npx @capacitor/assets generate --iconPath ./icon.png --splashPath ./splash.png
```

   Ou se você tiver uma imagem de splash separada:
```bash
npx @capacitor/assets generate \
  --iconPath ./icon.png \
  --splashPath ./splash.png \
  --iconBackgroundColor '#3880ff' \
  --splashBackgroundColor '#3880ff'
```

### Opção 2: Gerar Manualmente

#### Ícones Necessários:

**Para Web (PWA):**
- `/public/icon-192.png` - 192x192 pixels
- `/public/icon-512.png` - 512x512 pixels
- `/public/favicon.png` - 64x64 pixels (já existe)

**Para Android:**
- `android/app/src/main/res/mipmap-mdpi/icon.png` - 48x48
- `android/app/src/main/res/mipmap-hdpi/icon.png` - 72x72
- `android/app/src/main/res/mipmap-xhdpi/icon.png` - 96x96
- `android/app/src/main/res/mipmap-xxhdpi/icon.png` - 144x144
- `android/app/src/main/res/mipmap-xxxhdpi/icon.png` - 192x192

**Para iOS:**
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/` - Vários tamanhos

#### Splash Screens Necessários:

**Para Android:**
- `android/app/src/main/res/drawable/splash.png` - 2732x2732 (ou usar 9-patch)
- `android/app/src/main/res/values/styles.xml` - Configurar splash

**Para iOS:**
- `ios/App/App/Assets.xcassets/Splash.imageset/` - Vários tamanhos

### Opção 3: Usar Ferramentas Online

1. **PWA Asset Generator:**
   - Acesse: https://www.pwabuilder.com/imageGenerator
   - Faça upload do ícone base (1024x1024)
   - Baixe os ícones gerados
   - Coloque em `/public/`

2. **App Icon Generator:**
   - Acesse: https://www.appicon.co/
   - Faça upload do ícone base
   - Baixe o pacote completo
   - Extraia para as pastas corretas

## 🎨 Design do Ícone

### Especificações:
- **Tamanho base:** 1024x1024 pixels
- **Formato:** PNG com transparência
- **Cores:** 
  - Primária: #3880ff (azul)
  - Fundo: Branco ou transparente
- **Elemento:** Escudo (shield) representando proteção

### Exemplo de Design:
```
┌─────────────────┐
│                 │
│      🛡️         │
│                 │
│   ProtegeOC     │
│                 │
└─────────────────┘
```

## 📝 Próximos Passos

1. **Criar o ícone base (1024x1024)**
   - Use um editor de imagens (Figma, Photoshop, GIMP)
   - Ou use o ícone de escudo do Ionicons como base

2. **Gerar os assets:**
   ```bash
   npx @capacitor/assets generate --iconPath ./icon.png
   ```

3. **Sincronizar com plataformas nativas:**
   ```bash
   npx cap sync
   ```

4. **Testar:**
   - Web: Verifique o favicon e manifest
   - Android: `npx cap run android`
   - iOS: `npx cap run ios`

## 🔧 Configuração do Splash Screen Nativo

O plugin `@capacitor/splash-screen` já está instalado e configurado no `capacitor.config.ts`.

### Para controlar o splash programaticamente:

```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// Esconder o splash após carregar
await SplashScreen.hide();

// Mostrar o splash
await SplashScreen.show({
  showDuration: 2000,
  autoHide: true,
});
```

### Nota:
A tela de splash React (componente) já está configurada e funcionando. O splash nativo do Capacitor aparece antes do React carregar, e depois a tela de splash React aparece.

## 📚 Recursos

- [Capacitor Assets CLI](https://github.com/ionic-team/capacitor-assets)
- [PWA Builder](https://www.pwabuilder.com/)
- [App Icon Generator](https://www.appicon.co/)
- [Capacitor Splash Screen Docs](https://capacitorjs.com/docs/apis/splash-screen)

