# 🔗 URLs du Bot sur Render

## URLs de production

Votre bot est déployé sur Render à l'adresse :
```
https://community-intelligence.onrender.com
```

### Endpoints disponibles

- **Interactions Discord** : `https://community-intelligence.onrender.com/discord`
- **Vérification Linked Roles** : `https://community-intelligence.onrender.com/verify`
- **Terms of Service** : `https://community-intelligence.onrender.com/terms`
- **Privacy Policy** : `https://community-intelligence.onrender.com/privacy`

## 📝 Configuration Discord Developer Portal

### Interactions Endpoint URL
```
https://community-intelligence.onrender.com/discord
```

⚠️ **Important** : Si vous utilisez cette URL, Discord enverra les interactions via HTTP POST au lieu de Gateway. Cela nécessite un serveur web Express dans votre bot.

### Linked Roles Verification URL
```
https://community-intelligence.onrender.com/verify
```

### Terms of Service URL
```
https://community-intelligence.onrender.com/terms
```

### Privacy Policy URL
```
https://community-intelligence.onrender.com/privacy
```

## ⚠️ Note importante

Notre bot actuel utilise les **interactions Gateway** (discord.js standard), pas HTTP. 

Si vous voulez utiliser l'endpoint `/discord` pour les interactions HTTP, vous devez :
1. Ajouter un serveur Express au bot
2. Créer un endpoint POST `/discord` qui gère les interactions
3. Désactiver les interactions Gateway dans discord.js

Sinon, **laissez "Interactions Endpoint URL" vide** dans Discord Developer Portal pour utiliser Gateway.

## 🔧 Si vous voulez ajouter le support HTTP

Je peux vous aider à ajouter un serveur Express pour supporter les interactions HTTP si vous le souhaitez. Cela permettrait d'utiliser l'endpoint `/discord`.

---

**Ces URLs sont maintenant documentées et prêtes à être utilisées ! 🎉**

