<template>
    <div class="max-h-[60vh] overflow-y-auto">
      <div v-if="!shoppingList.length" class="text-center py-4 text-gray-500">
        No items in shopping list
      </div>
      
      <div v-else class="divide-y">
        <div 
          v-for="item in shoppingList" 
          :key="item.ingredient"
          class="py-2 flex justify-between items-center"
        >
          <span class="text-gray-900">{{ item.ingredient }}</span>
          <span class="text-gray-600">{{ item.totalAmount }} {{ item.unit }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useMealStore } from '@/stores/mealStore';
  
  const store = useMealStore();
  const shoppingList = computed(() => store.shoppingList?.items || []);
  </script>