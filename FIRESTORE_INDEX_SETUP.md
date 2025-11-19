# Configuração de Índices do Firestore

## Problema: Erro ao Carregar Ocorrências

Se você está recebendo um erro ao carregar as ocorrências, provavelmente é porque o Firestore precisa de índices compostos para queries que combinam `where()` e `orderBy()`.

## Solução

### Opção 1: Via Console do Firebase (Automático)

1. Execute o aplicativo e tente carregar a Tab 1
2. Abra o console do navegador (F12)
3. Você verá um erro com um **link** para criar o índice automaticamente
4. Clique no link - ele abrirá o Firebase Console
5. Clique em "Criar Índice"
6. Aguarde alguns minutos até o índice ser criado
7. Recarregue a página

### Opção 2: Criar Manualmente

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: **protegeo**
3. Vá em **Firestore Database** > **Índices**
4. Clique em **Adicionar Índice**
5. Configure o índice:

**Para a Tab 1 (Minhas Ocorrências):**
- Collection ID: `reports`
- Campos:
  - Campo 1: `userId` | Ascending
  - Campo 2: `createdAt` | Descending
- Scope: Collection

6. Clique em **Criar**

### Opção 3: Via Linha de Comando

Crie um arquivo `firestore.indexes.json` na raiz do projeto:

```json
{
  "indexes": [
    {
      "collectionGroup": "reports",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

Depois execute:

```bash
firebase deploy --only firestore:indexes
```

## Workaround Temporário

O código já está preparado com um **fallback automático**:

- Se a query com `orderBy` falhar, o sistema:
  1. Busca os dados **sem ordenação**
  2. Ordena **manualmente** no JavaScript
  3. Funciona normalmente, mas é menos eficiente

Isso permite que o app funcione enquanto o índice está sendo criado.

## Verificar se o Índice Foi Criado

1. Acesse o Firebase Console
2. Vá em **Firestore Database** > **Índices**
3. Verifique se o status está como **"Habilitado"** (enabled)

## Outros Índices Necessários

### Para Comentários (ReportDetail)

Se você tiver problemas ao carregar comentários:

```json
{
  "collectionGroup": "comments",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "reportId",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "createdAt",
      "order": "DESCENDING"
    }
  ]
}
```

## Tempo de Criação

- Índices simples: 2-5 minutos
- Índices complexos: até 30 minutos
- Durante a criação, o fallback manual funciona normalmente

## Troubleshooting

### Erro: "mapbox-gl is not defined"

Execute:
```bash
npm install
```

### Erro: "Cannot read property 'addTo' of null"

O mapa ainda não foi inicializado. O código já trata isso verificando `if (!map.current) return`.

### Mapa não aparece

1. Verifique se executou `npm install`
2. Limpe o cache: `npm run build`
3. Reinicie o servidor: `npm run dev`

### Erro de permissões do Firestore

Verifique suas regras em **Firestore Database** > **Regras**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita de reports para usuários autenticados
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              request.auth.uid == resource.data.userId;
    }
    
    // Permitir leitura e escrita de interações
    match /report_interactions/{reportId} {
      allow read, write: if request.auth != null;
    }
    
    // Permitir leitura e escrita de comentários
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              request.auth.uid == resource.data.userId;
    }
    
    // Permitir leitura de perfis de usuário
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

