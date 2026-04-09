<template>
  <div class="vintage-panel">
    <div class="vintage-panel-header">{{ translate('favorites.title') }} ({{ wizardStore.favoritesCount }})</div>
    <div v-if="wizardStore.favoritesCount > 0" class="favorites-grid">
      <div
        v-for="character in displayedFavorites"
        :key="character.id"
        class="favorite-item"
      >
        <img :src="character.image" :alt="character.name" class="fav-image" />
        <p class="fav-name">{{ character.name }}</p>
        <button @click="wizardStore.toggleFavorite(character)" class="remove-btn">
          ✕
        </button>
      </div>
    </div>
    <p v-else class="empty">{{ translate('favorites.empty') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/store'
import type { Character } from '../types/types'

const { t: translate } = useI18n()
const props = defineProps<{
  characters: Character[]
}>()

// ========== COMPOSABLES ==========
const wizardStore = useWizardStore()

// ========== COMPUTED ==========

// Filtrer les personnages favoris parmi ceux reçus en props
const displayedFavorites = computed(() => {
  return props.characters.filter(char => wizardStore.isFavorite(char.id))
})
</script>

<style scoped>
.vintage-panel {
  background: linear-gradient(135deg, var(--vintage-cream) 0%, #ddd0c0 100%);
  border: 5px solid var(--vintage-dark);
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.vintage-panel-header {
  font-size: 14px;
  font-weight: bold;
  color: var(--vintage-dark);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 15px 0;
  border-bottom: 2px dashed var(--vintage-gold);
  padding-bottom: 10px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 10px;
}

.favorite-item {
  position: relative;
  background: var(--vintage-cream);
  border: 3px solid var(--vintage-dark);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.favorite-item:hover {
  box-shadow: 0 0 12px rgba(201, 169, 97, 0.6), inset 0 0 8px rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

.fav-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  display: block;
}

.fav-name {
  padding: 4px 3px;
  margin: 0;
  color: var(--vintage-dark);
  font-size: 9px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--vintage-gold);
  border-top: 1px solid var(--vintage-dark);
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--vintage-gold);
  color: var(--vintage-dark);
  border: 2px solid var(--vintage-dark);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  padding: 0 !important;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: var(--vintage-red);
  color: var(--vintage-cream);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.empty {
  padding: 20px;
  text-align: center;
  color: var(--vintage-dark);
  font-style: italic;
  font-size: 12px;
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .fav-image {
    height: 100px;
  }
}
</style>
