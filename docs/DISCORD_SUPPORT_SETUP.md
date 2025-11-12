# 🎮 Configuration du Serveur Discord de Support

Guide pour créer et configurer un serveur Discord dédié au support pour Community Intelligence Bot.

## 📋 Pourquoi Discord pour le Support ?

- ✅ **Gratuit** : Pas de coût mensuel
- ✅ **Familière** : Les utilisateurs de Discord sont déjà sur la plateforme
- ✅ **Rapide** : Réponses en temps réel
- ✅ **Organisé** : Système de tickets et canaux dédiés
- ✅ **Communauté** : Permet aux utilisateurs de s'entraider

## 🚀 Création du Serveur

### Étape 1 : Créer le Serveur

1. Ouvrez Discord
2. Cliquez sur le **+** à gauche pour créer un serveur
3. Choisissez **"Créer mon propre serveur"**
4. Nommez-le : **"Community Intelligence Support"** (ou similaire)
5. Ajoutez une icône si vous le souhaitez

### Étape 2 : Configuration de Base

#### Canaux Recommandés

**Canaux Textuels :**
- `#📋-bienvenue` - Message de bienvenue et règles
- `#💬-général` - Discussions générales
- `#❓-support` - Support général
- `#🐛-bug-reports` - Signalement de bugs
- `#💡-suggestions` - Suggestions de fonctionnalités
- `#📢-annonces` - Annonces importantes
- `#✅-résolu` - Tickets résolus (archive)

**Canaux Vocaux (Optionnel) :**
- `Support Vocal` - Pour le support vocal si nécessaire

### Étape 3 : Système de Tickets (Recommandé)

#### Option 1 : Bot de Tickets (Recommandé)

Utilisez un bot comme **Ticket Tool** ou **Dyno** pour créer un système de tickets automatique :

1. Invitez le bot Ticket Tool : https://tickettool.xyz/
2. Configurez un canal pour créer des tickets (ex: `#🎫-créer-un-ticket`)
3. Les utilisateurs peuvent créer un ticket en réagissant à un message
4. Un canal privé est créé automatiquement pour chaque ticket

#### Option 2 : Système Manuel

Créez un canal `#🎫-créer-un-ticket` avec un message expliquant comment créer un ticket :
- Réagir avec 🎫 pour créer un ticket
- Un modérateur créera un canal privé

### Étape 4 : Rôles et Permissions

#### Rôles à Créer

1. **Support Team** - Équipe de support
   - Permissions : Voir tous les canaux, répondre aux tickets, gérer les messages

2. **Modérateur** - Modérateurs du serveur
   - Permissions : Gérer les messages, kick/ban, gérer les canaux

3. **Premium** - Utilisateurs premium (optionnel)
   - Couleur spéciale, accès à un canal premium dédié

#### Permissions par Canal

- **Canaux publics** : Accessibles à tous
- **Canaux de tickets** : Privés, accessibles uniquement au créateur et à l'équipe support
- **Canaux résolus** : Lecture seule pour tous sauf l'équipe support

### Étape 5 : Message de Bienvenue

Créez un message dans `#📋-bienvenue` :

```
# 👋 Bienvenue sur le Support Community Intelligence !

Ce serveur est dédié au support et à l'assistance pour **Community Intelligence Bot**.

## 📞 Comment obtenir de l'aide ?

1. **Support Général** : Posez vos questions dans `#❓-support`
2. **Bug à signaler** : Utilisez `#🐛-bug-reports` avec :
   - Description du bug
   - Étapes pour reproduire
   - Captures d'écran si possible
3. **Créer un ticket** : Réagissez avec 🎫 dans `#🎫-créer-un-ticket` pour un support privé
4. **Suggestion** : Partagez vos idées dans `#💡-suggestions`

## 📋 Règles

- Soyez respectueux et patient
- Utilisez les canaux appropriés
- Fournissez autant de détails que possible
- Vérifiez les FAQ avant de poser une question

## 🔗 Liens Utiles

