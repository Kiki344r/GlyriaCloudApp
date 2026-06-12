<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="navigateTo(`/dashboard/groupes/${groupId}/manage-modules`)"
        />
        <div>
          <p class="text-xs text-gray-400">Module</p>
          <p class="text-sm font-medium">{{ module?.name }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Créer un item -->
        <ModalDefault
            v-model:open="createOpen"
            v-model:loading="createLoading"
            v-model:disable-close="createDisableClose"
            title="Ajouter un item"
            description="Ajoutez un TP, Cours ou Exercice à ce module."
            :button="{ label: 'Ajouter un item', icon: 'i-heroicons-plus' }"
            :zod-schema="createSchema"
            :zod-state="createState"
            @submit="onCreateItem"
            @close="createOpen = false"
        >
          <UFormField label="Titre" name="title">
            <UInput v-model="createState.title" placeholder="Ex: TP - Configuration SSH" class="w-full" />
          </UFormField>

          <UFormField label="Type" name="type">
            <USelectMenu
                v-model="createState.type"
                :items="typeOptions"
                class="w-full"
            />
          </UFormField>
        </ModalDefault>

        <!-- Sauvegarder l'ordre -->
        <UButton
            label="Sauvegarder"
            icon="i-heroicons-check"
            variant="soft"
            :loading="saveLoading"
            @click="onSave"
        />
      </div>
    </div>

    <USeparator />

    <!-- Config du module -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <UFormField label="Nom du module" name="name">
        <UInput v-model="module.name" class="w-full" />
      </UFormField>

      <UFormField label="Description" name="description">
        <UInput v-model="module.description" placeholder="Description optionnelle..." class="w-full" />
      </UFormField>

      <UFormField label="VM requise" name="requiresVm">
        <div class="flex items-center justify-between pt-1">
          <p class="text-xs text-gray-400">Les élèves devront lier une VM pour commencer ce module.</p>
          <UCheckbox v-model="module.requiresVm" />
        </div>
      </UFormField>
    </div>

    <USeparator />

    <!-- Liste des items avec drag & drop -->
    <div class="space-y-3">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
        Items <span class="text-gray-400 font-normal">(glissez pour réordonner)</span>
      </p>

      <div v-if="module?.items.length === 0" class="text-center py-8">
        <p class="text-sm text-gray-400">Aucun item dans ce module. Ajoutez un TP, Cours ou Exercice.</p>
      </div>

      <div class="space-y-2">
        <div
            v-for="(item, index) in module?.items"
            :key="item.UUID"
            class="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <!-- Flèches -->
          <div class="flex flex-col gap-0.5 shrink-0">
            <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-chevron-up"
                :disabled="index === 0"
                @click="moveUp(index)"
            />
            <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-chevron-down"
                :disabled="index === module?.items.length - 1"
                @click="moveDown(index)"
            />
          </div>

          <!-- Badge type -->
          <UBadge
              :color="typeColor(item.type)"
              variant="soft"
              size="xs"
              :label="item.type"
              class="shrink-0"
          />

          <!-- Titre -->
          <p class="text-sm flex-1 truncate">{{ item.title }}</p>

          <!-- Actions -->
          <div class="flex items-center gap-1 shrink-0">
            <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-pencil-square"
                @click="navigateTo(`/dashboard/groupes/${groupId}/manage-modules/${moduleId}/items/${item.UUID}`)"
            />
            <ModalDefault
                v-model:open="deleteItemOpen"
                v-model:loading="deleteItemLoading"
                v-model:disable-close="deleteItemDisableClose"
                title="Supprimer l'item"
                :description="selectedItem ? `Voulez-vous vraiment supprimer « ${selectedItem.title} » ?` : ''"
                :button="{ label: 'Supprimer', icon: 'i-heroicons-trash', color: 'error', variant: 'ghost' }"
                :zod-schema="deleteSchema"
                :zod-state="deleteState"
                @click="selectedItem = item"
                @submit="onDeleteItem"
                @close="deleteItemOpen = false"
            />
          </div>
        </div>
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
const {getModules, editModule, createModuleItem, updateModuleItemOrder, deleteModuleItem} = useGroups()

const groupId  = route.params.groupId  as string
const moduleId = route.params.moduleId as string

// -- Données statiques --
const module = ref<Module>({} as Module)

const fetchModules = await getModules(groupId)
module.value = fetchModules.find((m: Module) => m.UUID === moduleId) as Module

// -- Types --
const typeOptions = [
  { label: 'TP',        value: 'TP' },
  { label: 'Cours',     value: 'COURS' },
  { label: 'Exercice',  value: 'EXERCICE' }
]

function typeColor(type: string) {
  if (type === 'TP')       return 'primary' as const
  if (type === 'COURS')    return 'success' as const
  if (type === 'EXERCICE') return 'warning' as const
  return 'neutral' as const
}

// -- Sauvegarder l'ordre --
const saveLoading = ref(false)

async function onSave() {
  saveLoading.value = true

  const updateModule = await editModule(groupId, moduleId, {
    name: module.value.name,
    description: module.value.description,
    requiresVm: module.value.requiresVm
  })
  if (!updateModule) return

  const updateOrder = await updateModuleItemOrder(groupId, moduleId, {
    order: module.value.items.map((item, i) => ({ UUID: item.UUID, order: i }))
  })
  if (!updateOrder) return
  // Mettre à jour les order localement
  module.value.items = module.value.items.map((item, i) => ({ ...item, order: i }))

  saveLoading.value = false
  toast.add({ title: 'Données sauvegardé', color: 'success' })
}

// -- Créer un item --
const createOpen          = ref(false)
const createLoading       = ref(false)
const createDisableClose  = ref(false)

const createSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  type:  z.object({ label: z.string(), value: z.string() })
})

