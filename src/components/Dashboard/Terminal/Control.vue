<template>
  <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="size-2 rounded-full" :class="statusUi.dot" />
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ node }} / {{ vmid }}
        </span>
        <UBadge :color="statusUi.color" variant="subtle" size="sm">
          {{ statusUi.label }}
        </UBadge>
      </div>

      <UButton
          size="xs"
          variant="ghost"
          color="neutral"
          icon="i-heroicons-arrow-path"
          :loading="loadingStatus"
          @click="fetchStatus"
      />
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap gap-2">
      <UButton
          v-for="action in actions"
          :key="action.key"
          :icon="action.icon"
          :color="action.color"
          :variant="action.variant"
          :disabled="action.disabled(status) || !!pendingAction"
          :loading="pendingAction === action.key"
          size="sm"
          square
          :title="action.label"
          @click="runAction(action.key)"
      />
    </div>

    <!-- Légende action hover / label sous les boutons -->
    <p class="text-xs text-gray-400 dark:text-gray-600">
      {{ pendingAction ? `${pendingAction} en cours...` : activeLabel ?? '&nbsp;' }}
    </p>

    <p v-if="lastError" class="text-xs text-red-500">
      {{ lastError }}
    </p>
    <UCard v-if="statusUi.label === 'En cours'">
      <DashboardTerminal :node="node" :vmid="vmid"/>
    </UCard>
  </div>
</template>

<script setup lang="ts">
type VmStatus = 'running' | 'stopped' | 'paused' | 'unknown'
type VmAction = 'start' | 'stop' | 'shutdown' | 'reboot' | 'reset' | 'suspend' | 'resume'

const props = defineProps<{
  node: string
  vmid: number
}>()

const { requestPost } = useApi()

const status = ref<VmStatus>('unknown')
const loadingStatus = ref(false)
const pendingAction = ref<VmAction | null>(null)
const lastError = ref<string | null>(null)
const activeLabel = ref<string | null>(null)
let refreshTimer: ReturnType<typeof setInterval> | null = null

const statusUi = computed(() => {
  if (status.value === 'running') return { label: 'En cours',  color: 'success' as const, dot: 'bg-green-500 animate-pulse' }
  if (status.value === 'stopped') return { label: 'Arrêtée',   color: 'neutral' as const, dot: 'bg-gray-400' }
  if (status.value === 'paused')  return { label: 'En pause',  color: 'warning' as const, dot: 'bg-yellow-400' }
  return                                 { label: 'Inconnu',   color: 'error'   as const, dot: 'bg-red-400' }
})

const actions: Array<{
  key: VmAction
  label: string
  icon: string
  color: 'primary' | 'neutral' | 'success' | 'warning' | 'error'
  variant: 'solid' | 'soft' | 'ghost' | 'outline'
  disabled: (s: VmStatus) => boolean
}> = [
  { key: 'start',    label: 'Démarrer',  icon: 'i-heroicons-play',         color: 'success', variant: 'solid',   disabled: s => s === 'running' },
  { key: 'shutdown', label: 'Shutdown',  icon: 'i-heroicons-power',         color: 'warning', variant: 'soft',    disabled: s => s !== 'running' },
  { key: 'stop',     label: 'Forcer',    icon: 'i-heroicons-stop',          color: 'error',   variant: 'solid',   disabled: s => s !== 'running' },
  { key: 'reboot',   label: 'Reboot',    icon: 'i-heroicons-arrow-path',    color: 'primary', variant: 'soft',    disabled: s => s !== 'running' }
]

function normalizeStatus(raw: unknown): VmStatus {
  if (typeof raw !== 'string') return 'unknown'
  const v = raw.toLowerCase()
  if (v.includes('run'))                        return 'running'
  if (v.includes('stop'))                       return 'stopped'
  if (v.includes('pause') || v.includes('suspend')) return 'paused'
  return 'unknown'
}

function pickStatus(payload: any): VmStatus {
  for (const candidate of [
    payload?.data?.status,
    payload?.data?.data?.status,
    payload?.status,
    payload?.data?.qmpstatus,
    payload?.data?.data?.qmpstatus
  ]) {
    const n = normalizeStatus(candidate)
    if (n !== 'unknown') return n
  }
  return 'unknown'
}

async function fetchStatus() {
  loadingStatus.value = true
  lastError.value = null
  const { status: ok, data, message } = await requestPost({ version: 1, route: `proxmox/${props.node}/${props.vmid}/action`, data: { action: "status"} }, false)
  loadingStatus.value = false
  status.value = ok ? pickStatus(data) : 'unknown'
  if (!ok) lastError.value = typeof message === 'string' ? message : 'Impossible de récupérer le statut VM.'
}

async function waitAndRefreshStatus() {
  for (const delay of [1200, 2200, 3200]) {
    await new Promise(r => setTimeout(r, delay))
    await fetchStatus()
  }
}

async function runAction(action: VmAction) {
  pendingAction.value = action
  lastError.value = null
  const { status: ok, message } = await requestPost({ version: 1, route: `proxmox/${props.node}/${props.vmid}/action/`, data: { action } })
  pendingAction.value = null
  if (!ok) {
    lastError.value = typeof message === 'string' ? message : `Action ${action} impossible.`
    return
  }
  await waitAndRefreshStatus()
}

onMounted(async () => {
  await fetchStatus()
  refreshTimer = setInterval(fetchStatus, 10000)
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})
</script>