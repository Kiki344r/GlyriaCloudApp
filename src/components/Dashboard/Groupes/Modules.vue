<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="space-y-1">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Modules</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ modules?.length || '0' }} module(s) disponible(s) dans ce groupe.</p>
    </div>

    <USeparator />

    <!-- Empty state -->
    <div v-if="!modules" class="text-center py-8">
      <p class="text-sm text-gray-400">Aucun module disponible dans ce groupe.</p>
    </div>

    <!-- Liste des modules -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
          v-for="module in modules"
          :key="module.UUID"
          class="flex flex-col gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      >
        <!-- Module header -->
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm font-medium">{{ module.name }}</p>
            <p class="text-xs text-gray-400">{{ module.description }}</p>
          </div>
          <div class="flex flex-col items-end gap-1 shrink-0">
            <UBadge v-if="module.requiresVm" size="xs" variant="soft" color="warning" label="VM requise" />
            <p class="text-xs text-gray-400">{{ module.items.length }} item(s)</p>
          </div>
        </div>

        <!-- VM liée -->
        <div
            v-if="module.requiresVm && linkedVms[module.UUID]"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div class="size-2 rounded-full bg-green-500 animate-pulse" />
          <p class="text-xs text-gray-500">VM liée : <span class="font-medium text-gray-700 dark:text-gray-300">{{ linkedVms[module.UUID].name }}</span></p>
          <UButton
              size="xs"
              variant="ghost"
              color="error"
              icon="i-heroicons-x-mark"
              class="ml-auto"
              @click="unlinkVm(module.UUID)"
          />
        </div>

        <!-- Footer -->
        <div class="flex items-center gap-2 mt-auto">
          <!-- Lier une VM si requise et pas encore liée -->
          <UButton
              v-if="module.requiresVm && !linkedVms[module.UUID]"
              size="sm"
              variant="soft"
              color="warning"
              icon="i-heroicons-server"
              label="Lier une VM"
              @click="openLinkVm(module)"
          />

          <!-- Commencer -->
          <UButton
              size="sm"
              :disabled="module.requiresVm && !linkedVms[module.UUID]"
              icon="i-heroicons-play"
              label="Commencer"
              class="ml-auto"
              @click="navigateTo(`/dashboard/groupes/${groupId}/modules/${module.UUID}`)"
          />
        </div>
      </div>
    </div>

    <!-- Modal lier une VM -->
    <UModal v-model:open="linkVmOpen">
      <template #content>
        <UCard>
          <template #header>
            <p class="font-medium">Lier une VM — {{ selectedModule?.name }}</p>
          </template>

          <div class="space-y-3">
            <p class="text-xs text-gray-400">Sélectionnez une VM à utiliser pour ce module.</p>

            <div
                v-for="vm in availableVms"
                :key="vm.UUID"
                class="flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-colors"
                :class="selectedVm?.UUID === vm.UUID
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
                @click="selectedVm = vm"
            >
              <div class="flex items-center gap-3">
                <div class="size-2 rounded-full" :class="vm.status === 'running' ? 'bg-green-500' : 'bg-gray-400'" />
                <div>
                  <p class="text-sm font-medium">{{ vm.name }}</p>
                  <p class="text-xs text-gray-400">{{ vm.os }} · {{ vm.status === 'running' ? 'En cours' : 'Arrêtée' }}</p>
                </div>
              </div>
              <UIcon
                  v-if="selectedVm?.UUID === vm.UUID"
                  name="i-heroicons-check-circle"
                  class="size-4 text-primary-500"
              />
            </div>

            <div v-if="availableVms.length === 0" class="text-center py-4">
              <p class="text-xs text-gray-400">Aucune VM disponible. Créez une VM depuis le dashboard.</p>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" color="neutral" label="Annuler" @click="linkVmOpen = false" />
              <UButton
                  label="Lier la VM"
                  :disabled="!selectedVm"
                  :loading="linkVmLoading"
                  @click="confirmLinkVm"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
interface ModuleItem {
  UUID: string
  title: string
  type: 'TP' | 'COURS' | 'EXERCICE'
  order: number
}

interface Module {
  UUID: string
  name: string
  description: string
  requiresVm: boolean
  items: ModuleItem[]
}

interface Vm {
  UUID: string
  name: string
  os: string
  status: 'running' | 'stopped'
}

const route = useRoute()
const {getModules} = useGroups()
const groupId = route.params.groupId as string

// -- Données statiques --
const modules = ref<Module[]>([])

const fetchModules = await getModules(groupId)
modules.value = fetchModules

const availableVms = ref<Vm[]>([
  { UUID: 'vm1', name: 'Ubuntu-22.04',   os: 'Ubuntu 22.04', status: 'running' },
  { UUID: 'vm2', name: 'Debian-12',      os: 'Debian 12',    status: 'stopped' },
  { UUID: 'vm3', name: 'Windows-Server', os: 'Windows 2022', status: 'stopped' }
])

// UUID module → VM liée
const linkedVms = ref<Record<string, Vm>>({})

// -- Lier une VM --
const linkVmOpen     = ref(false)
const linkVmLoading  = ref(false)
const selectedModule = ref<Module | null>(null)
const selectedVm     = ref<Vm | null>(null)

function openLinkVm(module: Module) {
  selectedModule.value = module
  selectedVm.value     = null
  linkVmOpen.value     = true
}

async function confirmLinkVm() {
  if (!selectedModule.value || !selectedVm.value) return
  linkVmLoading.value = true

  // TODO: appel API → await requestPost(...)
  await new Promise(r => setTimeout(r, 400))

  linkedVms.value[selectedModule.value.UUID] = selectedVm.value

  linkVmLoading.value = false
  linkVmOpen.value    = false
  selectedModule.value = null
  selectedVm.value    = null
}

function unlinkVm(moduleUUID: string) {
  delete linkedVms.value[moduleUUID]
}
</script>