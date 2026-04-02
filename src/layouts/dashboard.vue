<template>
  <div class="bg-dark h-screen w-screen">
    <UDashboardGroup>
      <DashboardSidebar />
      <UDashboardPanel>
        <template #header>
          <DashboardNavbar />
        </template>
        <template #body>
          <NuxtPage />
        </template>
        <template #footer>
          <ModalGroupCode />
        </template>
      </UDashboardPanel>
    </UDashboardGroup>
  </div>
</template>

<script setup lang="ts">

</script>
