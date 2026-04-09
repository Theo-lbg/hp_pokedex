<template>
  <div class="duel-container">
    <h2>{{ $t('duel.title') }}</h2>

    <div class="duel-arena">
      <!-- Fighter 1 -->
      <div class="fighter-section">
        <h3>{{ $t('duel.fighter1') }}</h3>
        <div v-if="fighter1" class="fighter-card selected">
          <img :src="fighter1.image" :alt="fighter1.name" />
          <p>{{ fighter1.name }}</p>
          <button @click="clearFighter1" class="clear-btn">✕</button>
        </div>
        <p v-else class="placeholder">{{ $t('duel.waiting') }}</p>
      </div>

      <!-- VS Button -->
      <div class="vs-section">
        <button
          v-if="fighter1 && fighter2"
          @click="battle"
          class="fight-btn"
          :disabled="battleInProgress"
        >
          {{ $t('duel.fight') }}
        </button>
        <span v-else class="vs-text">{{ $t('duel.vs') }}</span>
      </div>

      <!-- Fighter 2 -->
      <div class="fighter-section">
        <h3>{{ $t('duel.fighter2') }}</h3>
        <div v-if="fighter2" class="fighter-card selected">
          <img :src="fighter2.image" :alt="fighter2.name" />
          <p>{{ fighter2.name }}</p>
          <button @click="clearFighter2" class="clear-btn">✕</button>
        </div>
        <p v-else class="placeholder">{{ $t('duel.waiting') }}</p>
      </div>
    </div>

    <!-- Résultats -->
    <div v-if="winner" class="battle-result">
      <h3>{{ $t('duel.winner') }}</h3>
      <div class="winner-card gold">
        <img :src="winner.image" :alt="winner.name" />
        <p class="winner-name">{{ winner.name }}</p>
      </div>
      <p class="stats">{{ $t('duel.stats') }} - {{ $t('duel.duels') }}: {{ wizardStore.duelStats.totalDuels }} ({{ $t('duel.victories') }}: {{ wizardStore.duelStats.wins }})</p>
      <button @click="resetDuel" class="reset-btn">{{ $t('duel.newDuel') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../store'
import type { Character } from '../types'

const { t: $t } = useI18n()

// ========== EMITS ==========
const emit = defineEmits<{
  selectFighter1: [character: Character]
  selectFighter2: [character: Character]
}>()

// ========== STATE ==========
const wizardStore = useWizardStore()
const battleInProgress = ref(false)

// ========== COMPUTED ==========

// Récupérer les combattants depuis le store
const fighter1 = computed(() => wizardStore.fighter1)
const fighter2 = computed(() => wizardStore.fighter2)
const winner = computed(() => wizardStore.battleWinner)

// ========== FONCTIONS ==========

// Sélectionner un combattant (slot 1 ou 2)
const selectFighter = (character: Character, slot: 1 | 2) => {
  if (slot === 1) {
    wizardStore.setFighter1(character)
    emit('selectFighter1', character)
  } else {
    wizardStore.setFighter2(character)
    emit('selectFighter2', character)
  }
}

// Retirer le combattant 1
const clearFighter1 = () => {
  wizardStore.setFighter1(null)
}

// Retirer le combattant 2
const clearFighter2 = () => {
  wizardStore.setFighter2(null)
}

// Lancer un duel (avec petit délai pour l'animation)
const battle = async () => {
  battleInProgress.value = true
  // Attendre 500ms avant d'afficher le résultat
  await new Promise(resolve => setTimeout(resolve, 500))
  wizardStore.battle()
  battleInProgress.value = false
}

// Réinitialiser le duel pour en lancer un nouveau
const resetDuel = () => {
  wizardStore.resetBattle()
}

defineExpose({
  selectFighter,
})
</script>

<style scoped>
.duel-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #d4af37;
  border-radius: 8px;
  padding: 30px;
  margin: 30px 0;
  color: #fff;
}

.duel-container h2 {
  text-align: center;
  color: #d4af37;
  margin-bottom: 30px;
  font-size: 28px;
}

.duel-arena {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
}

.fighter-section {
  text-align: center;
}

.fighter-section h3 {
  color: #d4af37;
  margin-bottom: 15px;
}

.fighter-card {
  position: relative;
  border: 2px solid #d4af37;
  border-radius: 8px;
  overflow: hidden;
  background: #0f3460;
  transition: all 0.3s;
}

.fighter-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.fighter-card p {
  padding: 10px;
  margin: 0;
  color: #d4af37;
  font-weight: bold;
}

.fighter-card.selected {
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
}

.clear-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(212, 175, 55, 0.8);
  color: #1a1a2e;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #d4af37;
  transform: scale(1.1);
}

.placeholder {
  padding: 40px 20px;
  color: #888;
  font-style: italic;
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.vs-text {
  font-size: 24px;
  color: #d4af37;
  font-weight: bold;
}

.fight-btn {
  padding: 15px 30px;
  background: linear-gradient(135deg, #d4af37 0%, #f0c860 100%);
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.fight-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
}

.fight-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.battle-result {
  text-align: center;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid #d4af37;
  border-radius: 8px;
  padding: 20px;
}

.battle-result h3 {
  color: #d4af37;
  font-size: 24px;
  margin-bottom: 20px;
}

.winner-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px auto;
  width: fit-content;
}

.winner-card.gold {
  border: 3px solid #d4af37;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.8), inset 0 0 20px rgba(212, 175, 55, 0.3);
}

.winner-card img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  display: block;
}

.winner-name {
  padding: 15px;
  margin: 0;
  color: #d4af37;
  font-size: 20px;
  font-weight: bold;
  background: #1a1a2e;
}

.stats {
  margin: 20px 0;
  color: #d4af37;
  font-size: 14px;
}

.reset-btn {
  padding: 10px 25px;
  background: #d4af37;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #f0c860;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .duel-arena {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .vs-section {
    transform: rotate(90deg);
  }
}
</style>
