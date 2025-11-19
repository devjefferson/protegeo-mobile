# Teste de Diagnóstico - Marcadores no Mapa

## 🔍 Para descobrir se o problema é com coordenadas ou com o elemento customizado:

### Teste 1: Usar Marcador Padrão do Mapbox

Temporariamente, substitua o código dos marcadores por este (na linha ~155 do Tab1.tsx):

```typescript
// TESTE: Marcador padrão do Mapbox (sem customização)
const marker = new mapboxgl.Marker({ color: getMarkerColor(report.status) })
  .setLngLat([lng, lat])
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div style="padding: 8px;">
        <h3>${report.title}</h3>
        <p>Lat: ${lat}, Lng: ${lng}</p>
      </div>`
    )
  )
  .addTo(map.current!);
```

**Se o marcador aparecer NO LUGAR CORRETO:**
- ✅ As coordenadas estão corretas
- ❌ O problema é com o elemento customizado

**Se o marcador ainda aparecer NO CANTO:**
- ❌ As coordenadas estão erradas (0,0 ou undefined)
- Verifique o console: `console.log(reports)`

---

## 🐛 Problema Mais Comum: Coordenadas (0, 0)

### Verificar no Console:

1. Abra o console (F12)
2. Procure por: `console.log(reports)`
3. Expanda o array e veja cada objeto
4. Procure por: `latitude` e `longitude`

### Exemplo de Dados CORRETOS:
```javascript
{
  latitude: -22.898591281286024,
  longitude: -43.60066971402758,
  title: "Buraco na rua"
}
```

### Exemplo de Dados INCORRETOS:
```javascript
{
  latitude: 0,  // ❌ PROBLEMA!
  longitude: 0, // ❌ PROBLEMA!
  title: "Buraco na rua"
}
```

Ou:

```javascript
{
  // ❌ latitude e longitude ausentes!
  title: "Buraco na rua"
}
```

---

## 🔧 Soluções:

### Se as coordenadas são (0, 0) ou undefined:

#### Opção 1: Criar Nova Ocorrência
1. Clique no botão `+`
2. **IMPORTANTE:** Quando o navegador pedir permissão de localização, clique em **"Permitir"**
3. Aguarde a mensagem "Localização capturada com sucesso!"
4. Preencha os dados e salve

#### Opção 2: Corrigir Ocorrências Antigas no Firestore
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Firestore Database** > `reports`
3. Para cada documento sem coordenadas, adicione:
   - `latitude`: (número)
   - `longitude`: (número)

#### Opção 3: Deletar e Recriar
Delete as ocorrências antigas e crie novas com localização.

---

## 📊 Coordenadas de Referência (Rio de Janeiro):

Use para testar manualmente no Firestore:

- **Copacabana**: `{ latitude: -22.9711, longitude: -43.1822 }`
- **Ipanema**: `{ latitude: -22.9838, longitude: -43.2044 }`
- **Centro**: `{ latitude: -22.9068, longitude: -43.1729 }`

---

## ✅ Checklist de Diagnóstico:

- [ ] Abrirconsole e verificar `console.log(reports)`
- [ ] Confirmar que `latitude` e `longitude` existem e não são 0
- [ ] Testar com marcador padrão (código acima)
- [ ] Verificar se o navegador tem permissão de localização
- [ ] Criar uma nova ocorrência permitindo localização
- [ ] Verificar se o novo marcador aparece corretamente

---

## 🎯 Próximos Passos:

**Me informe:**
1. O que aparece em `console.log(reports)`?
2. Os valores de `latitude` e `longitude` são números válidos ou são 0?
3. Ao testar com o marcador padrão, ele aparece no lugar correto?

