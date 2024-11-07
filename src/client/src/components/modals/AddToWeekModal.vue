<template>
  <BaseModal title="Add to Week" @close="$emit('close')">
    <div class="space-y-4">
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
        <input
          id="date"
          v-model="selectedDate"
          type="date"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1"
        />
      </div>

      <div>
        <label for="mealType" class="block text-sm font-medium text-gray-700">Meal Type</label>
        <select
          id="mealType"
          v-model="selectedType"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button
          @click="$emit('close')"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="handleAdd"
          :disabled="!isValid"
          class="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          Add to Week
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Meal, MealType } from '@/types/meal'
import BaseModal from './BaseModal.vue'

defineProps<{
  meal: Meal
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add', date: Date, type: MealType): void
}>()

const selectedDate = ref('')
const selectedType = ref<MealType>('breakfast')

const isValid = computed(() => selectedDate.value && selectedType.value)

const handleAdd = () => {
  if (isValid.value) {
    emit('add', new Date(selectedDate.value), selectedType.value)
  }
}
</script>