'use client'

import Link from 'next/link'
import { FileText, ArrowLeft, AlertCircle } from 'lucide-react'

export default function TermsPage() {
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
          <FileText className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Conditions d'Utilisation</h1>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 space-y-8">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-gray-300">
              <strong className="text-white">Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Acceptation des Conditions</h2>
            <p className="text-gray-300 leading-relaxed">
              En utilisant Community Intelligence Bot ("le Service"), vous acceptez d'être lié par ces Conditions d'Utilisation. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Description du Service</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Community Intelligence Bot est un service d'analyse et de statistiques pour les communautés Discord. 
                Le Service collecte et analyse les messages Discord pour fournir des insights, statistiques, et fonctionnalités 
                de gamification aux administrateurs de serveurs Discord.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. Éligibilité</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                Pour utiliser le Service, vous devez :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Être âgé d'au moins 13 ans (ou l'âge minimum requis dans votre juridiction)</li>
                <li>Avoir l'autorité pour inviter des bots sur le serveur Discord concerné</li>
                <li>Respecter les Conditions d'Utilisation de Discord</li>
                <li>Respecter toutes les lois et réglementations applicables</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Utilisation du Service</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">4.1. Utilisation Autorisée</h3>
                <p className="text-gray-300 text-sm mb-2">Vous vous engagez à utiliser le Service uniquement pour :</p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Analyser l'activité de votre communauté Discord</li>
                  <li>Générer des statistiques et insights légitimes</li>
                  <li>Améliorer l'engagement de votre communauté</li>
                </ul>
              </div>

              <div className="bg-red-600/20 border border-red-500 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  4.2. Utilisation Interdite
                </h3>
                <p className="text-gray-300 text-sm mb-2">Il est strictement interdit de :</p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Utiliser le Service pour harceler, intimider ou nuire à autrui</li>
                  <li>Collecter des données sans le consentement des utilisateurs</li>
                  <li>Violer les droits de propriété intellectuelle</li>
                  <li>Utiliser le Service à des fins illégales ou frauduleuses</li>
                  <li>Tenter de contourner les limitations techniques du Service</li>
                  <li>Utiliser le Service pour spammer ou envoyer des messages non sollicités</li>
                  <li>Partager vos identifiants d'accès avec des tiers</li>
                  <li>Utiliser le Service pour violer les Conditions d'Utilisation de Discord</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">5. Données et Confidentialité</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                Le traitement de vos données personnelles est régi par notre <Link href="/privacy" className="text-blue-400 hover:underline">Politique de Confidentialité</Link>, 
                qui fait partie intégrante de ces Conditions d'Utilisation.
              </p>
              <p className="text-gray-300 leading-relaxed">
                En utilisant le Service, vous reconnaissez que :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3 ml-4">
                <li>Nous collectons et traitons les messages Discord conformément à notre Politique de Confidentialité</li>
                <li>Vous êtes responsable d'obtenir le consentement des membres de votre serveur pour la collecte de leurs données</li>
                <li>Vous devez informer les membres de votre serveur de l'utilisation du bot et de la collecte de données</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">6. Abonnements et Paiements</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">6.1. Plans d'Abonnement</h3>
                <p className="text-gray-300 text-sm">
                  Le Service propose différents plans d'abonnement (Gratuit, Pro, Business, Enterprise). 
                  Les fonctionnalités et limites de chaque plan sont décrites sur la page de tarification.
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">6.2. Paiements</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Les paiements sont traités par Stripe, un processeur de paiement tiers sécurisé</li>
                  <li>Les abonnements sont facturés mensuellement à l'avance</li>
                  <li>Tous les prix sont en euros (€) et incluent la TVA si applicable</li>
                  <li>Les paiements sont non remboursables sauf obligation légale ou accord écrit</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">6.3. Renouvellement et Résiliation</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Les abonnements se renouvellent automatiquement chaque mois</li>
                  <li>Vous pouvez annuler votre abonnement à tout moment via le portail de facturation Stripe</li>
                  <li>L'annulation prend effet à la fin de la période de facturation en cours</li>
                  <li>Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation de ces Conditions</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">7. Propriété Intellectuelle</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                Le Service, y compris son code source, design, logos, et contenu, est protégé par les lois sur la propriété intellectuelle. 
                Tous les droits sont réservés.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Vous conservez tous les droits sur vos données et contenus. En utilisant le Service, vous nous accordez une licence 
                non exclusive pour utiliser vos données uniquement dans le cadre de la fourniture du Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">8. Disponibilité du Service</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Nous nous efforçons d'assurer une disponibilité maximale du Service, mais nous ne garantissons pas une disponibilité 
                ininterrompue. Le Service peut être temporairement indisponible pour maintenance, mises à jour, ou pour des raisons 
                indépendantes de notre volonté (pannes réseau, etc.).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">9. Limitation de Responsabilité</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                Dans les limites autorisées par la loi :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Le Service est fourni "en l'état" sans garantie d'aucune sorte</li>
                <li>Nous ne garantissons pas l'exactitude, la complétude ou l'utilité des données fournies</li>
                <li>Nous ne serons pas responsables des dommages indirects, consécutifs ou accessoires</li>
                <li>Notre responsabilité totale est limitée au montant payé pour le Service au cours des 12 derniers mois</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">10. Indemnisation</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Vous acceptez d'indemniser et de dégager de toute responsabilité Community Intelligence Bot, ses dirigeants, employés 
                et partenaires de toute réclamation, perte, responsabilité et dépense (y compris les frais d'avocat) résultant de votre 
                utilisation du Service ou de votre violation de ces Conditions d'Utilisation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">11. Modification du Service</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Nous nous réservons le droit de modifier, suspendre ou interrompre le Service à tout moment, avec ou sans préavis. 
                Nous ne serons pas responsables envers vous ou tout tiers de ces modifications.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">12. Modification des Conditions</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Nous pouvons modifier ces Conditions d'Utilisation à tout moment. Les modifications importantes vous seront notifiées 
                par email ou via une notification dans le Service. Votre utilisation continue du Service après ces modifications 
                constitue votre acceptation des nouvelles conditions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">13. Résiliation</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                Nous nous réservons le droit de suspendre ou résilier votre accès au Service à tout moment, avec ou sans préavis, 
                pour toute raison, notamment en cas de :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Violation de ces Conditions d'Utilisation</li>
                <li>Utilisation frauduleuse ou abusive du Service</li>
                <li>Non-paiement des frais d'abonnement</li>
                <li>Demande des autorités compétentes</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">14. Droit Applicable et Juridiction</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Ces Conditions d'Utilisation sont régies par le droit français. Tout litige relatif à ces Conditions sera soumis 
                à la compétence exclusive des tribunaux français.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">15. Dispositions Générales</h2>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <p className="text-gray-300 leading-relaxed">
                Si une disposition de ces Conditions est jugée invalide ou inapplicable, les autres dispositions restent en vigueur. 
                Notre incapacité à faire valoir un droit ne constitue pas une renonciation à ce droit.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Ces Conditions constituent l'accord complet entre vous et nous concernant l'utilisation du Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">16. Contact</h2>
            <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Pour toute question concernant ces Conditions d'Utilisation, contactez-nous :
              </p>
              <p className="text-white font-semibold mt-3">
                Email : support@community-intelligence.com
              </p>
            </div>
          </section>

          <div className="border-t border-gray-700 pt-8 mt-8">
            <p className="text-gray-400 text-sm text-center">
              En utilisant Community Intelligence Bot, vous reconnaissez avoir lu, compris et accepté ces Conditions d'Utilisation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

