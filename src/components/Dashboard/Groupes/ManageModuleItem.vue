<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="navigateTo(`/dashboard/groupes/${groupId}/manage-modules/${moduleId}`)"
        />
        <div>
          <p class="text-xs text-gray-400">{{ module.name }}</p>
          <p class="text-sm font-medium">{{ item.title }}</p>
        </div>
        <UBadge :color="typeColor(item.type)" variant="soft" size="xs" :label="item.type?.label || item.type" />
      </div>

      <UButton
          label="Sauvegarder"
          icon="i-heroicons-check"
          size="sm"
          :loading="saveLoading"
          @click="onSave"
      />
    </div>

    <USeparator />

    <!-- Titre & Type -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <UFormField label="Titre" name="title">
          <UInput v-model="form.title" placeholder="Titre de l'item..." class="w-full" size="lg" />
        </UFormField>
      </div>

      <UFormField label="Type" name="type">
        <USelectMenu
            v-model="form.type"
            :items="typeOptions"
            class="w-full"
            size="lg"
        />
      </UFormField>
    </div>

    <!-- Éditeur -->
    <UFormField label="Contenu" name="content">
      <div class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <UEditor
            v-slot="{ editor }"
            v-model="form.content"
            content-type="html"
            placeholder="Rédigez votre contenu ici..."
            class="w-full min-h-[500px]"
        >
          <UEditorToolbar :editor="editor" :items="toolbarItems" />
        </UEditor>
      </div>
    </UFormField>

  </div>
</template>

<script setup lang="ts">
interface ModuleItem {
  UUID: string
  title: string
  type: { label: string, value: string }
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

const route    = useRoute()
const toast    = useToast()
const {getModules, updateModuleItem} = useGroups()

const groupId  = route.params.groupId  as string
const moduleId = route.params.moduleId as string
const itemId   = route.params.itemId   as string

// -- Données statiques --
const module = ref({
  UUID: moduleId,
  name: 'Loading..'
})

const item = ref<ModuleItem>({
  UUID:    itemId,
  title:   '--',
  type:    { label: 'TP', value: 'TP' },
  order:   1,
  content: 'Loading..'
})

const fetchModules = await getModules(groupId)
const fetchModule  = fetchModules.find((m: Module) => m.UUID === moduleId) as Module
module.value = fetchModule
item.value = fetchModule.items.find((i: ModuleItem) => i.UUID === itemId) as ModuleItem

const form = reactive({
  title:   item.value.title,
  type:    item.value.type,
  content: item.value.content
})

// -- Types --
const typeOptions = [
  { label: 'TP',       value: 'TP' },
  { label: 'Cours',    value: 'COURS' },
  { label: 'Exercice', value: 'EXERCICE' }
]

function typeColor(type: { value: string } | string) {
  const val = typeof type === 'string' ? type : type.value
  if (val === 'TP')       return 'primary' as const
  if (val === 'COURS')    return 'success' as const
  if (val === 'EXERCICE') return 'warning' as const
  return 'neutral' as const
}

// -- Toolbar --
const toolbarItems = [
  [
    { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: 'Annuler' } },
    { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: 'Rétablir' } }
  ],
  [
    {
      icon: 'i-lucide-heading',
      tooltip: { text: 'Titres' },
      content: { align: 'start' },
      items: [
        { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', label: 'Titre 1' },
        { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', label: 'Titre 2' },
        { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', label: 'Titre 3' }
      ]
    },
    { kind: 'mark', mark: 'bold',      icon: 'i-lucide-bold',          tooltip: { text: 'Gras' } },
    { kind: 'mark', mark: 'italic',    icon: 'i-lucide-italic',        tooltip: { text: 'Italique' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline',     tooltip: { text: 'Souligné' } },
    { kind: 'mark', mark: 'strike',    icon: 'i-lucide-strikethrough', tooltip: { text: 'Barré' } },
    { kind: 'mark', mark: 'code',      icon: 'i-lucide-code',          tooltip: { text: 'Code inline' } }
  ],
  [
    { kind: 'bulletList',  icon: 'i-lucide-list',         tooltip: { text: 'Liste à puces' } },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Liste numérotée' } },
    { kind: 'blockquote',  icon: 'i-lucide-quote',        tooltip: { text: 'Citation' } },
    { kind: 'codeBlock',   icon: 'i-lucide-square-code',  tooltip: { text: 'Bloc de code' } }
  ],
  [
    { kind: 'link', icon: 'i-lucide-link', tooltip: { text: 'Lien' } }
  ]
]

// -- Sauvegarder --
const saveLoading = ref(false)

async function onSave() {
  saveLoading.value = true

  const updateItem = await updateModuleItem(groupId, moduleId, item.value.UUID, {
    title: form.title,
    itemType: form.type.value || form.type as unknown as string,
    content: form.content
  })
  if (!updateItem) return

  item.value.title   = form.title
  item.value.type    = form.type
  item.value.content = form.content

  saveLoading.value = false
  toast.add({ title: 'Item sauvegardé', color: 'success' })
}
</script>