- [Documentation](https://github.com/PlanesZwalker/community-intelligence)
- [Dashboard](https://community-intelligence-chi.vercel.app/dashboard)
- [Inviter le bot](https://discord.com/api/oauth2/authorize?client_id=1437809276927213628&permissions=274877906944&scope=bot%20applications.commands)

Merci d'utiliser Community Intelligence Bot ! 🚀
```

## 🔗 Créer un Lien d'Invitation Permanent

### Étape 1 : Créer l'Invitation

1. Cliquez sur le nom du serveur en haut à gauche
2. Allez dans **"Paramètres du serveur"**
3. Cliquez sur **"Invitations"** dans le menu de gauche
4. Cliquez sur **"Créer une invitation"**

### Étape 2 : Configurer l'Invitation

- **Durée** : **Jamais** (permanent)
- **Utilisations maximales** : **Illimité**
- **Permissions** : 
  - ✅ Voir les canaux
  - ✅ Envoyer des messages
  - ✅ Lire l'historique des messages
  - ❌ Gérer le serveur (réservé aux admins)

### Étape 3 : Copier le Lien

Le lien sera au format : `https://discord.gg/xxxxx`

**Exemple** : `https://discord.gg/community-intelligence`

### Étape 4 : Mettre à Jour le Code

Si vous voulez utiliser un lien personnalisé, vous pouvez :

1. **Option 1** : Utiliser le lien par défaut `https://discord.gg/community-intelligence`
   - Créez simplement un lien avec ce nom personnalisé dans Discord

2. **Option 2** : Configurer via variable d'environnement
   - Ajoutez `NEXT_PUBLIC_SUPPORT_DISCORD_INVITE` dans Vercel
   - Le fichier `dashboard/lib/support.ts` utilisera automatiquement cette variable

## 📝 Mise à Jour du Lien dans le Code

Le lien Discord est actuellement défini dans plusieurs fichiers. Pour le changer :

### Fichiers à Modifier

1. **`dashboard/lib/support.ts`** - Configuration centrale
2. **`dashboard/app/privacy/page.tsx`** - Page de confidentialité
3. **`dashboard/app/cgv/page.tsx`** - Conditions générales de vente
4. **`dashboard/app/terms/page.tsx`** - Conditions d'utilisation
5. **`dashboard/app/landing/page.tsx`** - Landing page

### Méthode Recommandée

Utilisez la variable d'environnement `NEXT_PUBLIC_SUPPORT_DISCORD_INVITE` :

1. Dans Vercel, ajoutez la variable :
   ```
   NEXT_PUBLIC_SUPPORT_DISCORD_INVITE=https://discord.gg/votre-lien
   ```

2. Le fichier `dashboard/lib/support.ts` utilisera automatiquement cette variable

## 🎯 Bonnes Pratiques

### Organisation

- **Répondez rapidement** : Objectif < 24h pour les tickets
- **Organisez les tickets** : Utilisez des tags ou des canaux par catégorie
- **Archivez les résolus** : Déplacez les tickets résolus dans `#✅-résolu`
- **Documentez les solutions** : Créez une FAQ avec les questions fréquentes

### Communication

- **Soyez clair et professionnel**
- **Demandez des détails** : ID de serveur, captures d'écran, logs
- **Reconnaissez les bugs** : Remerciez les utilisateurs pour leurs signalements
- **Communiquez les mises à jour** : Utilisez `#📢-annonces` pour les nouveautés

### Modération

- **Règles claires** : Affichez les règles dans `#📋-bienvenue`
- **Action rapide** : Supprimez le spam immédiatement
- **Respect mutuel** : Maintenez un environnement respectueux

## 📊 Métriques à Suivre

- Temps de réponse moyen
- Nombre de tickets par jour
- Taux de résolution
- Satisfaction des utilisateurs (sondages optionnels)

## 🔄 Intégration avec le Bot

### Commandes Utiles

Vous pouvez ajouter une commande `/ci-support` dans le bot qui redirige vers le serveur Discord :

```javascript
{
  name: 'ci-support',
  description: 'Obtenir de l\'aide et rejoindre le serveur de support',
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setTitle('🎮 Support Discord')
      .setDescription('Rejoignez notre serveur Discord pour obtenir de l\'aide !')
      .addFields(
        {
          name: '🔗 Lien d\'invitation',
          value: '[Cliquez ici pour rejoindre](https://discord.gg/community-intelligence)',
          inline: false,
        },
        {
          name: '📋 Canaux disponibles',
          value: [
            '`#❓-support` - Support général',
            '`#🐛-bug-reports` - Signalement de bugs',
            '`#💡-suggestions` - Suggestions',
            '`#🎫-créer-un-ticket` - Créer un ticket privé',
          ].join('\n'),
          inline: false,
        }
      )
      .setColor(0x5865F2)
      .setFooter({ text: 'Community Intelligence Bot' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
}
```

## ✅ Checklist de Configuration

- [ ] Serveur Discord créé
- [ ] Canaux configurés (bienvenue, support, bugs, suggestions, tickets)
- [ ] Rôles créés (Support Team, Modérateur)
- [ ] Permissions configurées
- [ ] Message de bienvenue rédigé
- [ ] Lien d'invitation permanent créé
- [ ] Lien ajouté dans le code (ou variable d'environnement configurée)
- [ ] Bot de tickets configuré (optionnel mais recommandé)
- [ ] FAQ créée (optionnel)
- [ ] Équipe de support formée

## 🆘 Dépannage

### Le lien ne fonctionne pas

- Vérifiez que l'invitation est **permanente** (durée : Jamais)
- Vérifiez que l'invitation n'a pas été révoquée
- Vérifiez les permissions de l'invitation

### Les utilisateurs ne peuvent pas voir les canaux

- Vérifiez les permissions du rôle @everyone
- Vérifiez que les canaux sont visibles pour tous
- Vérifiez que les utilisateurs ont accepté les règles (si activé)

### Les tickets ne se créent pas automatiquement

- Vérifiez que le bot de tickets est bien invité
- Vérifiez les permissions du bot
- Vérifiez la configuration du bot

---

**Dernière mise à jour** : {new Date().toLocaleDateString('fr-FR')}

