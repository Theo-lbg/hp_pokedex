import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { ref, computed } from 'vue'
import type { Character } from '../types/types'

export const useWizardStore = defineStore('wizard', () => {
  // ========== STATE ==========

  // Favoris avec sauvegarde locale
  const favorites = useLocalStorage<string[]>('hp_favorites', [])

  // Statistiques des duels (sauvegardées)
  const duelStats = useLocalStorage('hp_duelStats', {
    wins: 0,
    losses: 0,
    totalDuels: 0,
  })

  // Combattants actuels (non persistants)
  const fighter1 = ref<Character | null>(null)
  const fighter2 = ref<Character | null>(null)
  const battleWinner = ref<Character | null>(null)

  // ========== ACTIONS - FAVORIS ==========

  // Ajouter ou retirer un personnage des favoris
  const toggleFavorite = (character: Character) => {
    const isFav = favorites.value.includes(character.id)

    if (isFav) {
      // Retirer des favoris
      favorites.value = favorites.value.filter(id => id !== character.id)
    } else {
      // Ajouter aux favoris
      favorites.value.push(character.id)
    }
  }

  // Vérifier si un personnage est favori
  const isFavorite = (characterId: string): boolean => {
    return favorites.value.includes(characterId)
  }

  // ========== ACTIONS - COMBAT ==========

  // Sélectionner le combattant 1
  const setFighter1 = (character: Character | null) => {
    fighter1.value = character
  }

  // Sélectionner le combattant 2
  const setFighter2 = (character: Character | null) => {
    fighter2.value = character
  }

  // Lancer un duel
  const battle = () => {
    if (!fighter1.value || !fighter2.value) return null

    const fighter1Score = fighter1.value.name.length
    const fighter2Score = fighter2.value.name.length

    // Déterminer le vainqueur
    if (fighter1Score > fighter2Score) {
      battleWinner.value = fighter1.value
      duelStats.value.wins++
    } else if (fighter2Score > fighter1Score) {
      battleWinner.value = fighter2.value
      duelStats.value.losses++
    } else {
      // En cas d'égalité : au hasard
      const isRandomWinner1 = Math.random() > 0.5
      battleWinner.value = isRandomWinner1 ? fighter1.value : fighter2.value

      if (isRandomWinner1) {
        duelStats.value.wins++
      } else {
        duelStats.value.losses++
      }
    }

    duelStats.value.totalDuels++
    return battleWinner.value
  }

  // Réinitialiser le duel
  const resetBattle = () => {
    fighter1.value = null
    fighter2.value = null
    battleWinner.value = null
  }

  // ========== COMPUTED ==========

  const favoritesCount = computed(() => favorites.value.length)

  return {
    // State
    favorites,
    duelStats,
    fighter1,
    fighter2,
    battleWinner,

    // Actions
    toggleFavorite,
    isFavorite,
    setFighter1,
    setFighter2,
    battle,
    resetBattle,

    // Computed
    favoritesCount,
  }
})
