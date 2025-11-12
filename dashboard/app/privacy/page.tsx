'use client'

import Link from 'next/link'
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          href="/landing" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Politique de Confidentialité</h1>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 space-y-8">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-gray-300">
              <strong className="text-white">Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Community Intelligence Bot ("nous", "notre", "le service") s'engage à protéger votre vie privée et vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données conformément au 
              Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne.
            </p>
            <p className="text-gray-300 leading-relaxed">
              En utilisant notre service, vous acceptez les pratiques décrites dans cette politique. Si vous n'acceptez pas cette politique, 
              veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Responsable du Traitement</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300">
                <strong className="text-white">Responsable du traitement :</strong><br />
                Community Intelligence Bot<br />
                Email : support@community-intelligence.com<br />
                <br />
                Pour toute question concernant vos données personnelles, vous pouvez nous contacter à l'adresse ci-dessus.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. Données Collectées</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nous collectons uniquement les données nécessaires au fonctionnement du service :
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">3.1. Données Discord</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li><strong>ID utilisateur Discord</strong> : Identifiant unique de votre compte Discord</li>
                  <li><strong>Nom d'utilisateur Discord</strong> : Nom d'affichage sur Discord</li>
                  <li><strong>ID serveur (Guild ID)</strong> : Identifiant des serveurs Discord où le bot est actif</li>
                  <li><strong>ID de canal</strong> : Identifiants des canaux où les messages sont collectés</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">3.2. Données de Messages</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li><strong>Contenu des messages</strong> : Texte des messages envoyés dans les canaux Discord</li>
                  <li><strong>Date et heure</strong> : Horodatage de chaque message</li>
                  <li><strong>Métadonnées</strong> : Nombre de réactions, mentions, etc.</li>
                </ul>
                <p className="text-gray-400 text-sm mt-2">
                  ⚠️ <strong>Important :</strong> Nous collectons uniquement les messages des canaux où le bot a été explicitement invité et autorisé.
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">3.3. Données d'Analytics</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li><strong>Statistiques d'activité</strong> : Nombre de messages, membres actifs, canaux populaires</li>
                  <li><strong>Données de gamification</strong> : Points d'expérience (XP), niveaux, badges (si activé)</li>
                  <li><strong>Données vocales</strong> : Temps passé en vocal, canaux vocaux utilisés (si activé)</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">3.4. Données de Paiement</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li><strong>Informations d'abonnement</strong> : Plan souscrit, date d'expiration</li>
                  <li><strong>ID client Stripe</strong> : Identifiant pour la gestion des paiements</li>
                </ul>
                <p className="text-gray-400 text-sm mt-2">
                  ⚠️ <strong>Important :</strong> Aucune donnée bancaire n'est stockée par notre service. Les paiements sont gérés par Stripe (PCI-DSS niveau 1).
                </p>
              </div>

              <div className="bg-yellow-900/30 border-2 border-yellow-600/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">3.5. ⚠️ Utilisation de l'IA Générative (Consentement Requis)</h3>
                <p className="text-yellow-200 text-sm mb-3">
                  <strong>IMPORTANT :</strong> Les fonctionnalités d'IA générative nécessitent votre consentement explicite car vos données sont envoyées à des services tiers pour traitement.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>Services IA utilisés :</strong> Groq, OpenAI, ou Anthropic Claude (selon configuration)</li>
                  <li><strong>Données envoyées :</strong>
                    <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                      <li>Contenu des messages de votre serveur Discord</li>
                      <li>Métadonnées (auteur, date, canal)</li>
                      <li>Statistiques agrégées</li>
                    </ul>
                  </li>
                  <li><strong>Utilisation :</strong>
                    <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                      <li>Génération de résumés intelligents</li>
                      <li>Analyse de sentiment</li>
                      <li>Recommandations d'engagement</li>
                      <li>Prédictions et alertes</li>
                      <li>Génération de quêtes personnalisées</li>
                    </ul>
                  </li>
                  <li><strong>Conservation :</strong> Les données ne sont PAS stockées par le service IA après traitement</li>
                  <li><strong>Consentement :</strong> Vous devez donner votre consentement explicite avec la commande <code className="bg-gray-800 px-1 rounded">/ci-ai-consent give</code></li>
                  <li><strong>Révocation :</strong> Vous pouvez retirer votre consentement à tout moment avec <code className="bg-gray-800 px-1 rounded">/ci-ai-consent revoke</code></li>
                </ul>
                <p className="text-yellow-200 text-sm mt-3">
                  🔒 <strong>Conformité RGPD :</strong> Cette utilisation est conforme au RGPD car elle nécessite un consentement explicite et peut être retirée à tout moment.
                </p>
              </div>
                <p className="text-gray-400 text-sm mt-2">
                  💳 <strong>Note :</strong> Les données de paiement (carte bancaire, etc.) sont gérées exclusivement par Stripe et ne sont jamais stockées sur nos serveurs.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Finalités du Traitement</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nous utilisons vos données uniquement pour les finalités suivantes :
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <CheckCircle2 className="w-5 h-5 text-green-400 mb-2" />
                <h3 className="font-semibold text-white mb-2">Fonctionnement du Service</h3>
                <p className="text-gray-300 text-sm">
                  Collecte et analyse des messages pour générer des statistiques et insights sur votre communauté Discord.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <CheckCircle2 className="w-5 h-5 text-green-400 mb-2" />
                <h3 className="font-semibold text-white mb-2">Gamification</h3>
                <p className="text-gray-300 text-sm">
                  Attribution de points d'expérience, niveaux et badges pour encourager l'engagement (si activé).
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <CheckCircle2 className="w-5 h-5 text-green-400 mb-2" />
                <h3 className="font-semibold text-white mb-2">Facturation</h3>
                <p className="text-gray-300 text-sm">
                  Gestion des abonnements premium et traitement des paiements via Stripe.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <CheckCircle2 className="w-5 h-5 text-green-400 mb-2" />
                <h3 className="font-semibold text-white mb-2">Amélioration du Service</h3>
                <p className="text-gray-300 text-sm">
                  Analyse anonymisée des données pour améliorer les fonctionnalités et détecter les bugs.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">5. Base Légale du Traitement</h2>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-1">Consentement (Art. 6(1)(a) RGPD)</h3>
                <p className="text-gray-300 text-sm">
                  En invitant le bot sur votre serveur Discord, vous consentez à la collecte et au traitement de vos données pour les finalités décrites ci-dessus.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Exécution d'un Contrat (Art. 6(1)(b) RGPD)</h3>
                <p className="text-gray-300 text-sm">
                  Le traitement est nécessaire à l'exécution du service que vous avez demandé (analyse de votre communauté Discord).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Intérêt Légitime (Art. 6(1)(f) RGPD)</h3>
                <p className="text-gray-300 text-sm">
                  L'amélioration du service et la prévention de la fraude constituent des intérêts légitimes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">6. Conservation des Données</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <ul className="space-y-2 text-gray-300">
                <li>
                  <strong className="text-white">Messages Discord :</strong> Conservés tant que le bot est actif sur le serveur. 
                  Suppression automatique dans les 30 jours suivant le retrait du bot.
                </li>
                <li>
                  <strong className="text-white">Données d'analytics :</strong> Conservées pendant 2 ans maximum pour les statistiques historiques.
                </li>
                <li>
                  <strong className="text-white">Données de paiement :</strong> Conservées pendant la durée de l'abonnement + 3 ans (obligation légale comptable).
                </li>
                <li>
                  <strong className="text-white">Données de compte :</strong> Conservées tant que votre compte est actif. 
                  Suppression dans les 30 jours suivant la demande de suppression.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">7. Vos Droits RGPD</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">📋 Droit d'accès (Art. 15)</h3>
                <p className="text-gray-300 text-sm">
                  Vous pouvez demander une copie de toutes les données que nous détenons sur vous.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">✏️ Droit de rectification (Art. 16)</h3>
                <p className="text-gray-300 text-sm">
                  Vous pouvez demander la correction de données inexactes ou incomplètes.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">🗑️ Droit à l'effacement (Art. 17)</h3>
                <p className="text-gray-300 text-sm">
                  Vous pouvez demander la suppression de vos données personnelles ("droit à l'oubli").
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">⏸️ Droit à la limitation (Art. 18)</h3>
                <p className="text-gray-300 text-sm">
                  Vous pouvez demander la limitation du traitement de vos données dans certains cas.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">📦 Droit à la portabilité (Art. 20)</h3>
                <p className="text-gray-300 text-sm">
                  Vous pouvez demander à recevoir vos données dans un format structuré et couramment utilisé.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">🚫 Droit d'opposition (Art. 21)</h3>
                <p className="text-gray-300 text-sm">
                  Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes.
                </p>
              </div>
            </div>
            <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Pour exercer vos droits :</strong> Contactez-nous à support@community-intelligence.com avec votre demande. 
                Nous répondrons dans un délai maximum de 30 jours.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">8. Partage des Données</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-4">
                Nous ne vendons jamais vos données personnelles. Nous partageons vos données uniquement avec :
              </p>
              <ul className="space-y-3">
                <li>
                  <strong className="text-white">Supabase (Hébergement base de données) :</strong>
                  <p className="text-gray-300 text-sm mt-1">
                    Nos données sont hébergées sur Supabase (PostgreSQL). Supabase est conforme au RGPD et certifié SOC 2 Type II.
                  </p>
                </li>
                <li>
                  <strong className="text-white">Stripe (Paiements) :</strong>
                  <p className="text-gray-300 text-sm mt-1">
                    Les données de paiement sont gérées par Stripe, conforme PCI-DSS et RGPD. Nous ne stockons jamais vos informations de carte bancaire.
                  </p>
                </li>
                <li>
                  <strong className="text-white">Vercel (Hébergement dashboard) :</strong>
                  <p className="text-gray-300 text-sm mt-1">
                    Le dashboard web est hébergé sur Vercel, conforme au RGPD et certifié SOC 2 Type II.
                  </p>
                </li>
                <li>
                  <strong className="text-yellow-400">⚠️ Services d'IA Générative (Avec Consentement Explicite) :</strong>
                  <p className="text-gray-300 text-sm mt-1">
                    <strong>Groq, OpenAI, ou Anthropic Claude</strong> - Pour les fonctionnalités d'IA générative, vos données (contenu des messages, métadonnées) sont envoyées à ces services tiers pour traitement. 
                    Cette utilisation nécessite votre consentement explicite via la commande <code className="bg-gray-800 px-1 rounded">/ci-ai-consent give</code>.
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-sm mt-2 ml-4 space-y-1">
                    <li><strong>Groq :</strong> Service gratuit, conforme RGPD, données non stockées après traitement</li>
                    <li><strong>OpenAI :</strong> Service payant, conforme RGPD, données non utilisées pour l'entraînement des modèles</li>
                    <li><strong>Anthropic Claude :</strong> Service payant, conforme RGPD, données non stockées après traitement</li>
                  </ul>
                  <p className="text-yellow-200 text-sm mt-2">
                    🔒 <strong>Important :</strong> Vous pouvez retirer votre consentement à tout moment avec <code className="bg-gray-800 px-1 rounded">/ci-ai-consent revoke</code>. 
                    Aucune nouvelle donnée ne sera alors envoyée aux services IA.
                  </p>
                </li>
                <li>
                  <strong className="text-white">Render (Hébergement bot) :</strong>
                  <p className="text-gray-300 text-sm mt-1">
                    Le bot Discord est hébergé sur Render, conforme au RGPD.
                  </p>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">9. Sécurité des Données</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Chiffrement des données en transit (HTTPS/TLS)</li>
                <li>Chiffrement des données au repos dans la base de données</li>
                <li>Authentification sécurisée via OAuth2 Discord</li>
                <li>Accès restreint aux données (principe du moindre privilège)</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Surveillance et détection d'intrusions</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">10. Transferts Internationaux</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Vos données peuvent être transférées et stockées en dehors de l'Union Européenne (notamment aux États-Unis pour Supabase, Stripe, Vercel et Render). 
                Ces transferts sont encadrés par des garanties appropriées conformes au RGPD :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mt-3 ml-4">
                <li>Clauses contractuelles types de la Commission Européenne</li>
                <li>Certifications Privacy Shield (pour les entreprises américaines certifiées)</li>
                <li>Binding Corporate Rules (BCR) lorsque applicables</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">11. Cookies et Technologies Similaires</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Notre dashboard utilise des cookies de session pour l'authentification. Ces cookies sont strictement nécessaires au fonctionnement 
                du service et ne sont pas utilisés à des fins de tracking ou de publicité. Vous pouvez désactiver les cookies dans les paramètres 
                de votre navigateur, mais cela peut affecter le fonctionnement du dashboard.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">12. Modifications de cette Politique</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications importantes vous seront notifiées par email 
                ou via une notification dans le dashboard. La date de dernière mise à jour est indiquée en haut de cette page.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">13. Réclamations</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-4">
                Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d'introduire 
                une réclamation auprès de l'autorité de contrôle compétente :
              </p>
              <div className="bg-gray-600/50 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">CNIL (Commission Nationale de l'Informatique et des Libertés)</p>
                <p className="text-gray-300 text-sm">
                  3 Place de Fontenoy - TSA 80715<br />
                  75334 PARIS CEDEX 07<br />
                  Téléphone : 01 53 73 22 22<br />
                  Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.cnil.fr</a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">14. Contact</h2>
            <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles, contactez-nous :
              </p>
              <p className="text-white font-semibold mt-3">
                Email : support@community-intelligence.com
              </p>
            </div>
          </section>

          <div className="border-t border-gray-700 pt-8 mt-8">
            <p className="text-gray-400 text-sm text-center">
              Cette politique de confidentialité est conforme au Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

