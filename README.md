# ProtegeOC - Sistema de Relato de Ocorrências Urbanas

## 📋 Sobre o Projeto

**ProtegeOC** é uma aplicação mobile desenvolvida para permitir que cidadãos relatem problemas urbanos em suas cidades, como buracos nas ruas, iluminação pública quebrada, lixo acumulado, entre outros. A aplicação oferece uma plataforma colaborativa onde os usuários podem visualizar ocorrências em um mapa interativo, registrar novos problemas com fotos e localização GPS, e acompanhar o status das ocorrências reportadas.

### Objetivo

Facilitar a comunicação entre cidadãos e órgãos públicos, permitindo que problemas urbanos sejam identificados, registrados e acompanhados de forma eficiente através de uma interface mobile intuitiva e moderna.

---

## 🚀 Funcionalidades Principais

### 1. **Autenticação de Usuários**
- Sistema de login e registro com Firebase Authentication
- Recuperação de senha
- Perfil de usuário com informações personalizadas
- Gerenciamento de sessão com Context API

### 2. **Visualização de Ocorrências no Mapa**
- Mapa interativo usando Mapbox GL JS
- Marcadores coloridos por status (Pendente, Em Andamento, Resolvido)
- Popups informativos ao clicar nos marcadores
- Legenda de status com contadores
- Ajuste automático do zoom para mostrar todas as ocorrências
- Atualização via pull-to-refresh

### 3. **Lista de Ocorrências**
- Visualização em cards com fotos
- Filtros por status (Todas, Pendentes, Em Andamento, Resolvidas)
- Contadores de ocorrências por status
- Informações detalhadas: título, descrição, categoria, autor, data e localização
- Navegação para detalhes da ocorrência

### 4. **Registro de Nova Ocorrência**
- Formulário completo com validação (React Hook Form + Zod)
- Seleção de categoria (Infraestrutura, Segurança, Meio Ambiente, etc.)
- Upload de até 5 fotos (câmera ou galeria)
- Mapa interativo para seleção de localização
- Captura de GPS automática
- Geocoding reverso para obter endereço a partir de coordenadas
- Preview de fotos antes do envio
- Barra de progresso durante upload

### 5. **Detalhes da Ocorrência**
- Visualização completa da ocorrência
- Galeria de fotos com carrossel
- Informações do autor e data
- Sistema de comentários
- Funcionalidade de favoritar
- Votação para marcar como resolvido
- Compartilhamento de ocorrência
- Atualização em tempo real

### 6. **Perfil do Usuário**
- Visualização e edição de dados pessoais
- Estatísticas do usuário
- Logout

---

## 🛠️ Tecnologias Utilizadas

### **Frontend Framework & UI**
- **React 19.0.0** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.1.6** - Superset do JavaScript com tipagem estática
- **Ionic React 8.5.0** - Framework UI para aplicações mobile híbridas
- **Ionicons 7.4.0** - Biblioteca de ícones

### **Build Tools & Bundler**
- **Vite 5.2.0** - Build tool moderna e rápida
- **Terser** - Minificador de código JavaScript
- **Code Splitting** - Divisão automática de código em chunks para otimização

### **Roteamento**
- **React Router 5.3.4** - Gerenciamento de rotas
- **Lazy Loading** - Carregamento sob demanda de componentes

### **Formulários & Validação**
- **React Hook Form 7.65.0** - Gerenciamento de formulários performático
- **Zod 4.1.12** - Validação de schemas TypeScript-first
- **@hookform/resolvers 5.2.2** - Integração entre React Hook Form e Zod

### **Backend & Banco de Dados**
- **Firebase 12.5.0**
  - **Firebase Authentication** - Autenticação de usuários
  - **Cloud Firestore** - Banco de dados NoSQL em tempo real
  - **Firebase Storage** - Armazenamento de arquivos (não utilizado diretamente)

### **Armazenamento de Imagens**
- **Supabase 2.83.0** - Plataforma backend como serviço
  - **Supabase Storage** - Armazenamento de imagens das ocorrências

### **Mapas & Geolocalização**
- **Mapbox GL JS 3.16.0** - Biblioteca de mapas interativos
- **Geolocation API** - Captura de coordenadas GPS do dispositivo
- **Mapbox Geocoding API** - Conversão de coordenadas em endereços

