<template>
    <BaseModal title="Shopping List" @close="$emit('close')">
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
  
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="$emit('close')"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            @click="handleExport"
            class="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </template>
    </BaseModal>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useMealStore } from '@/stores/mealStore'
  import BaseModal from './BaseModal.vue'
  
  const store = useMealStore()
  
  const shoppingList = computed(() => store.shoppingList?.items || [])
  
  defineEmits<{
    (e: 'close'): void
  }>()
  
  const handleExport = () => {
    const content = shoppingList.value
      .map(item => `${item.ingredient}: ${item.totalAmount} ${item.unit}`)
      .join('\n')
  
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shopping-list.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
  </script>