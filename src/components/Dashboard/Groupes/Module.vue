<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center gap-3">
      <UButton
          size="xs"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          @click="navigateTo(`/dashboard/groupes/${groupId}/modules`)"
      />
      <div class="flex-1">
        <p class="text-xs text-gray-400">Module</p>
        <p class="text-sm font-medium">{{ module.name }}</p>
      </div>
      <div
          v-if="linkedVm"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          @click="openVmWindow"
      >
        <div class="size-2 rounded-full bg-green-500 animate-pulse" />
        <p class="text-xs text-gray-500">VM : <span class="font-medium text-gray-700 dark:text-gray-300">{{ linkedVm.name }}</span></p>
        <UIcon name="i-heroicons-arrow-top-right-on-square" class="size-3 text-gray-400 ml-1" />
      </div>
    </div>

    <USeparator />

    <div class="flex gap-6">

      <!-- Sidebar items -->
      <!-- Sidebar items -->
      <div class="w-64 shrink-0 space-y-1 flex flex-col">
        <div
            v-for="item in module.items"
            :key="item.UUID"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
            :class="selectedItem?.UUID === item.UUID
        ? 'bg-gray-100 dark:bg-gray-800'
        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
            @click="selectedItem = item"
        >
          <UBadge
              :color="typeColor(item.type)"
              variant="soft"
              size="xs"
              :label="item.type"
              class="shrink-0"
          />
          <p class="text-xs truncate" :class="selectedItem?.UUID === item.UUID ? 'font-medium' : 'text-gray-500'">
            {{ item.title }}
          </p>
        </div>
      </div>

      <USeparator orientation="vertical" />

      <!-- Contenu -->
      <div class="flex-1 min-w-0">

        <!-- Aucun item sélectionné -->
        <div v-if="!selectedItem" class="flex flex-col items-center justify-center py-16 gap-3">
          <UIcon name="i-heroicons-document-text" class="size-8 text-gray-300" />
          <p class="text-sm text-gray-400">Sélectionnez un item pour commencer.</p>
        </div>

        <!-- Item sélectionné -->
        <div v-else class="space-y-4">

          <!-- Item header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UBadge
                  :color="typeColor(selectedItem.type)"
                  variant="soft"
                  size="sm"
                  :label="selectedItem.type"
              />
              <p class="text-base font-medium">{{ selectedItem.title }}</p>
            </div>

            <!-- Navigation prev/next -->
            <div class="flex items-center gap-1">
              <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-chevron-left"
                  :disabled="currentIndex === 0"
                  @click="prev"
              />
              <p class="text-xs text-gray-400">{{ currentIndex + 1 }} / {{ module.items.length }}</p>
              <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-chevron-right"
                  :disabled="currentIndex === module.items.length - 1"
                  @click="next"
              />
            </div>
          </div>

          <USeparator />

          <!-- Contenu de l'item (lecture seule) -->
          <UEditor
              v-model="selectedItem.content"
              content-type="html"
              :editable="false"
              class="w-full min-h-96"
          />

        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core'

interface ModuleItem {
  UUID: string
  title: string
  type: 'TP' | 'COURS' | 'EXERCICE'
  order: number
  content: string
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

const route   = useRoute()
const toast    = useToast()
const groupId = route.params.groupId  as string
const moduleId = route.params.moduleId as string

// -- Données statiques --
const module = ref<Module>({
  UUID:        moduleId,
  name:        'Module 1 - Réseaux',
  description: 'Introduction aux réseaux informatiques',
  requiresVm:  true,
  items: [
    {
      UUID: '1', title: 'Cours - Introduction TCP/IP', type: 'COURS', order: 0,
      content: '<h1>Introduction TCP/IP</h1><p>TCP/IP est la suite de protocoles fondamentale d\'Internet. Elle définit comment les données sont transmises sur un réseau.</p><h2>Les couches</h2><p>Le modèle TCP/IP comporte 4 couches : Application, Transport, Internet, Accès réseau.</p>'
    },
    {
      UUID: '2', title: 'TP - Configuration VLAN', type: 'TP', order: 1,
      content: '<h1>TP - Configuration VLAN</h1><p>Dans ce TP, vous allez configurer des VLANs sur un switch Cisco.</p><h2>Objectifs</h2><ul><li>Créer un VLAN</li><li>Assigner des ports</li><li>Vérifier la configuration</li></ul><h2>Étape 1</h2><p>Connectez-vous au switch via SSH et entrez en mode configuration.</p><pre><code>Switch> enable\nSwitch# configure terminal</code></pre>'
    },
    {
      UUID: '3', title: 'Exercice - Subnetting', type: 'EXERCICE', order: 2,
      content: '<h1>Exercice - Subnetting</h1><p>Découpez le réseau <strong>192.168.1.0/24</strong> en 4 sous-réseaux égaux.</p><h2>Questions</h2><ol><li>Quelle est le masque de sous-réseau ?</li><li>Combien d\'hôtes par sous-réseau ?</li><li>Quelle est l\'adresse de broadcast du premier sous-réseau ?</li></ol>'
    }
  ]
})

const linkedVm = ref<Vm | null>({
  UUID: 'vm1', name: 'Ubuntu-22.04', os: 'Ubuntu 22.04', status: 'running'
})

// -- Navigation --
const selectedItem = ref<ModuleItem | null>(module.value.items[0] ?? null)

const currentIndex = computed(() =>
    module.value.items.findIndex(i => i.UUID === selectedItem.value?.UUID)
)

function prev() {
  if (currentIndex.value <= 0) return
  selectedItem.value = module.value.items[currentIndex.value - 1]
}

function next() {
  if (currentIndex.value >= module.value.items.length - 1) return
  selectedItem.value = module.value.items[currentIndex.value + 1]
}

function typeColor(type: string) {
  if (type === 'TP')       return 'primary' as const
  if (type === 'COURS')    return 'success' as const
  if (type === 'EXERCICE') return 'warning' as const
  return 'neutral' as const
}

async function openVmWindow() {
  try {
    await invoke('open_vm_window', { node: 'pve', vmid: 100 })
  } catch (e: any) {
    toast.add({
      title: 'Terminal déjà ouvert',
      description: 'La fenêtre VM est déjà ouverte.',
      color: 'warning'
    })
  }
}
</script>