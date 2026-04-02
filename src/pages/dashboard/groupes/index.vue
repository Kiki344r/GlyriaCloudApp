<template>
  <div>
    <UDashboardSidebarToggle
      variant="subtle"
      color="primary"
      class="absolute top-5 left-5 transform -translate-x-1/2 -translate-y-1/2"
    />
    <DashboardGroupesList />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>
