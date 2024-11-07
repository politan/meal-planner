// src/views/FavoritesList.vue
<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">Favorite Meals</h2>
      <button
        @click="openAddMealModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Add New Meal
      </button>
    </div>

    <!-- Grid of favorite meals -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="meal in favorites" 
        :key="meal.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-medium">{{ meal.name }}</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="openEditMealModal(meal)"
                class="text-gray-400 hover:text-gray-600"
              >
                <Pencil class="w-5 h-5" />
              </button>
              <button
                @click="confirmRemoveFavorite(meal.id)"
                class="text-gray-400 hover:text-red-600"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-600 mb-3">{{ meal.description }}</p>

          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500">Ingredients:</p>
            <ul class="text-sm text-gray-600">
              <li v-for="ing in meal.ingredients" :key="ing.name">
                {{ ing.amount }} {{ ing.unit }} {{ ing.name }}
              </li>
            </ul>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              @click="openAddToWeekModal(meal)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              <Calendar class="w-4 h-4" />
              Add to Week
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div 
      v-if="!favorites.length" 
      class="text-center py-12"
    >
      <EmptyState
        :icon="Heart"
        title="No favorite meals yet"
        description="Add your favorite meals to quickly access them later"
        action-text="Add First Favorite"
        @action="openAddMealModal"
      />
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <AddMealModal
        v-if="showAddMealModal"
        :is-favorite="true"
        @close="closeAddMealModal"
        @save="saveMeal"
      />

      <EditMealModal
        v-if="showEditMealModal && selectedMeal"
        :meal="selectedMeal"
        @close="closeEditMealModal"
        @save="updateMeal"
      />

      <AddToWeekModal
        v-if="showAddToWeekModal && selectedMeal"
        :meal="selectedMeal"
        @close="closeAddToWeekModal"
        @add="handleAddToWeek"
      />

      <ConfirmModal
        v-if="showConfirmModal"
        title="Remove Favorite"
        message="Are you sure you want to remove this meal from favorites?"
        @confirm="handleConfirmedRemove"
        @cancel="closeConfirmModal"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Pencil, Trash2, Calendar, Heart } from 'lucide-vue-next'
import { useMealStore } from '@/stores/mealStore'
import type { Meal, MealType } from '@/types/meal'

// Components
import EmptyState from '@/components/EmptyState.vue'
import AddMealModal from '@/components/modals/AddMealModal.vue'
import EditMealModal from '@/components/modals/EditMealModal.vue'
import AddToWeekModal from '@/components/modals/AddToWeekModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

// Store
const store = useMealStore()

// State
const showAddMealModal = ref(false)
const showEditMealModal = ref(false)
const showAddToWeekModal = ref(false)
const showConfirmModal = ref(false)
const selectedMeal = ref<Meal | null>(null)
const mealToRemove = ref<string | null>(null)

// Computed
const favorites = computed(() => store.favorites)

// Modal handlers
const openAddMealModal = () => {
  showAddMealModal.value = true
}

const closeAddMealModal = () => {
  showAddMealModal.value = false
}

const openEditMealModal = (meal: Meal) => {
  selectedMeal.value = meal
  showEditMealModal.value = true
}

const closeEditMealModal = () => {
  selectedMeal.value = null
  showEditMealModal.value = false
}

const openAddToWeekModal = (meal: Meal) => {
  selectedMeal.value = meal
  showAddToWeekModal.value = true
}

const closeAddToWeekModal = () => {
  selectedMeal.value = null
  showAddToWeekModal.value = false
}

const confirmRemoveFavorite = (mealId: string) => {
  mealToRemove.value = mealId
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  mealToRemove.value = null
  showConfirmModal.value = false
}

// Meal operations
const saveMeal = async (meal: Meal) => {
  await store.addFavoriteMeal(meal)
  closeAddMealModal()
}

const updateMeal = async (meal: Meal) => {
  await store.updateFavoriteMeal(meal)
  closeEditMealModal()
}

const handleConfirmedRemove = async () => {
  if (mealToRemove.value) {
    await store.removeFavoriteMeal(mealToRemove.value)
    closeConfirmModal()
  }
}

const handleAddToWeek = async (date: Date, mealType: MealType) => {
  if (selectedMeal.value) {
    await store.addMealToWeek(selectedMeal.value, date, mealType)
    closeAddToWeekModal()
  }
}
</script>

<style scoped>
.container {
  max-width: 1400px;
}

@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>