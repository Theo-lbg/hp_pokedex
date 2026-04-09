<template>
  <div class="filter-bar">
    <div class="search-section">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('filters.search')"
        class="search-input"
      />
    </div>

    <div class="filter-section">
      <h3>{{ $t('filters.houses') }}</h3>
      <div class="house-buttons">
        <button
          v-for="house in availableHouses"
          :key="house"
          @click="toggleHouse(house)"
          :class="{ active: selectedHouses.includes(house) }"
          class="house-btn"
        >
          {{ getHouseName(house) }}
        </button>
      </div>
    </div>

    <div class="filter-section">
      <h3>{{ $t('filters.type') }}</h3>
      <div class="role-filters">
        <label>
          <input v-model="isStudent" type="checkbox" />
          {{ $t('filters.student') }}
        </label>
        <label>
          <input v-model="isStaff" type="checkbox" />
          {{ $t('filters.staff') }}
        </label>
      </div>
    </div>

    <button @click="resetFilters" class="reset-btn">{{ $t('filters.reset') }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const emit = defineEmits<{
  search: [query: string]
  filterHouses: [houses: string[]]
  filterRole: [[boolean, boolean]]
}>()

// ========== STATE ==========
const searchQuery = ref('')
const selectedHouses = ref<string[]>([])
const isStudent = ref(true)
const isStaff = ref(true)

const availableHouses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw']

// ========== FONCTIONS ==========

// Récupérer le nom traduit d'une maison
const getHouseName = (house: string) => {
  const houseKey = house.toLowerCase()
  return $t(`houses.${houseKey}`)
}

// Activer/désactiver une maison dans les filtres
const toggleHouse = (house: string) => {
  const isSelected = selectedHouses.value.includes(house)

  if (isSelected) {
    // Si déjà sélectionnée, la retirer
    selectedHouses.value = selectedHouses.value.filter(h => h !== house)
  } else {
    // Sinon l'ajouter
    selectedHouses.value.push(house)
  }
}

// Réinitialiser tous les filtres
const resetFilters = () => {
  searchQuery.value = ''
  selectedHouses.value = []
  isStudent.value = true
  isStaff.value = true
}

// ========== WATCHERS ==========

// À chaque changement, envoyer les nouvelles valeurs au parent
watch([searchQuery, selectedHouses, isStudent, isStaff], () => {
  emit('search', searchQuery.value)
  emit('filterHouses', selectedHouses.value)
  emit('filterRole', [isStudent.value, isStaff.value] as [boolean, boolean])
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-section {
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  border: 3px inset var(--vintage-dark);
  background: var(--vintage-cream);
  color: var(--vintage-dark);
  font-family: 'Courier New', monospace;
  font-size: 13px;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-inset);
  transition: all 0.2s;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  outline: none;
  background: #f5f0e8;
  box-shadow: var(--shadow-inset), 0 0 0 2px var(--vintage-gold);
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-section h3 {
  margin: 0;
  color: var(--vintage-dark);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  border-bottom: 1px dashed var(--vintage-gold);
  padding-bottom: 6px;
}

.house-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.house-btn {
  padding: 8px 14px;
  border: 3px outset var(--vintage-gold);
  background: linear-gradient(135deg, var(--vintage-accent) 0%, var(--vintage-gold) 100%);
  color: var(--vintage-dark);
  cursor: pointer;
  border-radius: var(--border-radius-md);
  transition: all 0.2s;
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.house-btn:hover {
  background: linear-gradient(135deg, var(--vintage-gold) 0%, var(--vintage-accent) 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}

.house-btn.active {
  background: linear-gradient(135deg, var(--vintage-teal) 0%, #5a8b7e 100%);
  border-color: var(--vintage-dark);
  color: var(--vintage-cream);
  border-style: inset;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.house-btn.active:hover {
  background: linear-gradient(135deg, #5a8b7e 0%, var(--vintage-teal) 100%);
}

.role-filters {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.role-filters label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  color: var(--vintage-dark);
  user-select: none;
}

.role-filters input {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: var(--vintage-gold);
}

.reset-btn {
  align-self: flex-start;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--vintage-red) 0%, #a04a4a 100%);
  color: var(--vintage-cream);
  border: 3px outset var(--vintage-dark);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.reset-btn:hover {
  background: linear-gradient(135deg, #a04a4a 0%, var(--vintage-red) 100%);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
}

.reset-btn:active {
  border-style: inset;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .filter-bar {
    gap: 15px;
  }

  .house-buttons {
    flex-direction: column;
  }

  .house-btn {
    width: 100%;
  }

  .role-filters {
    flex-direction: column;
  }
}
</style>
