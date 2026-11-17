# Red Bank

Aplicativo mobile de finanças pessoais. A pessoa cria uma conta, registra entradas e gastos e acompanha o mês em um dashboard.

Feito com React Native, Expo e Firebase.

## O que o app faz

- Cadastro e login com e-mail e senha
- Login com Google
- Lista de transações, com paginação
- Filtros por tipo, categoria, período e valor
- Inclusão, edição e exclusão de transações
- Validação dos formulários
- Recibo anexado à transação
- Dashboard do mês, com gráficos por categoria e resumo de entradas e gastos

Cada conta vê só as próprias transações. Ao sair, a lista e os filtros em memória são limpos.

## Stack

- Expo SDK 54 e React Native
- Firebase Authentication e Cloud Firestore
- Zustand para sessão, transações e filtros
- React Navigation
- NativeWind

O login fica separado em três pastas:

- `src/domain/auth` define o usuário da sessão, as regras do formulário e as mensagens de erro
- `src/application/auth` tem os casos de uso: entrar, cadastrar e sair
- `src/infra/auth` é o único ponto que fala com o Firebase Auth e com o SDK do Google

O restante das telas usa os hooks `useLogin`, `useSignup` e `useAuth`.

## Como rodar

O login com Google usa módulo nativo e `expo-dev-client`. O Expo Go não abre este projeto.

```bash
npm install
cp .env.example .env
```

Preencha o `.env` com o projeto Firebase. No console, ative os métodos **E-mail/senha** e **Google** em Authentication.

```bash
npm run ios
```

No Android, com emulador ou celular conectado:

```bash
npm run android
```

A primeira execução gera o projeto nativo e instala o app. Depois, com o app já instalado:

```bash
npx expo start --dev-client
```

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Login com Google |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | Login com Google no Android |

Os arquivos `google-services.json` e `GoogleService-Info.plist` ficam na raiz e são usados no build nativo.
