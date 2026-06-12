<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="navigateTo(`/dashboard/groupes/${groupId}/vms`)"
        />
        <div>
          <p class="text-xs text-gray-400">Proxies — {{ vm.name }}</p>
          <p class="text-sm font-medium">Gestion des ports exposés</p>
        </div>
      </div>

      <ModalDefault
          v-model:open="createOpen"
          v-model:loading="createLoading"
          v-model:disable-close="createDisableClose"
          title="Exposer un port"
          description="Choisissez le port interne de la VM à exposer via le proxy TCP."
          :button="{ label: 'Exposer un port', icon: 'i-heroicons-plus' }"
          :zod-schema="createSchema"
          :zod-state="createState"
          @submit="onCreateProxy"
          @close="createOpen = false"
      >
        <UFormField label="Port interne de la VM" name="port">
          <UInput
              v-model="createState.port"
              type="number"
              placeholder="Ex: 22, 80, 3306..."
              class="w-full"
          />
        </UFormField>

        <UFormField label="Description (optionnel)" name="description">
          <UInput
              v-model="createState.description"
              placeholder="Ex: SSH, HTTP, MySQL..."
              class="w-full"
          />
        </UFormField>

        <UAlert
            color="info"
            variant="soft"
            icon="i-heroicons-information-circle"
            title="Proxy TCP"
            description="Le serveur central va exposer ce port et vous fournira une IP + PORT publics pour y accéder depuis le réseau du lycée."
        />
      </ModalDefault>
    </div>

    <USeparator />

    <!-- Info VM -->
    <div class="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <UIcon
          :name="vm.type === 'LYCEE' ? 'i-heroicons-server' : 'i-heroicons-computer-desktop'"
          class="size-4 text-gray-400 shrink-0"
      />
      <div class="flex-1">
        <p class="text-sm font-medium">{{ vm.name }}</p>
        <p class="text-xs text-gray-400">
          {{ vm.type === 'LYCEE' ? `Proxmox · ${vm.node} / ${vm.vmid}` : `Local · ${vm.ip}` }}
        </p>
      </div>
      <UBadge
          :color="vm.type === 'LYCEE' ? 'primary' : 'neutral'"
          variant="soft"
          size="xs"
          :label="vm.type === 'LYCEE' ? 'Lycée' : 'Local'"
      />
    </div>

    <!-- Empty state -->
    <div v-if="proxies.length === 0" class="text-center py-8">
      <p class="text-sm text-gray-400">Aucun port exposé pour cette VM.</p>
    </div>

    <!-- Liste des proxies -->
    <div class="space-y-3">
      <div
          v-for="proxy in proxies"
          :key="proxy.UUID"
          class="flex items-center gap-4 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      >
        <!-- Port interne → Port exposé -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="text-center shrink-0">
            <p class="text-xs text-gray-400">Port VM</p>
            <p class="text-sm font-mono font-medium">:{{ proxy.internalPort }}</p>
          </div>

          <UIcon name="i-heroicons-arrow-right" class="size-4 text-gray-400 shrink-0" />

          <div class="text-center shrink-0">
            <p class="text-xs text-gray-400">Exposé sur</p>
            <p class="text-sm font-mono font-medium text-primary-500">{{ proxy.exposedIp }}:{{ proxy.exposedPort }}</p>
          </div>

          <div v-if="proxy.description" class="ml-2">
            <UBadge variant="soft" color="neutral" size="xs" :label="proxy.description" />
          </div>
        </div>

        <!-- Copier -->
        <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-clipboard"
            @click="copyProxy(proxy)"
        />

        <!-- Supprimer -->
        <ModalDefault
            v-model:open="deleteOpen"
            v-model:loading="deleteLoading"
            v-model:disable-close="deleteDisableClose"
            title="Supprimer le proxy"
            :description="selectedProxy ? `Voulez-vous vraiment supprimer le proxy :${selectedProxy.internalPort} → ${selectedProxy.exposedIp}:${selectedProxy.exposedPort} ?` : ''"
            :button="{ label: '', icon: 'i-heroicons-trash', color: 'error', variant: 'ghost' }"
            :zod-schema="deleteSchema"
            :zod-state="deleteState"
            @click="selectedProxy = proxy"
            @submit="onDeleteProxy"
            @close="deleteOpen = false"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface Proxy {
  UUID: string
  internalPort: number
  exposedIp: string
  exposedPort: number
  description: string
}

