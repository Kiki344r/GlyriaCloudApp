<template>
  <UDashboardNavbar
      class="bg-dark border-b border-white/5"
  >
    <template #left>
      <UDashboardSidebarCollapse />
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-gray-600 tracking-tighter uppercase">Console</span>
        <span class="text-gray-800">/</span>
        <h1 class="text-sm font-medium text-white tracking-tight">Dashboard</h1>
      </div>
    </template>
  </UDashboardNavbar>
</template>

<script setup lang="ts">
// Plus besoin de refs de recherche ou de ping complexe ici.
</script>