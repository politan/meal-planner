<template>
    <BaseModal :title="'Edit Meal'" @close="$emit('close')">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Similar to AddMealModal but with pre-filled values -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
  
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="type"
            v-model="form.type"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
  
        <!-- Add other fields similar to AddMealModal -->
  
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Save Changes
          </button>
        </div>
      </form>
    </BaseModal>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { Meal, MealType } from '@/types/meal';
  import BaseModal from './BaseModal.vue';
  
  const props = defineProps<{
    meal: Meal;
  }>();
  
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', meal: Meal): void;
  }>();
  
  const form = ref({
    name: props.meal.name,
    type: props.meal.type as MealType,
    description: props.meal.description,
    ingredients: [...props.meal.ingredients]
  });
  
  const handleSubmit = () => {
    emit('save', {
      ...props.meal,
      ...form.value
    });
  };
  </script>