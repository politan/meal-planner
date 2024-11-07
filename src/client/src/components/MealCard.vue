<template>
  <div
    class="bg-white rounded-lg border border-gray-200 p-3 relative group"
    :class="{ 'cursor-move': isDraggable }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex justify-between items-start">
      <div>
        <h4 class="font-medium text-gray-900">{{ meal.name }}</h4>
        <p class="text-sm text-gray-500 mt-1">{{ meal.description }}</p>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="toggleFavorite"
          class="text-yellow-500 hover:text-yellow-600"
          :title="meal.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <Star :class="{ 'fill-current': meal.isFavorite }" class="w-5 h-5" />
        </button>
        <button
          @click="$emit('edit', meal)"
          class="text-gray-400 hover:text-gray-600"
          title="Edit meal"
        >
          <Pencil class="w-5 h-5" />
        </button>
        <button
          @click="handleRemove"
          class="text-gray-400 hover:text-red-600"
          title="Remove meal"
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="mt-3">
      <details class="text-sm">
        <summary class="text-gray-600 cursor-pointer hover:text-gray-800">
          Ingredients ({{ meal.ingredients.length }})
        </summary>
        <ul class="mt-2 space-y-1">
          <li 
            v-for="ing in meal.ingredients" 
            :key="ing.name"
            class="text-gray-600"
          >
            {{ ing.amount }} {{ ing.unit }} {{ ing.name }}
          </li>
        </ul>
      </details>
    </div>

    <div 
      v-if="isDragging"
      class="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 rounded-lg"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Star, Pencil, Trash2 } from 'lucide-vue-next';
import type { Meal } from '@/types/meal';
import { useMealStore } from '@/stores/mealStore';

const props = withDefaults(defineProps<{
  meal: Meal;  // This is now required and cannot be undefined
  isDraggable?: boolean;
}>(), {
  isDraggable: false
});

const store = useMealStore();
const isDragging = ref(false);

const emit = defineEmits<{
  (e: 'edit', meal: Meal): void;
  (e: 'remove', mealId: string): void;
}>();

const toggleFavorite = () => {
  store.toggleFavorite(props.meal);
};

const handleRemove = () => {
  if (confirm('Are you sure you want to remove this meal?')) {
    emit('remove', props.meal.id);
  }
};

const handleDragStart = (event: DragEvent) => {
  if (!props.isDraggable) return;
  
  isDragging.value = true;
  event.dataTransfer?.setData('application/json', JSON.stringify(props.meal));
};

const handleDragEnd = () => {
  isDragging.value = false;
};
</script>