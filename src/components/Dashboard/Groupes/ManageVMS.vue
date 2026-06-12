<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="space-y-1">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Machines virtuelles</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">Vue d'ensemble des VMs du groupe.</p>
    </div>

    <USeparator />

    <!-- Empty state -->
    <div v-if="vms.length === 0" class="text-center py-8">
      <p class="text-sm text-gray-400">Aucune VM dans ce groupe.</p>
    </div>

    <!-- Table -->
    <UTable :data="vms" :columns="columns">
      <template #member-cell="{ row }">
        <div class="flex items-center gap-2">
          <UAvatar :alt="`${row.original.member.firstName} ${row.original.member.lastName}`" size="xs" />
          <span class="text-sm">{{ row.original.member.firstName }} {{ row.original.member.lastName }}</span>
        </div>
      </template>

      <template #vm-cell="{ row }">
        <div class="flex items-center gap-2">
          <UIcon
              :name="row.original.type === 'LYCEE' ? 'i-heroicons-server' : 'i-heroicons-computer-desktop'"
              class="size-4 text-gray-400 shrink-0"
          />
          <div>
            <p class="text-sm font-medium">{{ row.original.name }}</p>
            <p class="text-xs text-gray-400">
              {{ row.original.type === 'LYCEE' ? `${row.original.node} / ${row.original.vmid}` : row.original.ip }}
            </p>
          </div>
        </div>
      </template>

      <template #type-cell="{ row }">
        <UBadge
            :color="row.original.type === 'LYCEE' ? 'primary' : 'neutral'"
            variant="soft"
            size="xs"
            :label="row.original.type === 'LYCEE' ? 'Lycée' : 'Local'"
        />
      </template>

      <template #proxies-cell="{ row }">
        <div class="flex items-center gap-2">
          <p class="text-xs text-gray-400">{{ row.original.proxies.length }} port(s) exposé(s)</p>
          <UButton
              v-if="row.original.proxies.length > 0"
              size="xs"
              variant="ghost"
              icon="i-heroicons-eye"
              label="Voir"
              @click="openProxies(row.original)"
          />
        </div>
      </template>
    </UTable>

    <!-- Modal proxies -->
    <UModal v-model:open="proxiesModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm">Ports exposés</p>
                <p class="text-xs text-gray-400">
                  {{ selectedVm?.member.firstName }} {{ selectedVm?.member.lastName }} · {{ selectedVm?.name }}
                </p>
              </div>
              <UButton icon="i-heroicons-x-mark" variant="ghost" size="xs" @click="proxiesModalOpen = false" />
            </div>
          </template>

          <div class="space-y-2">
            <div
                v-for="proxy in selectedVm?.proxies"
                :key="proxy.UUID"
                class="flex items-center gap-4 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div class="flex items-center gap-3 flex-1">
                <div class="text-center shrink-0">
                  <p class="text-xs text-gray-400">Port VM</p>
                  <p class="text-sm font-mono font-medium">:{{ proxy.internalPort }}</p>
                </div>

                <UIcon name="i-heroicons-arrow-right" class="size-4 text-gray-400 shrink-0" />

                <div class="text-center shrink-0">
                  <p class="text-xs text-gray-400">Accès</p>
                  <p class="text-sm font-mono font-medium text-primary-500">{{ proxy.exposedIp }}:{{ proxy.exposedPort }}</p>
                </div>

                <UBadge v-if="proxy.description" variant="soft" color="neutral" size="xs" :label="proxy.description" />
              </div>

              <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-clipboard"
                  @click="copyProxy(proxy)"
              />
            </div>
          </div>
        </UCard>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
interface Proxy {
  UUID: string
  internalPort: number
  exposedIp: string
  exposedPort: number
  description: string
}

interface Member {
  UUID: string
  firstName: string
  lastName: string
}

interface VmBase {
  UUID: string
  name: string
  type: 'LYCEE' | 'LOCAL'
  member: Member
  proxies: Proxy[]
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

const toast = useToast()

// -- Données statiques --
const vms = ref<Vm[]>([
  {
    UUID: '1', name: 'Debian-Kilian', type: 'LYCEE', node: 'pve', vmid: 100,
    member: { UUID: '1', firstName: 'Kilian', lastName: 'F' },
    proxies: [
      { UUID: 'p1', internalPort: 22,   exposedIp: '10.0.0.1', exposedPort: 32001, description: 'SSH' },
      { UUID: 'p2', internalPort: 80,   exposedIp: '10.0.0.1', exposedPort: 32002, description: 'HTTP' }
    ]
  },
  {
    UUID: '2', name: 'Debian-Jean', type: 'LYCEE', node: 'pve', vmid: 101,
    member: { UUID: '2', firstName: 'Jean', lastName: 'Dupont' },
    proxies: [
      { UUID: 'p3', internalPort: 22, exposedIp: '10.0.0.1', exposedPort: 32003, description: 'SSH' }
    ]
  },
  {
    UUID: '3', name: 'PC-Marie', type: 'LOCAL', ip: '192.168.1.52',
    member: { UUID: '3', firstName: 'Marie', lastName: 'Martin' },
    proxies: []
  }
])

const columns = [
  { id: 'member',  accessorKey: 'member',  header: 'Élève' },
  { id: 'vm',      accessorKey: 'vm',      header: 'VM' },
  { id: 'type',    accessorKey: 'type',    header: 'Type' },
  { id: 'proxies', accessorKey: 'proxies', header: 'Ports exposés' }
]

// -- Modal proxies --
const proxiesModalOpen = ref(false)
const selectedVm       = ref<Vm | null>(null)

function openProxies(vm: Vm) {
  selectedVm.value       = vm
  proxiesModalOpen.value = true
}

async function copyProxy(proxy: Proxy) {
  await navigator.clipboard.writeText(`${proxy.exposedIp}:${proxy.exposedPort}`)
  toast.add({ title: 'Adresse copiée !', color: 'success' })
}
</script>