<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Modules</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ modules?.length || '0' }} module(s) dans ce groupe.</p>
      </div>
      <ModalDefault
          v-model:open="createOpen"
          v-model:loading="createLoading"
          v-model:disable-close="createDisableClose"
          title="Créer un module"
          description="Un module regroupe plusieurs TP, Cours ou Exercices."
          :button="{ label: 'Créer un module', icon: 'i-heroicons-plus' }"
          :zod-schema="createSchema"
          :zod-state="createState"
          @submit="onCreateModule"
          @close="createOpen = false"
      >
        <UFormField label="Nom du module" name="name">
          <UInput v-model="createState.name" placeholder="Ex: Module 1 - Réseaux" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="createState.description" placeholder="Description optionnelle..." class="w-full" />
        </UFormField>

        <UFormField label="VM requise" name="requiresVm">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-400">Les élèves devront lier une VM pour commencer ce module.</p>
            <UCheckbox v-model="createState.requiresVm" />
          </div>
        </UFormField>
      </ModalDefault>
    </div>

    <USeparator />

    <!-- Liste des modules -->
    <div class="space-y-3">
      <div
          v-for="module in modules"
          :key="module.UUID"
          class="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800"
      >
        <div class="flex items-center gap-3">
          <div class="size-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <UIcon name="i-heroicons-folder" class="size-4 text-gray-500" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium">{{ module.name }}</p>
              <UBadge v-if="module.requiresVm" size="xs" variant="soft" color="warning" label="VM requise" />
            </div>
            <p class="text-xs text-gray-400">{{ module.items.length }} item(s) · {{ formatDate(module.createdAt) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton
              size="xs"
              variant="ghost"
              icon="i-heroicons-cog-6-tooth"
              label="Gérer"
              @click="navigateTo(`/dashboard/groupes/${groupId}/manage-modules/${module.UUID}`)"
          />
          <ModalDefault
              v-model:open="deleteOpen"
              v-model:loading="deleteLoading"
              v-model:disable-close="deleteDisableClose"
              title="Supprimer le module"
              :description="selectedModule ? `Voulez-vous vraiment supprimer « ${selectedModule.name} » et tous ses items ? Cette action est irréversible.` : ''"
              :button="{ label: 'Supprimer', icon: 'i-heroicons-trash', color: 'error', variant: 'ghost' }"
              :zod-schema="deleteSchema"
              :zod-state="deleteState"
              @click="selectedModule = module"
              @submit="onDeleteModule"
              @close="deleteOpen = false"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!modules" class="text-center py-8">
        <p class="text-sm text-gray-400">Aucun module dans ce groupe.</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

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
  createdAt: string
}

const route = useRoute()
const toast = useToast()
const {getModules, createModule, deleteModule} = useGroups()
const groupId = route.params.groupId as string

// -- Données statiques --
const modules = ref<Module[]>([])

const fetchModules = await getModules(groupId)
modules.value = fetchModules

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

// -- Créer --
const createOpen = ref(false)
const createLoading = ref(false)
const createDisableClose = ref(false)

const createSchema = z.object({
  name:        z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  requiresVm:  z.boolean()
})

const createState = reactive({
  name:        '',
  description: '',
  requiresVm:  false
})

async function onCreateModule() {
  createLoading.value = true
  createDisableClose.value = true

  // TODO: appel API → const { data } = await requestPost(...)
  const module = await createModule(groupId, {
    name: createState.name,
    description: createState.description ? createState.description : '',
    requiresVm:  !!createState.requiresVm,
  })

  if (!module) return

  modules.value.push({
    UUID:        module,
    name:        createState.name,
    description: createState.description,
    requiresVm:  createState.requiresVm,
    items:       [],
    createdAt:   new Date().toISOString()
  })

  createState.name        = ''
  createState.description = ''
  createState.requiresVm  = false
  createLoading.value     = false
  createDisableClose.value = false
  createOpen.value        = false

  toast.add({ title: 'Module créé', color: 'success' })
}

// -- Supprimer --
const deleteOpen = ref(false)
const deleteLoading = ref(false)
const deleteDisableClose = ref(false)
const selectedModule = ref<Module | null>(null)

const deleteSchema = z.object({})
const deleteState  = reactive({})

async function onDeleteModule() {
  if (!selectedModule.value) return
  deleteLoading.value     = true
  deleteDisableClose.value = true

  // TODO: appel API → await requestDelete(...)
  const module = await deleteModule(groupId, selectedModule.value.UUID)
  if (!module) return

  modules.value = modules.value.filter(m => m.UUID !== selectedModule.value!.UUID)

  toast.add({ title: `« ${selectedModule.value.name} » supprimé`, color: 'success' })

  selectedModule.value    = null
  deleteLoading.value     = false
  deleteDisableClose.value = false
  deleteOpen.value        = false
}
</script>