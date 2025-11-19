# Guia de Debug - Coordenadas no Mapa

## 🔍 Como Verificar Se As Coordenadas Estão Corretas

### Passo 1: Abra o Console do Navegador
Pressione `F12` e vá para a aba **Console**

### Passo 2: Analise os Logs
Quando você acessar a Tab 1, verá logs como:

```
📍 Ocorrência: [Nome da Ocorrência]
   Latitude: -5.7945
   Longitude: -35.2094
   Mapbox [lng, lat]: [-35.2094, -5.7945]
```

### Passo 3: Verifique Se As Coordenadas Fazem Sentido

**Para Natal, RN (referência):**
- Latitude: entre **-5.6** e **-6.0** (negativo = Sul)
- Longitude: entre **-35.1** e **-35.3** (negativo = Oeste)

**Exemplos de coordenadas corretas:**
- ✅ Latitude: -5.7945, Longitude: -35.2094
- ✅ Latitude: -5.8000, Longitude: -35.2500

**Exemplos de coordenadas INVERTIDAS (erro comum):**
- ❌ Latitude: -35.2094, Longitude: -5.7945 (INVERTIDO!)

## 🚨 Problema Comum: Coordenadas Invertidas

Se seus pins aparecem no lugar errado, provavelmente as coordenadas foram **salvas invertidas** no banco de dados.

### Como Identificar:

1. No console, veja os valores de Latitude e Longitude
2. Se a **Latitude** estiver entre -35.1 e -35.3 (deveria ser -5.x)
3. E a **Longitude** estiver entre -5.6 e -6.0 (deveria ser -35.x)
4. **Então as coordenadas estão INVERTIDAS!**

## 🔧 Soluções

### Solução 1: Corrigir Ocorrências Futuras

As novas ocorrências já são salvas corretamente. O código atual está correto:
- `latitude` = posição Norte/Sul
- `longitude` = posição Leste/Oeste

### Solução 2: Corrigir Ocorrências Antigas (Invertidas)

Se você tem ocorrências antigas com coordenadas invertidas, pode corrigi-las:

#### Opção A: Recriar as ocorrências
1. Delete as ocorrências antigas
2. Crie novamente com localização correta

#### Opção B: Corrigir manualmente no Firestore
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Firestore Database**
3. Abra a collection `reports`
4. Para cada documento com coordenadas invertidas:
   - Anote os valores atuais de `latitude` e `longitude`
   - **Troque** os valores:
     - Novo `latitude` = antigo `longitude`
     - Novo `longitude` = antigo `latitude`

#### Opção C: Script de Correção (Avançado)

Crie um script temporário para corrigir em lote:

```typescript
// Script para corrigir coordenadas invertidas
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './config/firebase';

async function fixInvertedCoordinates() {
  const reportsRef = collection(db, 'reports');
  const snapshot = await getDocs(reportsRef);
  
  let fixed = 0;
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const lat = data.latitude;
    const lng = data.longitude;
    
    // Verificar se está invertido
    // Natal está em aprox. lat=-5.79, lng=-35.20
    if (lat < -10 && lng > -10) {
      // Coordenadas provavelmente invertidas
      console.log(`Corrigindo: ${docSnap.id}`);
      console.log(`  Antes: lat=${lat}, lng=${lng}`);
      console.log(`  Depois: lat=${lng}, lng=${lat}`);
      
      await updateDoc(doc(db, 'reports', docSnap.id), {
        latitude: lng,
        longitude: lat,
      });
      
      fixed++;
    }
  }
  
  console.log(`${fixed} ocorrências corrigidas!`);
}

// Executar: fixInvertedCoordinates();
```

## 📊 Entendendo Coordenadas Geográficas

### Latitude (Norte/Sul)
- **-90° a +90°**
- Natal, RN: **-5.79°** (negativo = Sul do Equador)
- Valores próximos de 0 = próximo ao Equador
- Positivo = Hemisfério Norte
- Negativo = Hemisfério Sul

### Longitude (Leste/Oeste)
- **-180° a +180°**
- Natal, RN: **-35.21°** (negativo = Oeste de Greenwich)
- 0° = Meridiano de Greenwich
- Positivo = Leste
- Negativo = Oeste

## 🗺️ Formato Mapbox

O Mapbox usa o formato **[longitude, latitude]** (diferente do Google Maps):
- ✅ Correto: `[-35.2094, -5.7945]`
- ❌ Errado: `[-5.7945, -35.2094]`

## 🧪 Teste Rápido

Para testar se uma coordenada está correta:

1. Copie a coordenada do console
2. Cole no [Google Maps](https://www.google.com/maps)
3. Se aparecer em Natal = ✅ Correto
4. Se aparecer em outro lugar = ❌ Invertido

**Formato para Google Maps:** `latitude, longitude`
Exemplo: `-5.7945, -35.2094`

## 💡 Dica

Sempre que criar uma nova ocorrência:
1. Permita acesso à localização quando solicitado
2. Aguarde a mensagem "Localização capturada com sucesso!"
3. Verifique se o ícone de localização 📍 aparece
4. No console, confirme os valores fazem sentido para sua região

## 📞 Ainda Não Funciona?

Se após verificar tudo os pins ainda aparecem no lugar errado:

1. **Compartilhe os logs do console** - copie e cole os logs que aparecem
2. **Informe sua localização aproximada** - qual cidade/bairro você está
3. **Teste com coordenadas conhecidas** - tente criar uma ocorrência em um lugar que você conhece as coordenadas

### Coordenadas de Teste (Natal, RN):
- **Praia de Ponta Negra**: -5.8836, -35.1695
- **Arena das Dunas**: -5.8117, -35.2094
- **Forte dos Reis Magos**: -5.7638, -35.1988