interface VmBase {
  UUID: string
  name: string
  type: 'LYCEE' | 'LOCAL'
}

interface VmLycee extends VmBase {
  type: 'LYCEE'
  node: string
  vmid: number
}

interface VmLocal extends VmBase {
  type: 'LOCAL'
  ip: string
}

type Vm = VmLycee | VmLocal

const route   = useRoute()
const toast   = useToast()

const groupId = route.params.groupId as string
const vmId    = route.params.vmId    as string

// -- Données statiques --
const vm = ref<Vm>({
  UUID: vmId,
  name: 'Debian-Kilian',
  type: 'LYCEE',
  node: 'pve',
  vmid: 100
})

const proxies = ref<Proxy[]>([
  { UUID: '1', internalPort: 22,   exposedIp: '10.0.0.1', exposedPort: 32001, description: 'SSH' },
  { UUID: '2', internalPort: 80,   exposedIp: '10.0.0.1', exposedPort: 32002, description: 'HTTP' },
  { UUID: '3', internalPort: 3306, exposedIp: '10.0.0.1', exposedPort: 32003, description: 'MySQL' }
])

// -- Créer un proxy --
const createOpen         = ref(false)
const createLoading      = ref(false)
const createDisableClose = ref(false)

const createSchema = z.object({
  port:        z.number({ invalid_type_error: 'Le port est requis' }).min(1).max(65535),
  description: z.string().optional()
})

const createState = reactive({
  port:        null as number | null,
  description: ''
})

async function onCreateProxy() {
  createLoading.value      = true
  createDisableClose.value = true

  // TODO: appel API → const { data } = await requestPost(...)
  // Le back retourne exposedIp + exposedPort
  await new Promise(r => setTimeout(r, 500))

  // Simulation de la réponse du back
  proxies.value.push({
    UUID:         crypto.randomUUID(),
    internalPort: createState.port ?? 0,
    exposedIp:    '10.0.0.1',
    exposedPort:  32000 + Math.floor(Math.random() * 1000),
    description:  createState.description
  })

  toast.add({ title: `Port :${createState.port} exposé`, color: 'success' })

  createState.port        = null
  createState.description = ''
  createLoading.value      = false
  createDisableClose.value = false
  createOpen.value         = false
}

// -- Supprimer un proxy --
const deleteOpen         = ref(false)
const deleteLoading      = ref(false)
const deleteDisableClose = ref(false)
const selectedProxy      = ref<Proxy | null>(null)

const deleteSchema = z.object({})
const deleteState  = reactive({})

async function onDeleteProxy() {
  if (!selectedProxy.value) return
  deleteLoading.value      = true
  deleteDisableClose.value = true

  // TODO: appel API → await requestDelete(...)
  await new Promise(r => setTimeout(r, 500))

  proxies.value = proxies.value.filter(p => p.UUID !== selectedProxy.value!.UUID)

  toast.add({ title: 'Proxy supprimé', color: 'success' })
  selectedProxy.value      = null
  deleteLoading.value      = false
  deleteDisableClose.value = false
  deleteOpen.value         = false
}

// -- Copier --
async function copyProxy(proxy: Proxy) {
  await navigator.clipboard.writeText(`${proxy.exposedIp}:${proxy.exposedPort}`)
  toast.add({ title: 'Adresse copiée !', color: 'success' })
}
</script>