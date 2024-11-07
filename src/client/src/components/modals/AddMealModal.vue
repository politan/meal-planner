<template>
    <BaseModal :title="isEditing ? 'Edit Meal' : 'Add New Meal'" @close="$emit('close')">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1"
          />
        </div>
  
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="type"
            v-model="form.type"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
  
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1"
          ></textarea>
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
          <div class="space-y-2">
            <div 
              v-for="(ing, index) in form.ingredients" 
              :key="index"
              class="flex gap-2"
            >
              <input
                v-model="ing.name"
                type="text"
                placeholder="Ingredient name"
                class="flex-1 rounded-md border border-gray-300 px-3 py-2"
              />
              <input
                v-model.number="ing.amount"
                type="number"
                placeholder="Amount"
                class="w-24 rounded-md border border-gray-300 px-3 py-2"
              />
              <input
                v-model="ing.unit"
                type="text"
                placeholder="Unit"
                class="w-20 rounded-md border border-gray-300 px-3 py-2"
              />
              <button
                type="button"
                @click="removeIngredient(index)"
                class="text-red-600 hover:text-red-800 px-2"
              >
                ×
              </button>
            </div>
          </div>
          <button
            type="button"
            @click="addIngredient"
            class="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Ingredient
          </button>
        </div>
  
        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {{ isEditing ? 'Save Changes' : 'Add Meal' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Meal, Ingredient, MealType } from '@/types/meal'
  import BaseModal from './BaseModal.vue'
  
  const props = withDefaults(defineProps<{
    meal?: Meal
    isEditing?: boolean
  }>(), {
    isEditing: false
  })
  
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', meal: Meal): void
  }>()
  
  const form = ref({
    name: props.meal?.name || '',
    type: props.meal?.type || 'breakfast' as MealType,
    description: props.meal?.description || '',
    ingredients: props.meal?.ingredients || [] as Ingredient[]
  })
  
  const addIngredient = () => {
    form.value.ingredients.push({ name: '', amount: 0, unit: '' })
  }
  
  const removeIngredient = (index: number) => {
    form.value.ingredients.splice(index, 1)
  }
  
  const handleSubmit = () => {
    const meal: Meal = {
      id: props.meal?.id || crypto.randomUUID(),
      ...form.value,
      date: props.meal?.date || new Date().toISOString(),
      isFavorite: props.meal?.isFavorite || false
    }
    emit('save', meal)
  }
  </script>