### **Mobile Framework**
- **Capacitor 7.4.3** - Runtime para aplicações web nativas
  - **@capacitor/android 7.4.4** - Suporte para Android
  - **@capacitor/app 7.0.2** - Controle de ciclo de vida do app
  - **@capacitor/haptics 7.0.2** - Feedback háptico
  - **@capacitor/keyboard 7.0.2** - Controle do teclado
  - **@capacitor/splash-screen 7.0.3** - Tela de splash
  - **@capacitor/status-bar 7.0.2** - Controle da barra de status

### **Gerenciamento de Estado**
- **React Context API** - Gerenciamento de estado global (autenticação)
- **React Hooks** - useState, useEffect, useRef, useMemo, useContext

### **Testes**
- **Vitest 0.34.6** - Framework de testes unitários
- **Cypress 13.5.0** - Framework de testes end-to-end
- **Testing Library** - Utilitários para testes de componentes React

### **Qualidade de Código**
- **ESLint 9.20.1** - Linter para JavaScript/TypeScript
- **TypeScript ESLint** - Regras específicas para TypeScript
- **Commitlint** - Validação de mensagens de commit

---

## 📁 Arquitetura e Estrutura do Projeto

```
protegeo/
├── android/                    # Projeto Android nativo (Capacitor)
│   ├── app/
│   │   ├── build.gradle        # Configuração de build Android
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── java/           # Código Java/Kotlin nativo
│   └── build.gradle
│
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── PageHeader/         # Cabeçalho de páginas
│   │   └── ExploreContainer/   # Container de exploração
│   │
│   ├── config/                 # Configurações
│   │   └── firebase.ts         # Configuração do Firebase
│   │
│   ├── context/                # Context API
│   │   └── AuthContext.tsx     # Context de autenticação
│   │
│   ├── hooks/                  # Custom hooks
│   │   └── useTheme.ts         # Hook para gerenciamento de tema
│   │
│   ├── models/                 # Modelos/Interfaces TypeScript
│   │   └── Auth.ts             # Tipos de autenticação
│   │
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Login/              # Tela de login
│   │   ├── Register/           # Tela de registro
│   │   ├── ForgotPassword/     # Recuperação de senha
│   │   ├── Tab1.tsx            # Mapa de ocorrências
│   │   ├── Tab2.tsx            # Lista de ocorrências
│   │   ├── Tab3.tsx            # Página adicional
│   │   ├── Profile/            # Perfil do usuário
│   │   ├── ReportIncident/     # Registrar ocorrência
│   │   ├── ReportDetail/       # Detalhes da ocorrência
│   │   └── Splash/             # Tela de splash
│   │
│   ├── router/                 # Configuração de rotas
│   │   ├── AppRouter.tsx       # Router principal
│   │   └── screens.tsx         # Definição de telas
│   │
│   ├── services/               # Serviços e APIs
│   │   ├── AuthService.ts      # Serviço de autenticação
│   │   ├── FirebaseAuthService.ts  # Implementação Firebase Auth
│   │   ├── supabase.ts        # Cliente Supabase
│   │   └── uploads.ts         # Serviço de upload de imagens
│   │
│   ├── theme/                  # Estilos globais
│   │   └── variables.css       # Variáveis CSS do Ionic
│   │
│   ├── App.tsx                 # Componente raiz
│   └── main.tsx                # Ponto de entrada
│
├── public/                     # Arquivos estáticos
│   ├── favicon.png
│   └── manifest.json
│
├── dist/                       # Build de produção
│
├── capacitor.config.ts         # Configuração do Capacitor
├── vite.config.ts              # Configuração do Vite
├── tsconfig.json               # Configuração TypeScript
├── package.json                # Dependências e scripts
└── README.md                   # Este arquivo
```

---

## 🔧 Como Foi Desenvolvido

### **1. Configuração Inicial**

O projeto foi iniciado usando **Ionic CLI** com template React e TypeScript:

```bash
ionic start protegeo tabs --type=react --capacitor
```

### **2. Estruturação do Projeto**

