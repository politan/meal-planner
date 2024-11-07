// src/views/WeekView.vue
<template>
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <button 
          @click="handleWeekChange('prev')" 
          class="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        <h2 class="text-xl font-semibold">
          {{ formatDateRange(currentWeekStart, addDays(currentWeekStart, 6)) }}
        </h2>
        <button 
          @click="handleWeekChange('next')" 
          class="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight class="w-6 h-6" />
        </button>
      </div>
      <button
        @click="openShoppingList"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <ShoppingBag class="w-5 h-5" />
        Shopping List
      </button>
    </div>

    <!-- Week Grid -->
    <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
      <div 
        v-for="date in weekDates" 
        :key="date.toISOString()"
        class="bg-white rounded-lg shadow p-4"
      >
      <div 
          class="flex justify-between items-center mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
          @click="navigateToDay(date)"
        >
          <div>
            <p class="text-sm text-gray-500">{{ formatWeekDay(date) }}</p>
            <p class="font-medium">{{ formatDate(date) }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <DayMeals
            :date="date"
            :meals="getMealsForDate(date)"
            @add-meal="(type) => openAddMealModal(date, type)"
            @edit-meal="openEditMealModal"
            @remove-meal="removeMeal"
          />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <!-- Add Meal Modal -->
      <AddMealModal
        v-if="showAddMealModal && selectedDate && selectedMealType"
        :selected-date="selectedDate"
        :selected-type="selectedMealType"
        @close="closeAddMealModal"
        @save="saveMeal"
      />

      <!-- Edit Meal Modal -->
      <EditMealModal
        v-if="showEditMealModal && selectedMeal"
        :meal="selectedMeal"
        @close="closeEditMealModal"
        @save="updateMeal"
      />

      <!-- Shopping List Modal -->
      <ShoppingListModal
        v-if="showShoppingListModal"
        @close="closeShoppingList"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-vue-next';
import { format, addDays, startOfWeek } from 'date-fns';
import { useMealStore } from '@/stores/mealStore';
import type { Meal, MealType } from '@/types/meal';

// Components
import DayMeals from '@/components/DayMeals.vue';
import AddMealModal from '@/components/modals/AddMealModal.vue';
import EditMealModal from '@/components/modals/EditMealModal.vue';
import ShoppingListModal from '@/components/modals/ShoppingListModal.vue';

import { useRouter } from 'vue-router'

const router = useRouter();

// Store
const store = useMealStore();

// State
const currentWeekStart = ref<Date>(startOfWeek(new Date()));
const selectedDate = ref<Date | null>(null);
const selectedMealType = ref<MealType | null>(null);
const selectedMeal = ref<Meal | null>(null);
const showAddMealModal = ref(false);
const showEditMealModal = ref(false);
const showShoppingListModal = ref(false);

// Computed
const weekDates = computed(() => {
  return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart.value, i));
});

// Methods
const formatDateRange = (start: Date, end: Date) => {
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
};

const formatWeekDay = (date: Date) => format(date, 'EEEE');
const formatDate = (date: Date) => format(date, 'MMM d');

const getMealsForDate = (date: Date): Record<MealType, Meal | undefined> => {
  const meals = store.getMealsForDate(date);
  return {
    breakfast: meals?.breakfast,
    lunch: meals?.lunch,
    dinner: meals?.dinner,
    snack: meals?.snack
  };
};

const handleWeekChange = (direction: 'prev' | 'next') => {
  const days = direction === 'prev' ? -7 : 7;
  currentWeekStart.value = addDays(currentWeekStart.value, days);
  void store.fetchWeekMeals(currentWeekStart.value);
};

// Modal handlers
const openAddMealModal = (date: Date, type: MealType) => {
  selectedDate.value = date;
  selectedMealType.value = type;
  showAddMealModal.value = true;
};

const closeAddMealModal = () => {
  showAddMealModal.value = false;
  selectedDate.value = null;
  selectedMealType.value = null;
};

const openEditMealModal = (meal: Meal) => {
  selectedMeal.value = meal;
  showEditMealModal.value = true;
};

const closeEditMealModal = () => {
  showEditMealModal.value = false;
  selectedMeal.value = null;
};

const openShoppingList = () => {
  store.generateShoppingList();
  showShoppingListModal.value = true;
};

const closeShoppingList = () => {
  showShoppingListModal.value = false;
};

// Meal operations
const saveMeal = async (meal: Meal) => {
  if (selectedDate.value && selectedMealType.value) {
    await store.addMeal(meal, selectedDate.value, selectedMealType.value);
    closeAddMealModal();
  }
};

const updateMeal = async (meal: Meal) => {
  await store.updateMeal(meal);
  closeEditMealModal();
};

const removeMeal = async (mealId: string) => {
  await store.removeMeal(mealId);
  if (showEditMealModal.value) {
    closeEditMealModal();
  }
};

const navigateToDay = (date: Date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  router.push({
    name: 'day',
    params: { date: formattedDate }
  });
};

// Initial load
void store.fetchWeekMeals(currentWeekStart.value);
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