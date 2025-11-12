# 🧪 Tester le Dashboard Localement

Guide rapide pour tester le dashboard avant de déployer sur Vercel.

## ✅ Vérification du .env.local

Votre fichier `.env.local` dans le dossier `dashboard/` doit contenir :

```env
NEXT_PUBLIC_SUPABASE_URL=https://twpznfiyatzuwkyfgudh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_public
NEXT_PUBLIC_DISCORD_CLIENT_ID=1437809276927213628
DISCORD_CLIENT_SECRET=votre_client_secret_discord
NEXTAUTH_URL=http://localhost:3000
```

✅ **Votre .env.local est prêt !**

## 🚀 Tester le dashboard

### 1. Installer les dépendances

```bash
cd dashboard
npm install
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

### 3. Ouvrir dans le navigateur

Ouvrez http://localhost:3000

Vous devriez voir :
- La page de connexion Discord
- Un bouton "Se connecter avec Discord"

### 4. Tester la connexion

1. Cliquez sur "Se connecter avec Discord"
2. Vous serez redirigé vers Discord pour autoriser
3. Après autorisation, vous serez redirigé vers `/dashboard`
4. Vous devriez voir les statistiques de votre serveur

## ✅ Vérifications

### Si la connexion fonctionne :

- ✅ Vous êtes redirigé vers Discord
- ✅ Après autorisation, vous revenez sur `/dashboard`
- ✅ Les statistiques s'affichent
- ✅ Les graphiques fonctionnent

### Si ça ne fonctionne pas :

#### "Invalid redirect URI"

**Solution** :
1. Allez sur Discord Developer Portal > OAuth2 > General
2. Ajoutez dans Redirects : `http://localhost:3000/dashboard`
3. Vérifiez aussi dans Supabase > Authentication > URL Configuration

#### "OAuth2 application not found"

**Solution** :
1. Vérifiez que `DISCORD_CLIENT_SECRET` est correct dans `.env.local`
2. Vérifiez que le provider Discord est activé dans Supabase

#### "Redirect URL mismatch"

**Solution** :
1. Vérifiez les Redirect URLs dans Supabase
2. Vérifiez que `NEXTAUTH_URL=http://localhost:3000` dans `.env.local`

## 🔄 Prochaines étapes

Une fois que le dashboard fonctionne en local :

1. **Déployer sur Vercel** (voir `GUIDE_COMPLET.md` section "Déploiement du Dashboard")
2. **Configurer les Redirect URLs** pour la production
3. **Tester en production**

---

**Si tout fonctionne en local, vous pouvez déployer sur Vercel ! 🚀**

