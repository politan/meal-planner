<template>
    <div class="min-h-[50vh] flex items-center justify-center">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p class="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Go to Home
        </router-link>
      </div>
    </div>
  </template>