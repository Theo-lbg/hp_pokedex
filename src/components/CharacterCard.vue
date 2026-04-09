<template>
  <div class="card" @click="goToDetail">
    <div class="card-image">
      <img
        v-if="character.image"
        :src="character.image"
        :alt="character.name"
      />
      <div v-else class="placeholder-image">
        🧙‍♂️
      </div>
      <button class="favorite-btn" @click.stop="toggleFav" :class="{ active: isFav }">
        ❤️
      </button>
    </div>
    <div class="card-body">
      <h3>{{ character.name }}</h3>
      <p><strong>{{ translate('detail.house') }}:</strong> {{ getHouseName(character.house) || translate('detail.unknown') }}</p>
      <p v-if="character.hogwartsStudent || character.hogwartsStaff">
        <strong>{{ translate('detail.role') }}:</strong>
        <span>{{ character.hogwartsStudent ? translate('filters.student') : '' }}{{ character.hogwartsStudent && character.hogwartsStaff ? ' & ' : '' }}{{ character.hogwartsStaff ? translate('filters.staff') : '' }}</span>
      </p>
      <p v-if="character.patronus" class="patronus">
        🦌 {{ character.patronus }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/store'
import type { Character } from '../types/types'

const { t: translate } = useI18n()

// ========== PROPS ==========
const props = defineProps<{
  character: Character
}>()

// ========== COMPOSABLES ==========
const router = useRouter()
const wizardStore = useWizardStore()

// ========== COMPUTED ==========

// Vérifier si ce personnage est dans les favoris
const isFav = computed(() => wizardStore.isFavorite(props.character.id))

// ========== FONCTIONS ==========

// Récupérer le nom traduit d'une maison
const getHouseName = (house: string) => {
  const houseKey = house.toLowerCase()
  return translate(`houses.${houseKey}`)
}

// Ajouter/Retirer de favoris
const toggleFav = () => {
  wizardStore.toggleFavorite(props.character)
}

// Aller à la page de détail
const goToDetail = () => {
  router.push({ name: 'detail', params: { id: props.character.id } })
}
</script>

<style scoped>
.card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #d4af37;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  color: #fff;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #0f3460;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  background: linear-gradient(135deg, #1a1a3e 0%, #0f3460 100%);
  color: rgba(212, 175, 55, 0.3);
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.favorite-btn.active {
  background: #d4af37;
}

.card-body {
  padding: 10px;
}

.card-body h3 {
  margin: 0 0 6px 0;
  font-size: 14px;
  color: #d4af37;
}

.card-body p {
  margin: 3px 0;
  font-size: 12px;
}

.patronus {
  margin-top: 10px;
  padding: 8px;
  background: rgba(212, 175, 55, 0.1);
  border-left: 3px solid #d4af37;
  font-style: italic;
}
</style>
