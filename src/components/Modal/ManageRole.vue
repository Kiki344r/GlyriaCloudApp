<template>
  <ModalDefault
      v-model:open="open"
      v-model:loading="loading"
      v-model:disable-close="disableClose"
      :title="`Gérer — ${state.name}`"
      description="Modifiez les permissions ou supprimez ce rôle."
      :button="{
      label: 'Gérer',
      color: 'primary',
      variant: 'ghost',
      class: 'text-xs hover:text-primary-400 p-0 h-auto font-medium transition-colors cursor-pointer'
    }"
      :zod-schema="schema"
      :zod-state="state"
      @submit="onSubmit"
      @close="emit('close')"
      @click="emit('click')"
  >
    <template #trigger />

    <UFormField label="Nom du rôle" name="name">
      <UInput v-model="state.name" class="w-full" />
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

    <UFormField label="Membres avec ce rôle" name="members">
      <div class="space-y-1">
        <div
            v-for="m in members"
            :key="m.user.UUID"
            class="flex items-center gap-2 text-sm py-1"
        >
          <UAvatar :alt="`${m.user.firstName} ${m.user.lastName}`" size="xs" />
          <span>{{ m.user.firstName }} {{ m.user.lastName }}</span>
        </div>
        <p v-if="members.length === 0" class="text-xs text-gray-400">Aucun membre</p>
      </div>
    </UFormField>

    <!-- Bouton supprimer -->
    <UButton
        label="Supprimer ce rôle"
        color="error"
        variant="soft"
        icon="i-heroicons-trash"
        class="w-full cursor-pointer"
        @click="confirmDelete(role)"
    />
  </ModalDefault>
</template>

<script setup lang="ts">
import { z } from 'zod'

const props = defineProps<{
  open: boolean
  loading: boolean
  disableClose: boolean
  role: groupRole
  members: groupMember[]
  allPermissions: { value: string, label: string, description: string }[]
}>()

const emit = defineEmits(['update:open', 'update:loading', 'update:disableClose', 'submit', 'delete', 'close', 'click'])

const open = computed({ get: () => props.open, set: v => emit('update:open', v) })
const loading = computed({ get: () => props.loading, set: v => emit('update:loading', v) })
const disableClose = computed({ get: () => props.disableClose, set: v => emit('update:disableClose', v) })
const toast = useToast()

console.log("props role", props.role)

const schema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.string())
})

const state = reactive({
  name: props?.role?.name || "?",
  permissions: [...props?.role?.permissions||[]]
})
console.log("state role", state)

watch(() => props?.role, (r) => {
  state.name = r.name || "?"
  state.permissions = [...r?.permissions||[]]
})

function confirmDelete(role: groupRole) {
  const confirmToast = toast.add({
    title: "Confirmer la suppression",
    description: `Veuillez confirmer la suppression du role ${role.name}`,
    duration: 0,
    color: "error",
    actions: [
      {
        label: "Supprimer",
        color: "error",
        variant: "solid",
        onClick: () => emit('delete', role.UUID)
      },
      {
        label: "Annuler",
        color: "neutral",
        variant: "outline",
        onClick: () => toast.remove(confirmToast.id)
      }
    ]
  })
}

function togglePerm(value: string) {
  if (state.permissions.includes(value)) {
    state.permissions = state.permissions.filter(p => p !== value)
  } else {
    state.permissions.push(value)
  }
}

function onSubmit() {
  emit('submit', { ...props.role, ...state })
}
</script>