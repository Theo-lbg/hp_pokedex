<template>
  <div class="home-page">
    <div class="device-container">
      <!-- Favoris Panel -->
      <section class="device-section">
        <FavoritesPanel :characters="allCharacters" @select-for-duel="addFighterFromFavorites" />
      </section>

      <!-- Filtres -->
      <section class="device-section">
        <FilterBar
          @search="searchQuery = $event"
          @filter-houses="selectedHouses = $event"
          @filter-role="handleRoleFilter"
        />
      </section>

      <!-- Grille de Personnages -->
      <section class="device-section grid-section">
        <div class="vintage-panel-header">{{ $t('characters.title') }} ({{ allFilteredCharacters.length }})</div>
        <div v-if="loading" class="loading">⏳ {{ $t('characters.loading') }}</div>
        <div v-else-if="allFilteredCharacters.length === 0" class="empty-state">
          {{ $t('characters.empty') }}
        </div>
        <div v-else>
          <div class="characters-grid">
            <div
              v-for="character in filteredCharacters"
              :key="character.id"
              class="character-with-buttons"
            >
              <CharacterCard :character="character" />
              <div class="action-buttons">
                <button @click="selectFighter1(character)" class="select-btn fighter1-btn">
                  {{ $t('characters.fighter1') }}
                </button>
                <button @click="selectFighter2(character)" class="select-btn fighter2-btn">
                  {{ $t('characters.fighter2') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div class="pagination-controls" v-if="totalPages > 1">
            <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
              ← Page précédente
            </button>
            <div class="page-info">
              Page {{ currentPage }} / {{ totalPages }}
            </div>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
              Page suivante →
            </button>
          </div>
        </div>
      </section>

      <!-- Duel Arena -->
      <section class="device-section">
        <DuelArena ref="duelRef" :characters="filteredCharacters" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CharacterCard from '../components/CharacterCard.vue'
import FilterBar from '../components/FilterBar.vue'
import DuelArena from '../components/DuelArena.vue'
import FavoritesPanel from '../components/FavoritesPanel.vue'
import { getAllCharacters } from '../api'
import type { Character } from '../types'

const allCharacters = ref<Character[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedHouses = ref<string[]>([])
const isStudent = ref(true)
const isStaff = ref(true)
const currentPage = ref(1)
const itemsPerPage = 16
const { t } = useI18n()

const duelRef = ref<InstanceType<typeof DuelArena>>()

// ========== LIFECYCLE ==========

// Au chargement: récupérer tous les personnages de l'API
onMounted(async () => {
  try {
    allCharacters.value = await getAllCharacters()
    loading.value = false
    console.log(`✨ Page chargée avec ${allCharacters.value.length} personnages`)
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    loading.value = false
  }
})

// Quand la langue change: mettre à jour le titre du navigateur
watch(() => t('header.title'), (newTitle) => {
  document.title = newTitle
}, { immediate: true })

// ========== FONCTIONS DE FILTRAGE ==========

// Vérifier si un personnage correspond aux critères de recherche
const characterMatches = (char: Character): boolean => {
  // 1. Vérifier la recherche par nom
  const nameMatch = char.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  if (!nameMatch) return false

  // 2. Vérifier le filtre par maison
  const houseMatch = selectedHouses.value.length === 0 || selectedHouses.value.includes(char.house)
  if (!houseMatch) return false

  // 3. Vérifier le filtre par rôle (Student/Staff)
  const isStudentSelected = isStudent.value && char.hogwartsStudent
  const isStaffSelected = isStaff.value && char.hogwartsStaff
  const noRoleButFiltersOff = !isStudent.value && !isStaff.value && !char.hogwartsStudent && !char.hogwartsStaff
  const roleMatch = isStudentSelected || isStaffSelected || noRoleButFiltersOff

  return roleMatch
}

// ========== COMPUTED PROPERTIES ==========

// Tous les personnages filtrés (sans pagination)
const allFilteredCharacters = computed(() => {
  return allCharacters.value.filter(characterMatches)
})

// Le nombre total de pages
const totalPages = computed(() => {
  return Math.ceil(allFilteredCharacters.value.length / itemsPerPage)
})

// Les personnages de la page actuelle (avec pagination)
const filteredCharacters = computed(() => {
  const allFiltered = allFilteredCharacters.value
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return allFiltered.slice(startIndex, endIndex)
})

const selectFighter1 = (character: Character) => {
  duelRef.value?.selectFighter(character, 1)
}

const selectFighter2 = (character: Character) => {
  duelRef.value?.selectFighter(character, 2)
}

const addFighterFromFavorites = (character: Character) => {
  // Quand on clique sur un favori, on le sélectionne comme Fighter 1
  selectFighter1(character)
}

const handleRoleFilter = (args: [boolean, boolean]) => {
  // Mettre à jour les statuts Student/Staff
  [isStudent.value, isStaff.value] = args
  // Retour à la page 1 quand on change les filtres
  currentPage.value = 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Quand on fait une recherche: retour à la page 1
watch(searchQuery, () => {
  currentPage.value = 1
})

// Quand on change les filtres de maison: retour à la page 1
watch(selectedHouses, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.home-page {
  min-height: 100%;
}

.device-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.device-section {
  background: linear-gradient(135deg, var(--vintage-cream) 0%, #ddd0c0 100%);
  border: 5px solid var(--vintage-dark);
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.grid-section {
  min-height: 400px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: var(--vintage-dark);
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #888;
  font-style: italic;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.character-with-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.select-btn {
  padding: 10px 12px;
  border: 3px outset var(--vintage-gold);
  background: linear-gradient(135deg, var(--vintage-accent) 0%, var(--vintage-gold) 100%);
  color: var(--vintage-dark);
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.select-btn:hover {
  background: linear-gradient(135deg, var(--vintage-gold) 0%, var(--vintage-accent) 100%);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
}

.select-btn:active {
  border-style: inset;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fighter1-btn {
  background: linear-gradient(135deg, var(--vintage-red) 0%, #a04a4a 100%);
  border-color: var(--vintage-dark);
  color: var(--vintage-cream);
}

.fighter1-btn:hover {
  background: linear-gradient(135deg, #a04a4a 0%, var(--vintage-red) 100%);
}

.fighter2-btn {
  background: linear-gradient(135deg, var(--vintage-teal) 0%, #5a8b7e 100%);
  border-color: var(--vintage-dark);
  color: var(--vintage-cream);
}

.fighter2-btn:hover {
  background: linear-gradient(135deg, #5a8b7e 0%, var(--vintage-teal) 100%);
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px dashed var(--vintage-gold);
}

.pagination-btn {
  padding: 12px 20px;
  border: 3px outset var(--vintage-gold);
  background: linear-gradient(135deg, var(--vintage-accent) 0%, var(--vintage-gold) 100%);
  color: var(--vintage-dark);
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  font-family: 'Courier New', monospace;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--vintage-gold) 0%, var(--vintage-accent) 100%);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
}

.pagination-btn:active:not(:disabled) {
  border-style: inset;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(1px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-style: inset;
}

.page-info {
  font-size: 14px;
  font-weight: bold;
  color: var(--vintage-dark);
  font-family: 'Courier New', monospace;
  padding: 8px 16px;
  background: rgba(201, 169, 97, 0.2);
  border: 2px solid var(--vintage-gold);
  border-radius: 6px;
  min-width: 150px;
  text-align: center;
}

@media (max-width: 768px) {
  .device-container {
    gap: 16px;
  }

  .device-section {
    padding: 15px;
    border-width: 4px;
  }

  .characters-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
  }

  .action-buttons {
    gap: 8px;
  }

  .select-btn {
    padding: 8px 10px;
    font-size: 10px;
  }
}
</style>
