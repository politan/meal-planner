<template>
  <BaseModal title="Nutrition Summary" @close="$emit('close')" size="lg">
    <div class="space-y-6">
      <!-- Nutrition Chart -->
      <div class="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart :data="macroData" :margin="{ top: 20, right: 30, left: 20, bottom: 5 }">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="planned" name="Planned" fill="#3B82F6" />
            <Bar dataKey="actual" name="Actual" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <!-- Macronutrient Distribution -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Protein</h4>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-3xl font-bold text-blue-600">
                {{ totalProtein }}g
              </p>
              <p class="text-sm text-gray-500">
                {{ proteinPercentage }}% of total calories
              </p>
            </div>
            <div class="text-sm text-gray-500">
              Target: {{ targetProtein }}g
            </div>
          </div>
          <div class="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 bg-blue-600 rounded-full"
              :style="{ width: `${(totalProtein / targetProtein) * 100}%` }"
            />
          </div>
        </div>

        <div class="bg-green-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Carbohydrates</h4>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-3xl font-bold text-green-600">
                {{ totalCarbs }}g
              </p>
              <p class="text-sm text-gray-500">
                {{ carbsPercentage }}% of total calories
              </p>
            </div>
            <div class="text-sm text-gray-500">
              Target: {{ targetCarbs }}g
            </div>
          </div>
          <div class="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 bg-green-600 rounded-full"
              :style="{ width: `${(totalCarbs / targetCarbs) * 100}%` }"
            />
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Fats</h4>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-3xl font-bold text-yellow-600">
                {{ totalFat }}g
              </p>
              <p class="text-sm text-gray-500">
                {{ fatPercentage }}% of total calories
              </p>
            </div>
            <div class="text-sm text-gray-500">
              Target: {{ targetFat }}g
            </div>
          </div>
          <div class="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 bg-yellow-600 rounded-full"
              :style="{ width: `${(totalFat / targetFat) * 100}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Meal Breakdown -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-900">Meal Breakdown</h4>
        <div class="divide-y divide-gray-200">
          <div
            v-for="(meal, type) in meals"
            :key="type"
            class="py-4 first:pt-0 last:pb-0"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="font-medium text-gray-900">{{ formatMealType(type) }}</h5>
              <span class="text-sm text-gray-500">
                {{ calculateMealCalories(meal) }} kcal
              </span>
            </div>
            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Protein</p>
                <p>{{ meal?.nutrition?.protein || 0 }}g</p>
              </div>
              <div>
                <p class="text-gray-500">Carbs</p>
                <p>{{ meal?.nutrition?.carbs || 0 }}g</p>
              </div>
              <div>
                <p class="text-gray-500">Fat</p>
                <p>{{ meal?.nutrition?.fat || 0 }}g</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-2">Daily Recommendations</h4>
        <ul class="space-y-2 text-sm">
          <li v-for="(rec, index) in recommendations" :key="index" class="flex gap-2">
            <InfoIcon class="w-5 h-5 text-blue-500 flex-shrink-0" />
            <span class="text-gray-600">{{ rec }}</span>
          </li>
        </ul>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Info as InfoIcon } from 'lucide-vue-next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import BaseModal from './BaseModal.vue';
import type { Meal, MealType } from '@/types/meal';

interface Props {
  meals: Record<MealType, Meal | undefined>;
  date: Date;
}

const props = defineProps<Props>();

// Constants for daily targets
const DAILY_TARGETS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 67
};

// Define target properties
const targetProtein = DAILY_TARGETS.protein;
const targetCarbs = DAILY_TARGETS.carbs;
const targetFat = DAILY_TARGETS.fat;

// Computed properties for macronutrients
const totalProtein = computed(() => 
  Object.values(props.meals).reduce((sum, meal) => 
    sum + (meal?.nutrition?.protein || 0), 0)
);

const totalCarbs = computed(() => 
  Object.values(props.meals).reduce((sum, meal) => 
    sum + (meal?.nutrition?.carbs || 0), 0)
);

const totalFat = computed(() => 
  Object.values(props.meals).reduce((sum, meal) => 
    sum + (meal?.nutrition?.fat || 0), 0)
);

const totalCalories = computed(() => 
  Object.values(props.meals).reduce((sum, meal) => 
    sum + calculateMealCalories(meal), 0)
);

// Percentage calculations
const proteinPercentage = computed(() => 
  Math.round((totalProtein.value * 4 / totalCalories.value) * 100)
);

const carbsPercentage = computed(() => 
  Math.round((totalCarbs.value * 4 / totalCalories.value) * 100)
);

const fatPercentage = computed(() => 
  Math.round((totalFat.value * 9 / totalCalories.value) * 100)
);

// Chart data
const macroData = computed(() => [
  {
    name: 'Protein',
    planned: DAILY_TARGETS.protein,
    actual: totalProtein.value
  },
  {
    name: 'Carbs',
    planned: DAILY_TARGETS.carbs,
    actual: totalCarbs.value
  },
  {
    name: 'Fat',
    planned: DAILY_TARGETS.fat,
    actual: totalFat.value
  }
]);

// Helper functions
const formatMealType = (type: MealType): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const calculateMealCalories = (meal: Meal | undefined): number => {
  if (!meal?.nutrition) return 0;
  return (meal.nutrition.protein * 4) + 
         (meal.nutrition.carbs * 4) + 
         (meal.nutrition.fat * 9);
};

// Dynamic recommendations based on current values
const recommendations = computed(() => {
  const recs: string[] = [];
  
  if (totalProtein.value < DAILY_TARGETS.protein) {
    recs.push('Consider adding more protein-rich foods to reach your daily target.');
  }
  
  if (totalCalories.value < DAILY_TARGETS.calories * 0.8) {
    recs.push('Your caloric intake might be too low. Consider adding more meals or increasing portion sizes.');
  }
  
  if (carbsPercentage.value > 60) {
    recs.push('Your carbohydrate intake is relatively high. Consider balancing with more protein and healthy fats.');
  }
  
  return recs;
});

defineEmits<{
  (e: 'close'): void;
}>();
</script>