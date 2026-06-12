<template>
<div>
  <DashboardTerminalControl :node="node as string || ''" :vmid="parseInt(vmid as string || '')"/>
</div>
</template>

<script setup lang="ts">

const { query } = useRoute()
const { node, vmid } = query

console.log(node, vmid)
</script>