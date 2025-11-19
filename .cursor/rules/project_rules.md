# Regras do Projeto - EncurMe

Sou um programador sênior desenvolvendo um aplicativo mobile chamado Protegeo, utilizando Ionic com React e seguindo a arquitetura MVVM. O app tem como objetivo permitir que cidadãos reportem ocorrências urbanas e desastres naturais em tempo real (alagamentos, buracos, quedas de árvores), com envio de fotos, localização via GPS e descrição.

Para o design, estou utilizando exclusivamente os componentes padrão do Ionic para garantir consistência visual e performance nativa.

## Arquitetura MVVM

#### Componentes e Features

- `components/` - Componentes React reutilizáveis
- `__features/` - Funcionalidades específicas do domínio
- `layouts/` - Layouts e templates da aplicação
- `screens/` - Páginas da aplicação

#### Lógica e Dados

- `services/` - Serviços e integrações com APIs
- `hooks/` - Custom hooks React
- `contexts/` - Contextos React para gerenciamento de estado
- `utils/` - Funções utilitárias
- `routes/` - Configurações de rotas

### Estrutura Obrigatória para Componentes

```
src/components/[ComponentName]/
├── index.tsx          # View (React Component)
├── viewModel.ts       # ViewModel (Business Logic)
├── model.ts          # Model (Types & Interfaces)

```

### Estrutura Obrigatória para Telas

```
src/screens/[ScreenName]/
├── index.tsx          # View (React Component)
├── viewModel.ts       # ViewModel (Business Logic)
├── model.ts          # Model (Types & Interfaces)
├── _features/        # Features específicas da tela

```

## Regras de Desenvolvimento

### 1. Nomenclatura

- **Componentes**: PascalCase (ex: `UserProfile`, `NavigationMenu`)
- **Hooks**: camelCase iniciando com `use` (ex: `useUserData`, `useNavigation`)
- **Interfaces**: PascalCase iniciando com `I` (ex: `IUserProps`, `INavigationState`)
- **Types**: PascalCase iniciando com `T` (ex: `TUserAction`, `TNavigationMode`)
- **Enums**: PascalCase (ex: `UserStatus`, `NavigationDirection`)

### 2. Imports

- Sempre usar imports relativos para arquivos locais
- Agrupar imports por categoria:
  1. React e bibliotecas externas
  2. Ionic components (`@ionic/react`)
  3. React Hook Form e Zod (`react-hook-form`, `zod`, `@hookform/resolvers/zod`)
  4. Componentes internos
  5. Hooks e utilitários
  6. Types e interfaces
  7. Arquivos locais (./model, ./viewModel)

### 3. TypeScript

- Sempre tipar explicitamente props de componentes
- Usar `React.FC<Props>` ou tipagem direta no parâmetro
- Evitar `any` - usar `unknown` quando necessário
- Preferir `interface` para objetos, `type` para unions

### 4. Performance

- Usar `React.memo` para componentes que recebem props complexas
- Usar `useCallback` para funções passadas como props
- Usar `useMemo` para cálculos custosos
- Implementar lazy loading para telas pesadas

### 5. Estado

- Estado local: `useState` no ViewModel
- Estado global: Context API ou Redux
- Estado de formulário: React Hook Form com Zod para validação
- Cache de dados: React Query ou SWR

### 6. Estilos

- **UI Library**: Ionic
- Usar componentes Ionic sempre que possível
- Configuração centralizada em `ionic.config.ts`
- Temas customizados para dark/light mode
- Tokens de design system consistentes

### 7. Validação de Formulários

- **Schema Validation**: Zod
- Integração com React Hook Form via `@hookform/resolvers/zod`
- Validação tanto no cliente quanto no servidor
- Mensagens de erro tipadas e consistentes

## Regras ESLint Customizadas

### component-structure

Garante que componentes sigam a estrutura MVVM obrigatória.

### screen-structure

Garante que telas sigam a estrutura MVVM obrigatória.

