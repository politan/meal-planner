<template>
  <div class="container mx-auto px-4">
    <!-- Date Navigation -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <button 
          @click="changeDate('prev')" 
          class="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        <div class="text-center">
          <h2 class="text-2xl font-semibold">
            {{ formatDate(selectedDate) }}
          </h2>
          <p class="text-gray-500">
            {{ formatWeekDay(selectedDate) }}
          </p>
        </div>
        <button 
          @click="changeDate('next')" 
          class="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight class="w-6 h-6" />
        </button>
      </div>
      <div class="flex space-x-3">
        <button
          @click="navigateToWeek"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Calendar class="w-4 h-4 mr-2" />
          Week View
        </button>
        <button
          @click="generateNutrition"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
        >
          <LineChart class="w-4 h-4 mr-2" />
          Nutrition Summary
        </button>
      </div>
    </div>

    <!-- Meals Grid -->
    <div class="grid gap-6">
      <!-- Breakfast -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Breakfast</h3>
            <p class="text-sm text-gray-500">6:00 AM - 10:00 AM</p>
          </div>
          <button
            v-if="!meals?.breakfast"
            @click="openAddMealModal('breakfast')"
            class="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Plus class="w-4 h-4 mr-1" />
            Add Meal
          </button>
        </div>
        
        <MealCard
          v-if="meals?.breakfast"
          :meal="meals.breakfast"
          :show-actions="true"
          @edit="openEditMealModal"
          @remove="removeMeal"
        />
      </div>

      <!-- Lunch -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Lunch</h3>
            <p class="text-sm text-gray-500">12:00 PM - 2:00 PM</p>
          </div>
          <button
            v-if="!meals?.lunch"
            @click="openAddMealModal('lunch')"
            class="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Plus class="w-4 h-4 mr-1" />
            Add Meal
          </button>
        </div>
        
        <MealCard
          v-if="meals?.lunch"
          :meal="meals.lunch"
          :show-actions="true"
          @edit="openEditMealModal"
          @remove="removeMeal"
        />
      </div>

      <!-- Dinner -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Dinner</h3>
            <p class="text-sm text-gray-500">6:00 PM - 8:00 PM</p>
          </div>
          <button
            v-if="!meals?.dinner"
            @click="openAddMealModal('dinner')"
            class="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Plus class="w-4 h-4 mr-1" />
            Add Meal
          </button>
        </div>
        
        <MealCard
          v-if="meals?.dinner"
          :meal="meals.dinner"
          :show-actions="true"
          @edit="openEditMealModal"
          @remove="removeMeal"
        />
      </div>

      <!-- Snack -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Snack</h3>
            <p class="text-sm text-gray-500">Anytime</p>
          </div>
          <button
            v-if="!meals?.snack"
            @click="openAddMealModal('snack')"
            class="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Plus class="w-4 h-4 mr-1" />
            Add Meal
          </button>
        </div>
        
        <MealCard
          v-if="meals?.snack"
          :meal="meals.snack"
          :show-actions="true"
          @edit="openEditMealModal"
          @remove="removeMeal"
        />
      </div>
    </div>

    <!-- Daily Summary -->
    <div class="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Total Calories</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ calculateTotalCalories() }} kcal
          </p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Protein</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ calculateTotalProtein() }}g
          </p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Carbs</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ calculateTotalCarbs() }}g
          </p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Fat</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ calculateTotalFat() }}g
          </p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <AddMealModal
        v-if="showAddMealModal"
        :selected-date="selectedDate"
        :selected-type="selectedMealType!"
        @close="closeAddMealModal"
        @save="saveMeal"
      />

      <EditMealModal
        v-if="showEditMealModal && selectedMeal"
        :meal="selectedMeal"
        @close="closeEditMealModal"
        @save="updateMeal"
      />

      <NutritionModal
    v-if="showNutritionModal"
    :meals="convertMealsForNutrition(meals)"
    :date="selectedDate"
    @close="closeNutritionModal"
  />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { format, addDays, parseISO } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar,
  LineChart 
} from 'lucide-vue-next';
import { useMealStore } from '@/stores/mealStore';
import type { DayMeals, Meal, MealType } from '@/types/meal';

// Components
import MealCard from '@/components/MealCard.vue';
import AddMealModal from '@/components/modals/AddMealModal.vue';
import EditMealModal from '@/components/modals/EditMealModal.vue';
import NutritionModal from '@/components/modals/NutritionModal.vue';

const router = useRouter();
const route = useRoute();
const store = useMealStore();

// State
const selectedDate = ref(route.params.date ? parseISO(route.params.date as string) : new Date());
const selectedMealType = ref<MealType | null>(null);
const selectedMeal = ref<Meal | null>(null);
const showAddMealModal = ref(false);
const showEditMealModal = ref(false);
const showNutritionModal = ref(false);

// Computed
const meals = computed(() => store.getMealsForDate(selectedDate.value));

// Methods
const formatDate = (date: Date) => format(date, 'MMMM d, yyyy');
const formatWeekDay = (date: Date) => format(date, 'EEEE');

const changeDate = (direction: 'prev' | 'next') => {
  selectedDate.value = addDays(selectedDate.value, direction === 'prev' ? -1 : 1);
  void router.push({
    name: 'day',
    params: { date: format(selectedDate.value, 'yyyy-MM-dd') }
  });
};

const navigateToWeek = () => {
  void router.push({
    name: 'home',
    query: { date: format(selectedDate.value, 'yyyy-MM-dd') }
  });
};

// Modal handlers
const openAddMealModal = (type: MealType) => {
  selectedMealType.value = type;
  showAddMealModal.value = true;
};

const closeAddMealModal = () => {
  showAddMealModal.value = false;
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

const generateNutrition = () => {
  showNutritionModal.value = true;
};

const closeNutritionModal = () => {
  showNutritionModal.value = false;
};

// Meal operations
const saveMeal = async (meal: Meal) => {
  if (selectedMealType.value) {
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
};

// Nutrition calculations
const calculateTotalCalories = () => {
  // Implement calculation based on your meal data structure
  return 0;
};

const calculateTotalProtein = () => {
  // Implement calculation based on your meal data structure
  return 0;
};

const calculateTotalCarbs = () => {
  // Implement calculation based on your meal data structure
  return 0;
};

const calculateTotalFat = () => {
  // Implement calculation based on your meal data structure
  return 0;
};

const convertMealsForNutrition = (meals: DayMeals): Record<MealType, Meal | undefined> => {
  return {
    breakfast: meals.breakfast,
    lunch: meals.lunch,
    dinner: meals.dinner,
    snack: meals.snack
  };
};

// Lifecycle
onMounted(() => {
  void store.fetchMealsForDate(selectedDate.value);
});

watch(selectedDate, (newDate) => {
  void store.fetchMealsForDate(newDate);
});
</script>