<template>
    <div class="text-center py-12">
      <div class="rounded-lg border-2 border-dashed border-gray-300 px-6 py-8">
        <div class="flex justify-center">
          <component
            :is="icon"
            class="h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <h3 class="mt-4 text-sm font-medium text-gray-900">{{ title }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ description }}</p>
        <div class="mt-6">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            @click="$emit('action')"
          >
            {{ actionText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { type LucideIcon } from 'lucide-vue-next';
  
  defineProps<{
    icon: LucideIcon;
    title: string;
    description: string;
    actionText: string;
  }>();
  
  defineEmits<{
    (e: 'action'): void;
  }>();
  </script>