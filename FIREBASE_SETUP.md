# Configuração do Firebase - ProtegeOC

## ✅ O que já foi feito:

### 1. Arquivos criados:

- **`src/config/firebase.ts`** - Configuração e inicialização do Firebase
- **`src/services/FirebaseAuthService.ts`** - Serviço completo de autenticação
- **`src/context/AuthContext.tsx`** - Context atualizado para Firebase
- **`src/pages/Login/viewModel.ts`** - ViewModel integrado com Firebase
- **`src/pages/Register/index.tsx`** - Cadastro integrado com Firebase
- **`src/pages/ForgotPassword/index.tsx`** - Recuperação de senha com Firebase

### 2. Funcionalidades implementadas:

✅ Autenticação com email e senha  
✅ Registro de novos usuários  
✅ Recuperação de senha  
✅ Logout  
✅ Persistência de sessão automática  
✅ Armazenamento de dados do usuário no Firestore  
✅ Tratamento de erros em português  
✅ Loading state durante autenticação  

## 📦 Instalação necessária:

Execute um dos comandos abaixo para instalar o Firebase:

```bash
npm install firebase
```

ou

```bash
yarn add firebase
```

## 🔧 Configuração do Firebase Console:

### 1. Authentication:
- Acesse [Firebase Console](https://console.firebase.google.com/)
- Selecione o projeto "protegeo"
- Vá em **Authentication > Sign-in method**
- Ative o provedor **Email/Password**

### 2. Firestore Database:
- Vá em **Firestore Database**
- Crie o database (modo de produção ou teste)
- Configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para coleção users
    match /users/{userId} {
      // Permitir leitura e escrita apenas para o próprio usuário
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📂 Estrutura do Firestore:

### Coleção: `users`
```typescript
{
  uid: string,          // ID do usuário (mesmo do Auth)
  name: string,         // Nome completo
  email: string,        // Email
  phone?: string,       // Telefone (opcional)
  createdAt: Date       // Data de criação
}
```

## 🚀 Como usar:

### Login:
```typescript
import { FirebaseAuthService } from './services/FirebaseAuthService'

const userCredential = await FirebaseAuthService.login(email, password)
```

### Registro:
```typescript
await FirebaseAuthService.register(email, password, name, phone)
```

### Recuperar Senha:
```typescript
await FirebaseAuthService.resetPassword(email)
```

### Logout:
```typescript
await FirebaseAuthService.logout()
```

### Obter usuário atual:
```typescript
const user = FirebaseAuthService.getCurrentUser()
```

### Obter dados do usuário:
```typescript
const userData = await FirebaseAuthService.getUserData(userId)
```

## 🔐 Segurança:

⚠️ **IMPORTANTE**: As chaves do Firebase estão expostas no código. Para produção:

1. Crie um arquivo `.env` na raiz do projeto:
```env
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=protegeo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=protegeo
VITE_FIREBASE_STORAGE_BUCKET=protegeo.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=950469561649
VITE_FIREBASE_APP_ID=1:950469561649:web:bda7344dd9ef03782b3410
VITE_FIREBASE_MEASUREMENT_ID=G-BX5GF7HE27
```

2. Atualize `src/config/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}
```

3. Adicione `.env` ao `.gitignore`

## 🐛 Troubleshooting:

### Erro: "Firebase is not installed"
Execute: `npm install firebase`

### Erro de tipos no AppRouter
Os erros de tipos relacionados ao react-router são apenas warnings do TypeScript e não afetam a execução.

### Erro: "Permission denied" no Firestore
Verifique as regras de segurança no Firebase Console.

### Usuário não loga automaticamente
O `onAuthStateChanged` no AuthContext detecta automaticamente quando o usuário faz login.

## 📱 Testando:

1. Instale o Firebase: `npm install firebase`
2. Execute o projeto: `npm run dev`
3. Acesse a tela de cadastro
4. Crie uma conta
5. Faça logout e login novamente
6. Teste a recuperação de senha

## ✨ Próximos passos (opcional):

- [ ] Adicionar autenticação com Google
- [ ] Adicionar autenticação com Facebook
- [ ] Implementar verificação de email
- [ ] Adicionar foto de perfil
- [ ] Implementar atualização de dados do usuário
- [ ] Adicionar Analytics
- [ ] Adicionar Crashlytics
- [ ] Configurar Capacitor para build mobile

---

**Configuração criada por: Cursor AI**  
**Data: 04/11/2025**



