<template>
  <div class="space-y-4">
    <div ref="vncContainer" class="vnc-container" />
  </div>
</template>

<script setup lang="ts">
import RFB from 'novnc-core'

const {requestGet} = useApi()
const vncContainer = ref<HTMLDivElement | null>(null)
const rfb = ref<any>(null)

const props = defineProps<{
  node: string
  vmid: number
}>()

onMounted(async () => {
  // Récupère l'URL VNC depuis ton backend
  const { data, status } = await requestGet({
    version: 1,
    route: `proxmox/${props.node}/${props.vmid}/vnc`,
  })

  console.log(data, status)

  if (!status || !data) return
  const { url, ticket } = data.data
  if (!url || !ticket) return

  console.log("Terminal")
  console.log(url, ticket)

  const runtimeConfig = useRuntimeConfig()
  const apiUrl = runtimeConfig.public.api_url
  const wsUrl = apiUrl.replace('http', 'ws').replace('https', 'wss')

  const rfb = new RFB(vncContainer.value, `${wsUrl}/v1?url=${encodeURIComponent(url)}`, {
    credentials: {
      password: ticket
    },
  })

  rfb.value.scaleViewport = true
  rfb.value.resizeSession = true

  rfb.value.addEventListener('connect', () => {
    console.log('VNC connecté')
  })

  rfb.value.addEventListener('disconnect', (e: any) => {
    console.log('VNC déconnecté', e.detail)
  })
})

onUnmounted(() => {
  rfb.value?.disconnect()
})
</script>

<style scoped>
.vnc-container {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: #000;
}
</style>