<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Codes d'invitation</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Gérez les codes à usage unique permettant de rejoindre le groupe.</p>
      </div>
      <UButton
          label="Créer un code"
          icon="i-heroicons-plus"
          size="sm"
          :loading="createLoading"
          @click="createCodeFonc"
      />
    </div>

    <USeparator />

    <!-- Table -->
    <UTable :data="codes" :columns="columns">
      <template #code-cell="{ row }">
        <div class="flex items-center gap-2">
          <span class="font-mono text-sm">{{ row.original.code }}</span>
          <UButton
              size="xs"
              variant="ghost"
              icon="i-heroicons-clipboard"
              @click="copyCode(row.original.code)"
          />
        </div>
      </template>

      <template #createdAt-cell="{ row }">
        <span class="text-sm text-gray-500">{{ formatDate(row.original.createdAt) }}</span>
      </template>

      <template #actions-cell="{ row }">
        <UButton
            size="xs"
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            :loading="deletingUUID === row.original.UUID"
            @click="deleteCodeFonc(row.original.UUID)"
        />
      </template>
    </UTable>

    <!-- Empty state -->
    <div v-if="codes.length === 0" class="text-center py-8">
      <p class="text-sm text-gray-400">Aucun code actif pour ce groupe.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const { getCodes, createCode, deleteCode } = useGroups()

const groupId = route.params.groupId as string

const codeRes = await getCodes(groupId) || []
// -- Données statiques --
const codes = ref<groupCode[]>(codeRes )

const columns = [
  { id: 'code',      accessorKey: 'code',      header: 'Code' },
  { id: 'createdAt', accessorKey: 'createdAt', header: 'Créé le' },
  { id: 'actions',   accessorKey: 'actions',   header: '' }
]

// -- Créer un code --
const createLoading = ref(false)

async function createCodeFonc() {
  createLoading.value = true

  const code = await createCode(groupId)

  if (!code) return

  codes.value.push({
    UUID: crypto.randomUUID(),
    code: code?.code || '?',
    createdAt: code?.createdAt || '?'
  })
  createLoading.value = false

  toast.add({ title: 'Code créé', color: 'success' })
}

// -- Supprimer un code --
const deletingUUID = ref<string | null>(null)

async function deleteCodeFonc(uuid: string) {
  deletingUUID.value = uuid
  // TODO: appel API
  // await requestDelete(...)

  // Simulation
  await new Promise(r => setTimeout(r, 500))
  codes.value = codes.value.filter(c => c.UUID !== uuid)
  deletingUUID.value = null

  toast.add({ title: 'Code supprimé', color: 'success' })
}

// -- Copier le code --
async function copyCode(code: string) {
  await navigator.clipboard.writeText(code)
  toast.add({ title: 'Code copié !', color: 'success' })
}

// -- Formatter la date --
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>