const createState = reactive<{ title: string, type: { label: string, value: string } }>({
  title: '',
  type:  { label: 'TP', value: 'TP' }
})

async function onCreateItem() {
  createLoading.value      = true
  createDisableClose.value = true

  const moduleItem = await createModuleItem(groupId, moduleId, {
    title: createState.title,
    itemType: createState.type.value as string,
    order: module.value.items.length,
    content: ''
  })

  if (!moduleItem) return

  module.value.items.push({
    UUID:    moduleItem.UUID,
    title:   createState.title,
    type:    createState.type.value as 'TP' | 'COURS' | 'EXERCICE',
    order:   module.value.items.length,
    content: ''
  })

  createState.title        = ''
  createState.type         = { label: 'TP', value: 'TP' }
  createLoading.value      = false
  createDisableClose.value = false
  createOpen.value         = false

  toast.add({ title: 'Item ajouté', color: 'success' })
}

// -- Supprimer un item --
const deleteItemOpen          = ref(false)
const deleteItemLoading       = ref(false)
const deleteItemDisableClose  = ref(false)
const selectedItem            = ref<ModuleItem | null>(null)

const deleteSchema = z.object({})
const deleteState  = reactive({})

async function onDeleteItem() {
  if (!selectedItem.value) return
  deleteItemLoading.value      = true
  deleteItemDisableClose.value = true

  const delModule = await deleteModuleItem(groupId, moduleId, selectedItem.value.UUID)
  if (!delModule) return

  module.value.items = module.value.items.filter(i => i.UUID !== selectedItem.value!.UUID)

  toast.add({ title: `« ${selectedItem.value.title} » supprimé`, color: 'success' })

  selectedItem.value           = null
  deleteItemLoading.value      = false
  deleteItemDisableClose.value = false
  deleteItemOpen.value         = false
}

function moveUp(index: number) {
  if (index === 0) return
  const items = [...module.value.items]
  ;[items[index - 1], items[index]] = [items[index], items[index - 1]]
  module.value.items = items
}

function moveDown(index: number) {
  if (index === module.value.items.length - 1) return
  const items = [...module.value.items]
  ;[items[index + 1], items[index]] = [items[index], items[index + 1]]
  module.value.items = items
}

</script>