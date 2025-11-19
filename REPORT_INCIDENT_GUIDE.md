# Guia - Registrar Ocorrências

## ✅ Funcionalidades Implementadas

### 📋 Formulário Completo

1. **Categoria** (Select dropdown)
   - Alagamento
   - Buraco na rua
   - Poste caído
   - Iluminação pública
   - Lixo acumulado
   - Árvore caída
   - Esgoto
   - Calçada danificada
   - Semáforo com defeito
   - Outros

2. **Título**
   - Mínimo: 5 caracteres
   - Máximo: 100 caracteres
   - Campo obrigatório

3. **Descrição**
   - Mínimo: 10 caracteres
   - Máximo: 500 caracteres
   - TextArea com 4 linhas
   - Campo obrigatório

### 📷 Upload de Fotos

- **Até 5 fotos** por ocorrência
- **Duas opções de captura:**
  - 📸 Tirar foto com câmera
  - 🖼️ Escolher da galeria
- **Preview das fotos** antes de enviar
- **Botão de remover** em cada foto
- **Grid responsivo** para exibição
- **Validação:** Pelo menos 1 foto obrigatória

### 📍 Localização GPS

- **Captura automática** da localização atual
- **Usa Geolocation API** do navegador
- **Exibe coordenadas** (latitude, longitude)
- **Indicador visual** de sucesso (botão verde com ✓)
- **Loading state** enquanto obtém localização
- **Tratamento de erros** de permissão
- **Validação:** Localização obrigatória

### 💾 Salvamento no Firebase

#### Firestore:
```typescript
Coleção: "reports"
{
  title: string
  description: string
  category: string
  userId: string
  userName: string
  userEmail: string
  photos: string[] // URLs do Storage
  latitude: number
  longitude: number
  status: "pending" | "in_progress" | "resolved"
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Storage:
```
reports/
  └── {userId}/
      ├── {timestamp}_0.jpg
      ├── {timestamp}_1.jpg
      └── ...
```

## 🎨 Interface

### Componentes Ionic Utilizados:
- ✅ IonSelect (dropdown de categorias)
- ✅ IonInput (título)
- ✅ IonTextarea (descrição)
- ✅ IonActionSheet (escolher foto)
- ✅ IonFab (botão flutuante)
- ✅ PageHeader (header customizado)
- ✅ IonButton (ações)

### Design:
- ✅ UI padrão do Ionic
- ✅ Seções visuais organizadas
- ✅ Grid de fotos responsivo
- ✅ Feedback visual claro
- ✅ Estados de loading
- ✅ Validação em tempo real
- ✅ Mensagens de erro e sucesso (Toast)

## 🚀 Como Usar

### 1. Acessar a tela:
- Clique no **botão flutuante (+)** na Tab "Início"
- Ou navegue para `/report-incident`

### 2. Preencher o formulário:
1. Selecione a **categoria** da ocorrência
2. Digite um **título** descritivo
3. Escreva uma **descrição** detalhada do problema

### 3. Adicionar fotos:
1. Clique no botão **"Adicionar foto"**
2. Escolha entre:
   - **Tirar Foto**: Abre a câmera
   - **Escolher da Galeria**: Abre galeria de fotos
3. Adicione até **5 fotos**
4. Remova fotos clicando no ícone de lixeira

### 4. Capturar localização:
1. Clique em **"Capturar localização atual"**
2. Permita o acesso à localização quando solicitado
3. Aguarde a confirmação (botão ficará verde)

### 5. Enviar:
1. Verifique se todos os campos obrigatórios estão preenchidos
2. Clique em **"Registrar Ocorrência"**
3. Aguarde o upload e salvamento
4. Será redirecionado para a página inicial

## 🔧 Configuração Necessária

### Firebase Storage (para fotos):
```javascript
// No arquivo firebase.ts, adicione:
import { getStorage } from "firebase/storage"
export const storage = getStorage(app)
```

### Regras do Storage:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{userId}/{allPaths=**} {
      // Apenas o usuário pode fazer upload
      allow write: if request.auth != null && request.auth.uid == userId;
      // Qualquer um autenticado pode ler
      allow read: if request.auth != null;
    }
  }
}
```

