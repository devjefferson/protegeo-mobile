# Configuração do Mapbox

## Instalação

Para utilizar o mapa de ocorrências na Tab 1, você precisa instalar a biblioteca `mapbox-gl`:

```bash
npm install mapbox-gl
```

ou

```bash
yarn add mapbox-gl
```

## Token de Acesso

O token de acesso do Mapbox já está configurado no arquivo `src/pages/Tab1.tsx`:

```typescript
mapboxgl.accessToken = 'pk.eyJ1IjoibmRpZXN1cGVyIiwiYSI6ImNtaGt5Y3NtbjF4YWwybXExNTNhZ3o5aWwifQ.80LbeDqjawZsb6jwBG0ksg';
```

## Funcionalidades

### Visualização de Mapa

- ✅ Mapa interativo com marcadores para cada ocorrência
- ✅ Marcadores coloridos por status:
  - 🟡 Amarelo = Pendente
  - 🔵 Azul = Em Andamento
  - 🟢 Verde = Resolvido
- ✅ Popups informativos ao clicar nos marcadores
- ✅ Legenda explicativa no canto inferior esquerdo
- ✅ Controles de navegação (zoom e rotação)
- ✅ Auto-ajuste do zoom para mostrar todas as ocorrências

### Alternância entre Visualizações

A Tab 1 agora possui dois modos de visualização:

1. **Mapa** (padrão): Exibe as ocorrências em um mapa interativo
2. **Lista**: Exibe as ocorrências em cards (visualização anterior)

Use o segmento no topo da página para alternar entre os modos.

## Detalhes Técnicos

### Marcadores Personalizados

Os marcadores são criados dinamicamente com animação de pulso e cores baseadas no status da ocorrência.

### Popups

Cada marcador possui um popup que exibe:
- Título da ocorrência
- Descrição (limitada a 100 caracteres)
- Categoria
- Status
- Botão para ver detalhes completos

### Centro do Mapa

O mapa é inicializado centralizado em Natal, RN:
- Latitude: -5.7945
- Longitude: -35.2094
- Zoom inicial: 12

Quando há ocorrências com coordenadas, o mapa ajusta automaticamente para mostrar todas elas.

## Troubleshooting

### Erro: "mapbox-gl não encontrado"

Execute:
```bash
npm install mapbox-gl
```

### Mapa não aparece

Verifique se:
1. O token de acesso está configurado corretamente
2. A biblioteca `mapbox-gl` está instalada
3. O CSS do Mapbox está sendo importado no arquivo Tab1.tsx

### Marcadores não aparecem

Certifique-se de que as ocorrências possuem coordenadas (latitude e longitude) registradas.

