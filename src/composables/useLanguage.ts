import { computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'

/**
 * Composable pour gérer la langue de l'application
 * Sauvegarde la langue choisie dans le localStorage
 */
export function useLanguage() {
  // ========== I18N ==========
  const { locale } = useI18n()

  // ========== STORAGE ==========
  // Récupérer la langue sauvegardée (ou 'fr' par défaut)
  const savedLocale = useLocalStorage('hp_locale', 'fr')

  // ========== INITIALIZATION ==========
  // Au démarrage : restaurer la langue sauvegardée
  locale.value = (savedLocale.value as any) || 'fr'

  // ========== FONCTIONS ==========

  // Basculer entre FR et EN
  const toggleLanguage = () => {
    const newLocale = locale.value === 'fr' ? 'en' : 'fr'
    locale.value = newLocale
    savedLocale.value = newLocale
  }

  // ========== COMPUTED ==========

  // La langue actuelle
  const currentLanguage = computed(() => locale.value)

  // Est-ce l'anglais ?
  const isEnglish = computed(() => locale.value === 'en')

  // Est-ce le français ?
  const isFrench = computed(() => locale.value === 'fr')

  // ========== LIFECYCLE ==========

  // Au démontage du composant : faire du nettoyage
  onBeforeUnmount(() => {
    console.log(`App fermée, langue finalisée: ${locale.value}`)
  })

  // ========== RETOUR ==========

  return {
    locale,                  // La langue actuelle (réactive)
    currentLanguage,         // La langue actuelle (computed)
    toggleLanguage,          // Fonction pour changer de langue
    isEnglish,              // Booléen si c'est l'anglais
    isFrench,               // Booléen si c'est le français
  }
}

