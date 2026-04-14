<template>
  <ModalDefault
      v-model:open="open"
      v-model:loading="loading"
      v-model:disable-close="disableClose"
      title="Créer un rôle"
      description="Définissez le nom et les permissions du nouveau rôle."
      :button="{ label: 'Créer un rôle', icon: 'i-heroicons-plus' }"
      :zod-schema="schema"
      :zod-state="state"
      @submit="onSubmit"
      @close="emit('close')"
  >
    <UFormField label="Nom du rôle" name="name">
      <UInput v-model="state.name" placeholder="Ex: Moniteur" class="w-full" />
    </UFormField>

    <UFormField label="Permissions" name="permissions">
      <div class="space-y-2">
        <div
            v-for="perm in allPermissions"
            :key="perm.value"
            class="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
        >
          <div>
            <p class="text-sm font-medium">{{ perm.label }}</p>
            <p class="text-xs text-gray-400">{{ perm.description }}</p>
          </div>
          <UCheckbox
              :model-value="state.permissions.includes(perm.value)"
              @update:model-value="togglePerm(perm.value)"
          />
        </div>
      </div>
    </UFormField>
  </ModalDefault>
</template>

<script setup lang="ts">
import { z } from 'zod'

const props = defineProps<{
  open: boolean
  loading: boolean
  disableClose: boolean
  allPermissions: { value: string, label: string, description: string }[]
}>()

const emit = defineEmits(['update:open', 'update:loading', 'update:disableClose', 'submit', 'close'])

const open = computed({ get: () => props.open, set: v => emit('update:open', v) })
const loading = computed({ get: () => props.loading, set: v => emit('update:loading', v) })
const disableClose = computed({ get: () => props.disableClose, set: v => emit('update:disableClose', v) })

const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  permissions: z.array(z.string())
})

const state = reactive({ name: '', permissions: [] as string[] })

function togglePerm(value: string) {
  if (state.permissions.includes(value)) {
    state.permissions = state.permissions.filter(p => p !== value)
  } else {
    state.permissions.push(value)
  }
}

function onSubmit() {
  emit('submit', { ...state })
}
</script>