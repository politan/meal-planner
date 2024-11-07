<template>
  <div class="space-y-4">
    <div v-for="type in mealTypes" :key="type" class="meal-slot">
      <div class="flex justify-between items-center mb-2">
        <h4 class="text-sm font-medium text-gray-600">{{ formatMealType(type) }}</h4>
        <button
          v-if="!getMeal(type)"
          @click="$emit('add-meal', type)"
          class="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add
        </button>
      </div>

      <MealCard
        v-if="getMeal(type)"
        :meal="getMeal(type)!"
        :is-draggable="true"
        @edit="$emit('edit-meal', $event)"
        @remove="$emit('remove-meal', $event)"
      />
      <div
        v-else
        class="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
        @click="$emit('add-meal', type)"
      >
        <span class="text-sm text-gray-400">No meal planned</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Meal, MealType } from '@/types/meal';
import MealCard from './MealCard.vue';

interface Props {
  date: Date;
  meals: Record<MealType, Meal | undefined>;
}

const props = defineProps<Props>();
defineEmits<{
  (e: 'add-meal', type: MealType): void;
  (e: 'edit-meal', meal: Meal): void;
  (e: 'remove-meal', mealId: string): void;
}>();

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const getMeal = (type: MealType) => props.meals[type];

const formatMealType = (type: MealType) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};
</script>