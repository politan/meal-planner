<template>
    <div
      class="h-full w-full"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @dragenter.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
    >
      <slot :is-drag-over="isDragOver" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { Meal } from '@/types/meal';
  
  const props = defineProps<{
    acceptedTypes?: string[];
  }>();
  
  const emit = defineEmits<{
    (e: 'drop', meal: Meal): void;
  }>();
  
  const isDragOver = ref(false);
  
  const handleDrop = (event: DragEvent) => {
    isDragOver.value = false;
    const data = event.dataTransfer?.getData('application/json');
    if (!data) return;
  
    try {
      const meal = JSON.parse(data) as Meal;
      if (props.acceptedTypes && !props.acceptedTypes.includes(meal.type)) return;
      emit('drop', meal);
    } catch (error) {
      console.error('Invalid drag data:', error);
    }
  };
  </script>