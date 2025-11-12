'use client'

import Link from 'next/link'
import { ShoppingCart, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CGVPage() {
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
          <ShoppingCart className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Conditions Générales de Vente</h1>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 space-y-8">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-gray-300">
              <strong className="text-white">Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Informations Légales</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                <strong className="text-white">Vendeur :</strong><br />
                Community Intelligence Bot<br />
                Email : support@community-intelligence.com<br />
                <br />
                <strong className="text-white">Service :</strong> Abonnements premium pour bot Discord d'analyse de communauté<br />
                <br />
                <strong className="text-white">Hébergement :</strong> Render (bot), Vercel (dashboard)<br />
                <br />
                <strong className="text-white">Paiements :</strong> Traités par Stripe (processeur de paiement certifié PCI-DSS)
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Objet</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent la vente d'abonnements premium au service 
                Community Intelligence Bot. Elles s'appliquent à tous les achats effectués sur le site web ou via Discord, 
                sans restriction ni réserve. En passant commande, l'acheteur reconnaît avoir pris connaissance et accepté 
                les présentes CGV.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. Produits et Services</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">3.1. Plans d'Abonnement Disponibles</h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-green-500 pl-3">
                    <p className="text-white font-semibold">🆓 Plan Gratuit</p>
                    <p className="text-gray-300 text-sm">0€/mois - Fonctionnalités de base</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-3">
                    <p className="text-white font-semibold">💎 Plan Pro</p>
                    <p className="text-gray-300 text-sm">25€/mois - Fonctionnalités avancées</p>
                  </div>
                  <div className="border-l-2 border-purple-500 pl-3">
                    <p className="text-white font-semibold">🚀 Plan Business</p>
                    <p className="text-gray-300 text-sm">75€/mois - Fonctionnalités professionnelles</p>
                  </div>
                  <div className="border-l-2 border-yellow-500 pl-3">
                    <p className="text-white font-semibold">🏢 Plan Enterprise</p>
                    <p className="text-gray-300 text-sm">250€/mois - Sur devis personnalisé</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">3.2. Description des Services</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Chaque plan d'abonnement donne accès à un ensemble de fonctionnalités détaillées sur la page de tarification. 
                  Les fonctionnalités peuvent évoluer dans le temps, mais les fonctionnalités principales de chaque plan restent garanties.
                </p>
                <p className="text-gray-300 text-sm">
                  Les services incluent notamment : analyse de messages Discord, statistiques en temps réel, résumés IA, 
                  gamification, détection de spam, analytics vocales, et bien plus selon le plan choisi.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Prix</h2>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-2">4.1. Prix des Abonnements</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Les prix sont indiqués en euros (€) TTC (Toutes Taxes Comprises)</li>
                  <li>Les prix sont valables pour la durée indiquée au moment de la commande</li>
                  <li>Les prix peuvent être modifiés à tout moment, mais les modifications ne s'appliquent pas aux abonnements en cours</li>
                  <li>Les prix sont garantis pour la durée de l'abonnement souscrit</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">4.2. Facturation</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Les abonnements sont facturés mensuellement à l'avance</li>
                  <li>La première facturation intervient immédiatement après l'achat</li>
                  <li>Les renouvellements sont automatiques chaque mois</li>
                  <li>Les factures sont disponibles dans le portail de facturation Stripe</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">5. Commande et Paiement</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">5.1. Processus de Commande</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 ml-4 text-sm">
                  <li>Sélection du plan d'abonnement souhaité</li>
                  <li>Redirection vers la page de paiement sécurisée Stripe</li>
                  <li>Saisie des informations de paiement (carte bancaire)</li>
                  <li>Validation de la commande</li>
                  <li>Confirmation par email et activation immédiate du service</li>
                </ol>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">5.2. Moyens de Paiement</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Les paiements sont acceptés uniquement par carte bancaire via Stripe :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Cartes Visa, Mastercard, American Express</li>
                  <li>Paiements sécurisés par chiffrement SSL/TLS</li>
                  <li>Aucune donnée bancaire n'est stockée sur nos serveurs</li>
                  <li>Tous les paiements sont traités par Stripe (certifié PCI-DSS niveau 1)</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">5.3. Sécurité des Paiements</h3>
                <p className="text-gray-300 text-sm">
                  Tous les paiements sont sécurisés et cryptés. Nous ne stockons jamais vos informations de carte bancaire. 
                  Stripe est certifié PCI-DSS niveau 1, le plus haut niveau de certification dans l'industrie des paiements.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">6. Droit de Rétractation</h2>
            <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                <strong className="text-white">Conformément à l'article L221-18 du Code de la Consommation :</strong>
              </p>
              <p className="text-gray-300 leading-relaxed mb-3">
                Vous disposez d'un délai de <strong className="text-white">14 jours calendaires</strong> à compter de la souscription 
                de l'abonnement pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalité.
              </p>
              <div className="bg-gray-700/50 rounded-lg p-3 mt-3">
                <p className="text-gray-300 text-sm mb-2">
                  <strong className="text-white">Exception :</strong> Conformément à l'article L221-28 du Code de la Consommation, 
                  le droit de rétractation ne peut être exercé pour :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Les prestations de services pleinement exécutées avant la fin du délai de rétractation et dont l'exécution a commencé avec votre accord exprès</li>
                  <li>Les services numériques non fournis sur support matériel dont l'exécution a commencé avec votre accord exprès</li>
                </ul>
                <p className="text-gray-300 text-sm mt-2">
                  <strong className="text-white">Important :</strong> Si vous avez commencé à utiliser le service premium pendant 
                  le délai de rétractation, vous pouvez toujours exercer votre droit de rétractation, mais vous devrez payer 
                  une somme proportionnelle au service déjà fourni.
                </p>
              </div>
              <div className="mt-3">
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">Pour exercer votre droit de rétractation :</strong><br />
                  Contactez-nous à support@community-intelligence.com avec votre numéro de commande ou ID de serveur Discord.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">7. Remboursements</h2>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-2">7.1. Conditions de Remboursement</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 text-sm">
                  <li>
                    <strong>Rétractation dans les 14 jours :</strong> Remboursement intégral si le service n'a pas été utilisé, 
                    ou remboursement proportionnel si le service a été partiellement utilisé
                  </li>
                  <li>
                    <strong>Défaut de service :</strong> Remboursement intégral en cas d'impossibilité totale d'utiliser le service 
                    due à une faute de notre part
                  </li>
                  <li>
                    <strong>Résiliation par le client :</strong> Aucun remboursement pour la période en cours, 
                    l'abonnement prend fin à la fin de la période facturée
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">7.2. Modalités de Remboursement</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                  <li>Les remboursements sont effectués sur le même moyen de paiement utilisé pour l'achat</li>
                  <li>Délai de remboursement : 14 jours ouvrés maximum</li>
                  <li>Les remboursements sont traités via Stripe</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">8. Durée et Renouvellement</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Les abonnements sont conclus pour une durée d'un mois, renouvelable automatiquement par tacite reconduction</li>
                <li>Chaque période d'abonnement commence à la date de souscription et se termine le même jour du mois suivant</li>
                <li>Le renouvellement est automatique sauf résiliation de votre part</li>
                <li>Vous pouvez résilier votre abonnement à tout moment via le portail de facturation Stripe</li>
                <li>La résiliation prend effet à la fin de la période en cours (pas de remboursement pour la période en cours)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">9. Disponibilité du Service</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                Nous nous efforçons d'assurer une disponibilité maximale du service, mais nous ne garantissons pas une disponibilité 
                ininterrompue à 100%. Le service peut être temporairement indisponible pour :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Maintenance programmée (notifiée à l'avance lorsque possible)</li>
                <li>Maintenance d'urgence</li>
                <li>Pannes techniques indépendantes de notre volonté</li>
                <li>Problèmes de connectivité réseau</li>
              </ul>
              <p className="text-gray-300 text-sm mt-3">
                <strong className="text-white">Objectif de disponibilité :</strong> 99% (hors maintenance programmée)
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">10. Garanties</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">10.1. Garantie de Conformité</h3>
                <p className="text-gray-300 text-sm">
                  Le service est conforme à la description fournie sur le site. En cas de non-conformité, vous disposez d'un 
                  droit de remboursement conformément à la législation en vigueur.
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">10.2. Limitation de Garantie</h3>
                <p className="text-gray-300 text-sm">
                  Le service est fourni "en l'état". Nous ne garantissons pas que le service répondra à tous vos besoins spécifiques 
                  ou qu'il sera exempt d'erreurs. Nous ne garantissons pas non plus les résultats obtenus grâce à l'utilisation du service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">11. Responsabilité</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                Notre responsabilité est limitée dans les cas suivants :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>
                  <strong>Dommages indirects :</strong> Nous ne serons pas responsables des dommages indirects, pertes de profits, 
                  perte de données, ou tout autre dommage indirect résultant de l'utilisation ou de l'impossibilité d'utiliser le service
                </li>
                <li>
                  <strong>Limitation financière :</strong> Notre responsabilité totale est limitée au montant payé pour le service 
                  au cours des 12 derniers mois
                </li>
                <li>
                  <strong>Force majeure :</strong> Nous ne serons pas responsables en cas de force majeure ou d'événements indépendants 
                  de notre volonté
                </li>
                <li>
                  <strong>Utilisation abusive :</strong> Nous ne serons pas responsables des dommages résultant d'une utilisation abusive 
                  ou non conforme du service
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">12. Propriété Intellectuelle</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Tous les éléments du service (code, design, logos, marques, contenus) sont la propriété exclusive de Community Intelligence Bot 
                ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">13. Protection des Données</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Le traitement de vos données personnelles est régi par notre{' '}
                <Link href="/privacy" className="text-blue-400 hover:underline">
                  Politique de Confidentialité
                </Link>, 
                qui fait partie intégrante des présentes CGV. Conformément au RGPD, vous disposez de droits sur vos données personnelles.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">14. Résiliation</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">14.1. Résiliation par le Client</h3>
                <p className="text-gray-300 text-sm">
                  Vous pouvez résilier votre abonnement à tout moment via le portail de facturation Stripe. 
                  La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement ne sera effectué 
                  pour la période en cours.
                </p>
              </div>

              <div className="bg-red-600/20 border border-red-500 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  14.2. Résiliation par le Vendeur
                </h3>
                <p className="text-gray-300 text-sm">
                  Nous nous réservons le droit de résilier votre abonnement immédiatement en cas de :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 mt-2 text-sm">
                  <li>Non-paiement des frais d'abonnement</li>
                  <li>Violation des Conditions d'Utilisation</li>
                  <li>Utilisation frauduleuse ou abusive du service</li>
                  <li>Demande des autorités compétentes</li>
                </ul>
                <p className="text-gray-300 text-sm mt-2">
                  En cas de résiliation pour faute, aucun remboursement ne sera effectué.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">15. Médiation et Litiges</h2>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-2">15.1. Médiation</h3>
                <p className="text-gray-300 text-sm">
                  Conformément aux articles L.611-1 et R.612-1 et suivants du Code de la Consommation, nous adhérons au service 
                  du médiateur de la consommation suivant :
                </p>
                <div className="bg-gray-600/50 rounded-lg p-3 mt-2">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Médiateur de la consommation</strong><br />
                    Centre de la Médiation de la Consommation de Conciliateurs de Justice (CM2C)<br />
                    Email : contact@cm2c.net<br />
                    Site web : <a href="https://www.cm2c.net" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.cm2c.net</a>
                  </p>
                </div>
                <p className="text-gray-300 text-sm mt-2">
                  Avant de saisir le médiateur, vous devez avoir préalablement tenté de résoudre le litige directement avec nous 
                  par écrit à support@community-intelligence.com.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">15.2. Litiges</h3>
                <p className="text-gray-300 text-sm">
                  À défaut de résolution amiable, tout litige relatif aux présentes CGV sera soumis aux tribunaux compétents 
                  conformément aux règles de droit commun. Les présentes CGV sont régies par le droit français.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">16. Modifications des CGV</h2>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                Nous nous réservons le droit de modifier les présentes CGV à tout moment. Les modifications s'appliquent aux nouvelles 
                commandes. Pour les abonnements en cours, les CGV en vigueur au moment de la souscription restent applicables, 
                sauf si les modifications sont plus favorables au client.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">17. Dispositions Générales</h2>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <p className="text-gray-300 leading-relaxed">
                Si une disposition des présentes CGV est jugée invalide ou inapplicable, les autres dispositions restent en vigueur. 
                L'invalidité d'une clause n'affecte pas la validité de l'ensemble des CGV.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Les présentes CGV sont complétées par les{' '}
                <Link href="/terms" className="text-blue-400 hover:underline">
                  Conditions d'Utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/privacy" className="text-blue-400 hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">18. Contact</h2>
            <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-3">
                Pour toute question concernant les présentes CGV ou pour exercer vos droits, contactez-nous :
              </p>
              <p className="text-white font-semibold">
                Email : support@community-intelligence.com
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Nous nous engageons à répondre à toutes vos demandes dans un délai de 48 heures ouvrées.
              </p>
            </div>
          </section>

          <div className="border-t border-gray-700 pt-8 mt-8">
            <p className="text-gray-400 text-sm text-center">
              Les présentes Conditions Générales de Vente sont conformes à la législation française en vigueur 
              (Code de la Consommation, Code de Commerce).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

