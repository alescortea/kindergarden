<template>
  <NuxtLayout v-if="shouldShowLayout">
    <NuxtPage />
  </NuxtLayout>
  <NuxtPage v-else />
</template>

<script setup>
// Global app setup
const route = useRoute()

// Check if current page should use layout
// Pages with layout: false (like /login) should not use layout
const shouldShowLayout = computed(() => {
  // Check if route is login page (which has layout: false)
  if (route.path === '/login') {
    return false
  }
  // For other pages, use layout
  return true
})
</script>

<style>
/* Global styles are in assets/css/main.css */
</style>