- **Separação de responsabilidades**: Componentes, páginas, serviços e contextos organizados em pastas específicas
- **TypeScript**: Todo o código foi escrito em TypeScript para maior segurança de tipos
- **Code Splitting**: Implementado lazy loading para otimizar o carregamento inicial

### **3. Integração com Firebase**

- Configuração do Firebase Authentication para login/registro
- Configuração do Firestore para armazenamento de dados
- Estruturação de coleções:
  - `users`: Dados dos usuários
  - `reports`: Ocorrências reportadas
  - `report_interactions`: Interações (favoritos, votos, comentários)
  - `comments`: Comentários das ocorrências

### **4. Integração com Mapbox**

- Configuração do Mapbox GL JS para mapas interativos
- Implementação de marcadores customizados por status
- Integração com Geocoding API para conversão de coordenadas em endereços
- Uso de Geolocation API do navegador para captura de GPS

### **5. Integração com Supabase**

- Configuração do Supabase Storage para upload de imagens
- Implementação de serviço de upload com tratamento de erros
- Organização de imagens por usuário e timestamp

### **6. Desenvolvimento Mobile com Capacitor**

- Configuração do Capacitor para Android
- Implementação de plugins nativos (Haptics, Keyboard, Status Bar, etc.)
- Configuração de permissões no AndroidManifest.xml
- Build e geração de APK

### **7. Validação e Formulários**

- Implementação de React Hook Form para gerenciamento de formulários
- Validação com Zod schemas
- Feedback visual de erros
- Validação em tempo real (onChange)

### **8. Gerenciamento de Estado**

- Context API para estado global de autenticação
- Hooks customizados para lógica reutilizável
- Estado local com useState para componentes específicos

### **9. Otimizações**

- Code splitting com lazy loading
- Chunks separados para bibliotecas grandes (React, Ionic, Firebase, Mapbox)
- Minificação com Terser
- Otimização de imagens
- Pull-to-refresh para atualização de dados

---

## 📦 Instalação e Configuração

### **Pré-requisitos**

- **Node.js** 18+ e npm/yarn
- **Java JDK** 11+ (para Android)
- **Android Studio** (para desenvolvimento Android)
- **Git**

### **1. Clonar o Repositório**

```bash
git clone <url-do-repositorio>
cd protegeo
```

### **2. Instalar Dependências**

```bash
npm install
# ou
yarn install
```

### **3. Configurar Variáveis de Ambiente**

#### **Firebase**

Crie um arquivo `.env` na raiz do projeto ou configure diretamente em `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
}
```

#### **Supabase**

Configure em `src/services/supabase.ts`:

```typescript
const SUPABASE_URL = 'SUA_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'SUA_SUPABASE_ANON_KEY'
```

#### **Mapbox**

Configure o token em `src/pages/Tab1.tsx` e `src/pages/ReportIncident/index.tsx`:

```typescript
mapboxgl.accessToken = 'SEU_MAPBOX_TOKEN'
```

### **4. Configurar Firestore**

Crie as seguintes coleções no Firestore:

- **users**: Coleção de usuários
- **reports**: Coleção de ocorrências
- **report_interactions**: Interações das ocorrências
- **comments**: Comentários

Crie índices compostos no Firestore:
- `reports`: `createdAt` (descending)

### **5. Configurar Supabase Storage**

- Crie um bucket chamado `protegeo` no Supabase
- Configure políticas de acesso (público para leitura, autenticado para escrita)

---

## 🚀 Como Executar

### **Desenvolvimento Web**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### **Build para Produção**

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

### **Preview da Build**

```bash
npm run preview
```

### **Desenvolvimento Android**

1. **Sincronizar com Capacitor:**

```bash
npm run cap:sync
```

2. **Abrir no Android Studio:**

```bash
npm run cap:open:android
```

3. **Build e Executar:**

- No Android Studio, clique em "Run" ou use `Ctrl+R` (Windows/Linux) / `Cmd+R` (Mac)
- Ou execute via linha de comando:

```bash
cd android
./gradlew assembleDebug
```

### **Gerar APK**

```bash
npm run android:apk
```