### viewmodel-purity

Garante que ViewModels não contenham JSX ou imports de componentes React.

### model-purity

Garante que Models contenham apenas tipos, interfaces e constantes.

### no-business-logic-in-components

Garante que componentes não contenham lógica de negócio complexa.

## Padrões de Código

### Componente Exemplo

```typescript
// index.tsx
import React from "react"
import { IonButton, IonText, IonStack } from "@ionic/react"
import type { IComponentProps } from "./model"
import { useComponentViewModel } from "./viewModel"

export const Component: React.FC<IComponentProps> = (props) => {
  const viewModel = useComponentViewModel(props)

  return (
    <IonStack padding="$4" gap="$3">
      <IonText fontSize="$6" fontWeight="bold">
        {viewModel.state.title}
      </IonText>
      <IonStack gap="$2">
        <IonButton onPress={viewModel.actions.handleAction}>
          Ação Principal
        </IonButton>
      </IonStack>
    </IonStack>
  )
}
```

### ViewModel com Formulário Exemplo

```typescript
// viewModel.ts
import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { IComponentProps, IComponentState, TFormData } from "./model"
import { formSchema } from "./model"

export const useComponentViewModel = (props: IComponentProps) => {
  const [state, setState] = useState<IComponentState>({
    // estado inicial
  })

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // valores padrão
    },
  })

  const handleSubmit = useCallback((data: TFormData) => {
    // lógica de submissão
  }, [])

  const handleAction = useCallback(() => {
    // lógica de negócio
  }, [])

  useEffect(() => {
    // efeitos colaterais
  }, [])

  return {
    state,
    form,
    actions: {
      handleAction,
      handleSubmit: form.handleSubmit(handleSubmit),
    },
  }
}
```

### Model Exemplo

```typescript
// model.ts
import { z } from "zod"

export interface IComponentProps {
  // props do componente
  title?: string
  onAction?: () => void
}

export interface IComponentState {
  // estado do componente
  title: string
  isLoading: boolean
  error?: string
}

// Schema Zod para formulários
export const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().min(18, "Idade mínima é 18 anos"),
})

export type TFormData = z.infer<typeof formSchema>

export type TComponentAction = "action1" | "action2"

export enum ComponentStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}
```

## Ferramentas de Desenvolvimento

### Scripts Disponíveis

- `npm run lint` - Executa ESLint
- `npm run lint:fix` - Corrige erros automaticamente
- `npm run lint:mvvm` - Verifica regras MVVM específicas
- `npm run create:component <name>` - Cria novo componente
- `npm run create:screen <name>` - Cria nova tela
- `npm run check:architecture` - Verifica arquitetura geral

### Comandos de Criação

```bash
# Criar componente
npm run create:component UserProfile

# Criar tela
npm run create:screen Dashboard
```

## Boas Práticas

### 1. Testabilidade

- ViewModels devem ser facilmente testáveis
- Separar lógica de apresentação da lógica de negócio
- Usar dependency injection quando necessário

### 2. Reutilização

- Componentes atômicos e reutilizáveis
- Separação de responsabilidades por feature
- Mantenha a responsabilidade única
- ViewModels podem ser compartilhados entre componentes similares
- Models devem definir contratos claros

### 3. Manutenibilidade

- Código autodocumentado
- Comentários apenas quando necessário
- Refatoração constante

### 4. Segurança

- Validação de dados no ViewModel
- Sanitização de inputs
- Tratamento de erros adequado

## Migração Gradual

### Passo 1: Identificar Componentes

- Listar todos os componentes existentes
- Priorizar por complexidade e uso

### Passo 2: Refatorar

- Extrair lógica para ViewModel
- Criar interfaces no Model
- Atualizar imports e exports

### Passo 3: Validar

- Executar testes
- Verificar ESLint
- Testar funcionalidade

### Passo 4: Documentar

- Atualizar README
- Adicionar comentários se necessário
- Compartilhar conhecimento com equipe
