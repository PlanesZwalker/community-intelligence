# 🚀 Configuration Groq (GRATUIT)

Groq est **100% gratuit** et parfait pour démarrer votre bot avec l'IA !

## ⚡ Avantages de Groq

- ✅ **Gratuit** : 14,400 requêtes/jour (largement suffisant)
- ✅ **Ultra rapide** : Réponses en millisecondes
- ✅ **Modèles open-source** : Llama 3.1, Mixtral
- ✅ **Pas de carte bancaire** requise

## 📝 Étapes de configuration

### 1. Créer un compte

1. Allez sur https://console.groq.com
2. Cliquez sur "Sign Up" (gratuit)
3. Connectez-vous avec Google, GitHub ou email

### 2. Générer une clé API

1. Une fois connecté, allez dans "API Keys"
2. Cliquez sur "Create API Key"
3. Donnez un nom (ex: "Community Intelligence Bot")
4. **Copiez la clé** (vous ne pourrez plus la voir après !)

### 3. Configurer le bot

Ajoutez dans votre fichier `.env` :

```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_votre_cle_ici
```

### 4. Redémarrer le bot

```bash
npm start
```

## ✅ Test

Utilisez la commande `/ai-summary` sur votre serveur Discord pour tester !

## 📊 Limites

- **14,400 requêtes/jour** (gratuit)
- **30 requêtes/minute** (rate limit)
- Suffisant pour **50-100 serveurs** actifs

## 🔄 Si vous dépassez les limites

1. Attendez la réinitialisation (toutes les 24h)
2. Ou passez à un autre provider (OpenAI, Claude)
3. Ou créez un deuxième compte Groq (gratuit aussi)

## 💡 Astuce

Groq est parfait pour la **Phase 1** (validation). Une fois que vous avez des revenus, vous pourrez passer à Claude/OpenAI pour de meilleures réponses, mais Groq reste excellent pour la plupart des cas d'usage !

---

**C'est tout ! Votre bot a maintenant l'IA intégrée gratuitement ! 🎉**