### Regras do Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      // Qualquer usuário autenticado pode criar
      allow create: if request.auth != null;
      
      // Apenas o dono pode editar/deletar
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Qualquer um autenticado pode ler
      allow read: if request.auth != null;
    }
  }
}
```

## 📱 Permissões Necessárias

### Browser (Web):
- ✅ **Geolocation**: Acesso à localização
- ✅ **Camera**: Acesso à câmera (se tirar foto)
- ✅ **File System**: Acesso aos arquivos (galeria)

### Mobile (Capacitor):
Adicione no `capacitor.config.ts`:
```typescript
{
  plugins: {
    Camera: {
      iosPermissions: {
        camera: "Precisamos acessar sua câmera para tirar fotos das ocorrências",
        photos: "Precisamos acessar sua galeria para escolher fotos"
      }
    },
    Geolocation: {
      iosPermissions: {
        location: "Precisamos da sua localização para registrar onde está o problema"
      }
    }
  }
}
```

## 🎯 Validações

### Formulário:
- ✅ Categoria obrigatória
- ✅ Título: 5-100 caracteres
- ✅ Descrição: 10-500 caracteres
- ✅ Pelo menos 1 foto
- ✅ Localização obrigatória

### Fotos:
- ✅ Máximo 5 fotos
- ✅ Apenas imagens
- ✅ Preview antes de enviar

### Localização:
- ✅ Coordenadas válidas
- ✅ Tratamento de erro de permissão
- ✅ Timeout de 10 segundos

## 🔄 Fluxo Completo

```
1. Usuário clica no FAB (+)
   ↓
2. Abre tela de Registrar Ocorrência
   ↓
3. Preenche categoria, título e descrição
   ↓
4. Adiciona fotos (câmera ou galeria)
   ↓
5. Captura localização GPS
   ↓
6. Clica em "Registrar Ocorrência"
   ↓
7. Upload das fotos para Storage
   ↓
8. Salva dados no Firestore
   ↓
9. Toast de sucesso
   ↓
10. Redireciona para Tab1 (Início)
```

## 🐛 Troubleshooting

### "Erro ao obter localização"
- Verifique se permitiu acesso à localização
- Tente em HTTPS (não funciona em HTTP)
- Verifique se o GPS está ativado

### "Máximo de 5 fotos permitidas"
- Remova fotos antes de adicionar novas
- Cada ocorrência aceita no máximo 5 fotos

### Fotos não aparecem
- Verifique se configurou o Firebase Storage
- Verifique as regras de segurança
- Veja o console do navegador para erros

## 📊 Estrutura de Dados

### Exemplo de documento no Firestore:
```json
{
  "id": "abc123",
  "title": "Buraco grande na Rua Principal",
  "description": "Buraco de aproximadamente 50cm de profundidade no meio da pista",
  "category": "Buraco na rua",
  "userId": "user123",
  "userName": "João Silva",
  "userEmail": "joao@email.com",
  "photos": [
    "https://storage.googleapis.com/...",
    "https://storage.googleapis.com/..."
  ],
  "latitude": -23.5505199,
  "longitude": -46.6333094,
  "status": "pending",
  "createdAt": "2025-11-04T10:30:00Z",
  "updatedAt": "2025-11-04T10:30:00Z"
}
```

## ✨ Próximos Passos (Opcional)

- [ ] Integração com Google Maps para pin no mapa
- [ ] Compressão de imagens antes do upload
- [ ] Modo offline (salvar localmente e sincronizar depois)
- [ ] Notificações push quando status mudar
- [ ] Lista de ocorrências registradas
- [ ] Filtros por categoria/status
- [ ] Compartilhar ocorrência
- [ ] Comentários em ocorrências
- [ ] Sistema de likes/upvotes
- [ ] Mapa com todas as ocorrências

---

**Tela criada por: Cursor AI**  
**Data: 04/11/2025**



