# 🔐 Configuration Supabase Auth avec Discord

Guide pour configurer l'authentification Discord dans Supabase.

## 📝 Étapes

### 1. Activer le provider Discord dans Supabase

1. Allez sur https://supabase.com et connectez-vous
2. Sélectionnez votre projet
3. Allez dans **Authentication** > **Providers**
4. Trouvez **Discord** dans la liste
5. Cliquez sur **Enable**

### 2. Configurer Discord OAuth2

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application (celle du bot)
3. Allez dans **OAuth2** > **General**
4. Dans **Redirects**, ajoutez :
   ```
   https://[votre-projet-id].supabase.co/auth/v1/callback
   ```
   Remplacez `[votre-projet-id]` par l'ID de votre projet Supabase (visible dans l'URL de votre projet)

### 3. Récupérer les clés Discord

1. Toujours dans **OAuth2** > **General** :
   - **Client ID** : Copiez-le (c'est le même que pour le bot)
   - **Client Secret** : Cliquez sur "Reset Secret" si nécessaire, puis copiez-le

### 4. Configurer dans Supabase

1. Retournez dans Supabase > **Authentication** > **Providers** > **Discord**
2. Remplissez :
   - **Client ID (for OAuth)** : Votre Discord Client ID
   - **Client Secret (for OAuth)** : Votre Discord Client Secret
3. Cliquez sur **Save**

### 5. Configurer les Redirect URLs

Dans Supabase > **Authentication** > **URL Configuration**, ajoutez :

- **Site URL** : `http://localhost:3000` (pour le dev)
- **Redirect URLs** :
  - `http://localhost:3000/dashboard`
  - `https://votre-app.vercel.app/dashboard`
  - `https://[votre-projet-id].supabase.co/auth/v1/callback`

### 6. Tester

1. Lancez le dashboard en local :
   ```bash
   cd dashboard
   npm install
   npm run dev
   ```

2. Allez sur http://localhost:3000
3. Cliquez sur "Se connecter avec Discord"
4. Vous devriez être redirigé vers Discord pour autoriser
5. Après autorisation, vous serez redirigé vers `/dashboard`

## ✅ Vérification

Si tout fonctionne :
- ✅ Vous pouvez vous connecter avec Discord
- ✅ Vous êtes redirigé vers `/dashboard`
- ✅ Vous voyez vos statistiques

## ❌ Problèmes courants

### "Invalid redirect URI"
- Vérifiez que l'URL de callback est bien dans les Redirects de Discord
- Format : `https://[projet-id].supabase.co/auth/v1/callback`

### "OAuth2 application not found"
- Vérifiez que le Client ID et Client Secret sont corrects
- Vérifiez que le provider Discord est bien activé dans Supabase

### "Redirect URL mismatch"
- Vérifiez les Redirect URLs dans Supabase
- Vérifiez que `NEXTAUTH_URL` correspond à votre URL de production

## 🔗 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)

