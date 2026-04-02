<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
      Terminal
    </h1>
    <div v-if="vmid && node">
      <DashboardTerminalControl :node="node as string" :vmid="parseInt(vmid as string) || 0"/>
<!--      <DashboardTerminal :node="node as string" :vmid="parseInt(vmid as string) || 0"/>-->
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

// recupere les params
const route = useRoute()
const node = route.params.node
const vmid = route.params.vmid

if (!node || !vmid) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>