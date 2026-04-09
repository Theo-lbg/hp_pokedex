<template>
  <div class="detail-page">
    <header class="header">
      <router-link to="/" class="back-btn">{{ $t('detail.back') }}</router-link>
      <h1>{{ $t('detail.title') }}</h1>
    </header>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="!character" class="not-found">{{ $t('detail.notFound') }}</div>
    <div v-else class="detail-container">
      <div class="detail-card">
        <div class="image-section">
          <img v-if="character.image" :src="character.image" :alt="character.name" />
        </div>

        <div class="info-section">
          <h2>{{ character.name }}</h2>

          <div class="info-grid">
            <div class="info-item">
              <strong>{{ $t('detail.house') }}:</strong>
              <span>{{ character.house || 'Unknown' }}</span>
            </div>

            <div class="info-item">
              <strong>{{ $t('detail.gender') }}:</strong>
              <span>{{ character.gender }}</span>
            </div>

            <div class="info-item">
              <strong>{{ $t('detail.role') }}:</strong>
              <span>{{ character.hogwartsStudent ? 'Étudiant ' : '' }}{{ character.hogwartsStaff ? 'Staff' : 'Autre' }}</span>
            </div>

            <div class="info-item">
              <strong>{{ $t('detail.bloodStatus') }}:</strong>
              <span>{{ character.bloodStatus || 'Unknown' }}</span>
            </div>

            <div class="info-item">
              <strong>{{ $t('detail.species') }}:</strong>
              <span>{{ character.species }}</span>
            </div>

            <div class="info-item">
              <strong>{{ $t('detail.birth') }}:</strong>
              <span>{{ character.yearOfBirth || 'Unknown' }}</span>
            </div>

            <div class="info-item">
              <strong>{{ $t('detail.actor') }}:</strong>
              <span>{{ character.actor }}</span>
            </div>

            <div class="info-item">
              <strong>{{ $t('detail.status') }}:</strong>
              <span :class="{ alive: character.alive, dead: !character.alive }">
                {{ character.alive ? '✓ Vivant' : '✗ Décédé' }}
              </span>
            </div>
          </div>

          <!-- Baguette -->
          <div v-if="character.wand" class="wand-section">
            <h3>{{ $t('detail.wand') }}</h3>
            <div class="wand-details">
              <p>
                <strong>{{ $t('detail.wood') }}:</strong>
                {{ character.wand.wood || 'Unknown' }}
              </p>
              <p>
                <strong>{{ $t('detail.core') }}:</strong>
                {{ character.wand.core || 'Unknown' }}
              </p>
              <p v-if="character.wand.length">
                <strong>{{ $t('detail.length') }}:</strong>
                {{ character.wand.length }} pouces
              </p>
            </div>
          </div>

          <!-- Patronus -->
          <div v-if="character.patronus" class="patronus-section">
            <h3>{{ $t('detail.patronus') }}</h3>
            <p class="patronus-name">{{ character.patronus }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="toggleFavorite" :class="{ favorite: isFavorite }" class="action-btn">
              {{ isFavorite ? $t('detail.removeFavorite') : $t('detail.addFavorite') }}
            </button>
            <router-link to="/" class="action-btn nav-btn">{{ $t('detail.back') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCharacterById } from '../api'
import { useWizardStore } from '../stores/store'
import type { Character } from '../types/types'

// ========== COMPOSABLES ==========
const route = useRoute()
const wizardStore = useWizardStore()
const { t } = useI18n()

// ========== STATE ==========
const character = ref<Character | null>(null)
const loading = ref(true)

// ========== COMPUTED ==========

// Vérifier si ce personnage est dans les favoris
const isFavorite = computed(() => {
  return character.value ? wizardStore.isFavorite(character.value.id) : false
})

// ========== LIFECYCLE ==========

// Au chargement de la page
onMounted(async () => {
  try {
    // Récupérer l'ID du personnage depuis l'URL
    const id = route.params.id as string
    // Charger les données du personnage de l'API
    character.value = await getCharacterById(id)
    loading.value = false

    // Changer le titre de la page du navigateur
    if (character.value) {
      document.title = `${character.value.name} - ${t('header.title')}`
    }
  } catch (error) {
    console.error('Erreur:', error)
    loading.value = false
  }
})

// Avant de fermer la page
onBeforeUnmount(() => {
  // Restaurer le titre original
  document.title = t('header.title')
  console.log('🧙 Détail du personnage fermé')
})

// ========== FONCTIONS ==========

// Ajouter/Retirer de favoris
const toggleFavorite = () => {
  if (character.value) {
    wizardStore.toggleFavorite(character.value)
  }
}
</script>

<style scoped>
.detail-page {
  background: linear-gradient(135deg, #0f1419 0%, #1a1a2e 100%);
  min-height: 100vh;
  color: #fff;
}

.header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 3px solid #d4af37;
  padding: 20px;
  position: relative;
}

.back-btn {
  display: inline-block;
  color: #d4af37;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 10px;
  transition: all 0.3s;
}

.back-btn:hover {
  transform: translateX(-5px);
}

.header h1 {
  margin: 10px 0 0 0;
  font-size: 36px;
  color: #d4af37;
}

.loading,
.not-found {
  text-align: center;
  padding: 60px 20px;
  font-size: 20px;
  color: #d4af37;
}

.detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.detail-card {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #d4af37;
  border-radius: 8px;
  padding: 30px;
}

.image-section {
  text-align: center;
}

.image-section img {
  width: 100%;
  max-width: 350px;
  border: 3px solid #d4af37;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

.info-section h2 {
  margin: 0 0 30px 0;
  color: #d4af37;
  font-size: 32px;
  border-bottom: 2px solid #d4af37;
  padding-bottom: 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  background: rgba(212, 175, 55, 0.05);
  padding: 15px;
  border-left: 3px solid #d4af37;
  border-radius: 4px;
}

.info-item strong {
  color: #d4af37;
  display: block;
  margin-bottom: 5px;
}

.info-item span {
  color: #ccc;
}

.info-item .alive {
  color: #4ecdc4;
  font-weight: bold;
}

.info-item .dead {
  color: #ff6b6b;
  font-weight: bold;
}

.wand-section,
.patronus-section {
  background: rgba(212, 175, 55, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #d4af37;
}

.wand-section h3,
.patronus-section h3 {
  color: #d4af37;
  margin: 0 0 15px 0;
  font-size: 20px;
}

.wand-details p {
  margin: 10px 0;
  color: #ccc;
}

.patronus-name {
  font-size: 18px;
  color: #d4af37;
  font-style: italic;
  margin: 0;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 30px;
}

.action-btn {
  padding: 12px 20px;
  border: 2px solid #d4af37;
  background: transparent;
  color: #d4af37;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.3s;
  text-decoration: none;
  text-align: center;
  display: inline-block;
}

.action-btn:hover {
  background: #d4af37;
  color: #1a1a2e;
  transform: scale(1.05);
}

.action-btn.favorite {
  background: #d4af37;
  color: #1a1a2e;
}

.nav-btn {
  border-color: #4ecdc4;
  color: #4ecdc4;
}

.nav-btn:hover {
  background: #4ecdc4;
  color: #fff;
}

@media (max-width: 768px) {
  .detail-card {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