O APK será gerado em `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Funcionalidades Detalhadas

### **1. Sistema de Autenticação**

- **Login**: Email e senha com validação
- **Registro**: Criação de conta com nome, email e senha
- **Recuperação de Senha**: Envio de email de recuperação
- **Persistência de Sessão**: Mantém usuário logado entre sessões
- **Context API**: Estado global de autenticação acessível em toda aplicação

### **2. Mapa Interativo (Tab1)**

- **Mapbox GL JS**: Mapa vetorial de alta performance
- **Marcadores Dinâmicos**: 
  - 🟡 Amarelo: Pendente
  - 🔵 Azul: Em Andamento
  - 🟢 Verde: Resolvido
- **Popups Informativos**: Mostram título, descrição, categoria e status
- **Navegação**: Botão para ver detalhes da ocorrência
- **Legenda**: Mostra contadores por status
- **Pull-to-Refresh**: Atualização manual dos dados

### **3. Lista de Ocorrências (Tab2)**

- **Filtros por Status**: Segment buttons com contadores
- **Cards Informativos**: 
  - Foto de capa (se disponível)
  - Título e descrição
  - Badge de categoria
  - Chip de status com ícone
  - Metadados (autor, data, localização)
  - Badge de quantidade de fotos
- **Skeleton Loading**: Feedback visual durante carregamento
- **Empty State**: Mensagem quando não há ocorrências

### **4. Registro de Ocorrência**

- **Formulário Validado**:
  - Categoria (obrigatório)
  - Título (mínimo 5 caracteres)
  - Descrição (mínimo 10 caracteres)
- **Upload de Fotos**:
  - Até 5 fotos
  - Câmera ou galeria
  - Preview antes do envio
  - Upload para Supabase Storage
  - Barra de progresso
- **Localização**:
  - Mapa interativo (clique para definir)
  - Botão GPS (captura automática)
  - Geocoding reverso (endereço a partir de coordenadas)
  - Validação de coordenadas

### **5. Detalhes da Ocorrência**

- **Galeria de Fotos**: Carrossel com navegação
- **Informações Completas**: Título, descrição, categoria, status, autor, data
- **Sistema de Comentários**:
  - Lista de comentários
  - Adicionar novo comentário
  - Avatar do autor
  - Data do comentário
- **Interações**:
  - Favoritar/Desfavoritar
  - Votar como resolvido
  - Compartilhar ocorrência
- **Atualização em Tempo Real**: Dados sempre atualizados

### **6. Perfil do Usuário**

- **Visualização de Dados**: Nome, email
- **Edição de Perfil**: Atualização de informações
- **Estatísticas**: (Pode ser expandido)
- **Logout**: Encerramento de sessão

---

## 🔌 Integrações e Serviços Externos

### **Firebase**

- **Firebase Authentication**: 
  - Método: Email/Senha
  - Recuperação de senha
  - Persistência de sessão
  
- **Cloud Firestore**:
  - Banco de dados NoSQL
  - Estrutura de coleções e documentos
  - Queries com ordenação e filtros
  - Timestamps automáticos
  - Índices compostos para performance

### **Supabase**

- **Supabase Storage**:
  - Bucket: `protegeo`
  - Organização: `reports/{userId}/{timestamp}_{index}_{filename}`
  - URLs públicas para acesso às imagens
  - Políticas de acesso configuradas

### **Mapbox**

- **Mapbox GL JS**:
  - Estilo: Streets v12
  - Controles de navegação
  - Marcadores customizados
  - Popups interativos
  
- **Mapbox Geocoding API**:
  - Conversão de coordenadas em endereços
  - Idioma: Português (pt)

### **Geolocation API**

- **Navegador/Dispositivo**:
  - Captura de coordenadas GPS
  - Alta precisão habilitada
  - Timeout configurado
  - Tratamento de erros e permissões

---

## 📊 Estrutura de Dados

### **Coleção: users**

```typescript
{
  uid: string
  email: string
  name: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### **Coleção: reports**

```typescript
{
  id: string
  title: string
  description: string
  category: string
  status: 'pending' | 'in_progress' | 'resolved'
  userId: string
  userName: string
  userEmail: string
  photos: string[]  // URLs das imagens no Supabase
  latitude: number
  longitude: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### **Coleção: report_interactions**

```typescript
{
  reportId: string
  favorites: string[]  // Array de user IDs
  resolvedVotes: string[]  // Array de user IDs
  commentsCount: number
}
```

### **Coleção: comments**

```typescript
{
  id: string
  reportId: string
  userId: string
  userName: string
  userEmail: string
  text: string
  createdAt: Timestamp
}
```

---

## 🎨 Design e UX

### **Framework UI: Ionic**

- **Componentes Nativos**: Botões, cards, inputs, modais, etc.
- **Tema Dark**: Aplicação configurada com tema escuro
- **Responsividade**: Adaptação automática para diferentes tamanhos de tela
- **Animações**: Transições suaves entre telas
- **Feedback Visual**: Toasts, alerts, spinners, skeletons

### **Princípios de UX Aplicados**

- **Feedback Imediato**: Mensagens de sucesso/erro
- **Estados de Loading**: Spinners e skeletons durante carregamento
- **Validação em Tempo Real**: Formulários validam enquanto o usuário digita
- **Navegação Intuitiva**: Botões de voltar, breadcrumbs
- **Empty States**: Mensagens quando não há dados
- **Pull-to-Refresh**: Atualização manual de dados

---

## 🧪 Testes

### **Testes Unitários**

```bash
npm run test.unit
```

### **Testes E2E**

```bash
npm run test.e2e
```

---

## 📝 Scripts Disponíveis

```json
{
  "dev": "vite",                          // Servidor de desenvolvimento
  "build": "tsc && vite build",          // Build de produção
  "preview": "vite preview",             // Preview da build
  "test.e2e": "cypress run",             // Testes E2E
  "test.unit": "vitest",                 // Testes unitários
  "lint": "eslint",                      // Linter
  "cap:sync": "npx cap sync",            // Sincronizar Capacitor
  "cap:open:android": "npx cap open android",  // Abrir Android Studio
  "android:build": "npm run build && npx cap sync && npx cap open android",
  "android:apk": "npm run build && npx cap sync"
}
```

---

## 🔒 Segurança

### **Implementações de Segurança**

- **Validação de Dados**: Zod schemas em todos os formulários
- **Autenticação**: Firebase Authentication com tokens JWT
- **Regras do Firestore**: (Devem ser configuradas no Firebase Console)
- **HTTPS**: Todas as comunicações via HTTPS
- **Sanitização**: Validação de inputs antes de salvar no banco

### **Recomendações**

- Configurar regras de segurança no Firestore
- Implementar rate limiting
- Validar permissões no backend
- Usar variáveis de ambiente para credenciais sensíveis

---

## 📈 Melhorias Futuras

- [ ] Notificações push
- [ ] Moderação de conteúdo
- [ ] Dashboard administrativo
- [ ] Relatórios e estatísticas
- [ ] Integração com órgãos públicos
- [ ] Sistema de recompensas
- [ ] Compartilhamento em redes sociais
- [ ] Modo offline
- [ ] Cache de imagens
- [ ] Filtros avançados (por categoria, data, localização)
- [ ] Busca de ocorrências
- [ ] Edição de ocorrências próprias
- [ ] Exclusão de ocorrências

---

## 📚 Documentação Adicional

O projeto inclui vários arquivos de documentação:

- `FIREBASE_SETUP.md` - Guia de configuração do Firebase
- `MAPBOX_SETUP.md` - Guia de configuração do Mapbox
- `ANDROID_BUILD_GUIDE.md` - Guia de build para Android
- `ANDROID_PERMISSIONS.md` - Configuração de permissões Android
- `QUICK_START_APK.md` - Guia rápido para gerar APK
- `REPORT_INCIDENT_GUIDE.md` - Guia de uso da funcionalidade de relato
- `REPORT_DETAIL_GUIDE.md` - Guia da tela de detalhes
- `SPLASH_ICON_SETUP.md` - Configuração de ícone e splash screen

---

## 👨‍💻 Desenvolvido Por

**Jefferson Fonseca**

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

## 🙏 Agradecimentos

- **Ionic Framework** - Framework UI mobile
- **Firebase** - Backend como serviço
- **Supabase** - Plataforma de backend
- **Mapbox** - Serviços de mapas
- **React** - Biblioteca JavaScript
- **Comunidade Open Source** - Por todas as bibliotecas utilizadas

---

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através do repositório.

---

**Última atualização**: Dezembro 2024

