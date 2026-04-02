<template>
  <UModal
      v-model:open="modelOpen"
      :dismissible="!disableClose"
      :title="title"
      :description="description"
      :ui="{
      wrapper: 'z-',
      overlay: { background: 'bg-zinc-950/80 backdrop-blur-sm' },
      content: 'bg-dark border border-white/10 shadow-2xl rounded-2xl overflow-hidden',
      header: 'px-6 py-5 border-b border-white/5 bg-white/[0.02]',
      body: 'p-6',
      footer: 'px-6 py-4 border-t border-white/5 bg-white/[0.01]'
    }"
      :close="{
      class: 'cursor-pointer hover:bg-white/10 rounded-full transition-colors',
      onClick: onClose
    }"
  >
    <slot name="trigger">
      <UButton v-if="button.label" v-bind="button" @click="modelOpen = true" />
    </slot>

    <template #body>
      <UForm
          :schema="zodSchema"
          :state="zodState"
          class="space-y-6"
          @submit="onSubmit"
      >
        <div class="flex flex-col gap-5">
          <slot />
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/5 -mx-6 -mb-6 px-6 py-4 bg-white/[0.01]">
          <UButton
              label="Annuler"
              variant="ghost"
              color="neutral"
              class="text-gray-400 hover:text-white cursor-pointer px-4"
              @click="onClose"
          />
          <UButton
              label="Confirmer"
              type="submit"
              color="primary"
              class="px-8 font-bold shadow-lg shadow-primary/20 cursor-pointer"
              :loading="loading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  open: boolean
  loading: boolean
  disableClose: boolean
  title: string
  description: string
  button: {
    label: string
    color?: any
    disabled?: boolean
    class?: string
    variant?: any
  }
  zodSchema: any
  zodState: any
}>()

const emit = defineEmits([
  'update:open',
  'update:loading',
  'update:disableClose',
  'submit',
  'close'
])

// Gestion du v-model:open
const modelOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const modelLoading = computed({
  get: () => props.loading,
  set: (value: boolean) => emit('update:loading', value)
})

const modelDisableClose = computed({
  get: () => props.disableClose,
  set: (value: boolean) => emit('update:disableClose', value)
})

const onSubmit = (event: FormSubmitEvent<any>) => {
  emit('submit', event)
  // On laisse le parent gérer l'état loading/disableClose via les emits si besoin
}

const onClose = () => {
  if (props.disableClose) return
  emit('close')
  modelOpen.value = false
}
</script>