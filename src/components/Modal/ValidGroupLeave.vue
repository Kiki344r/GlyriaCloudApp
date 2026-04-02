<template>
  <div class="w-full">
    <ModalDefault
        v-model:open="open"
        v-model:loading="loading"
        v-model:disable-close="disableClose"
        title="Attention : Quitter le groupe"
        description="Cette action est immédiate. Pour revenir, vous devrez obtenir un nouveau code d'accès auprès de votre formateur."
        :button="{
        label: 'Quitter le groupe',
        class: 'w-full !text-red-400 border-red-500/20 hover:bg-red-500/10 transition-all cursor-pointer',
        variant: 'outline',
        color: 'error'
      }"
        :zod-schema="zodSchema"
        :zod-state="zodState"
        @submit="onSubmit"
        @close="onClose"
    >
      <template #default>
        <div class="space-y-4">
          <div class="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
            <p class="text-xs font-medium">
              Action irréversible sans nouveau code d'invitation.
            </p>
          </div>

          <UFormField
              name="confirmLeave"
              :ui="{ label: 'text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2' }"
              label="Confirmation requise"
          >
            <UInput
                v-model="zodState.confirmLeave"
                placeholder="Tapez QUITTER ici"
                size="lg"
                class="font-mono tracking-wider"
                :ui="{
                base: 'bg-white/[0.03] border-white/10 focus:ring-red-500/50 text-center uppercase placeholder:lowercase placeholder:text-gray-700',
              }"
            />
          </UFormField>
        </div>
      </template>
    </ModalDefault>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { leaveGroup, updateGroups } = useGroups()
const toast = useToast()

const props = defineProps<{ uuid: string }>()

const open = ref(false)
const loading = ref(false)
const disableClose = ref(false)

// Reset au changement d'état
watch(open, (val) => {
  if (!val) {
    zodState.confirmLeave = undefined
  }
})

const zodSchema = z.object({
  confirmLeave: z.string().refine(val => val.toUpperCase() === 'QUITTER', {
    message: "Vous devez taper 'QUITTER' pour confirmer."
  })
})

type Schema = z.output<typeof zodSchema>
const zodState = reactive({
  confirmLeave: undefined as string | undefined
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  // Le validateur Zod s'occupe déjà de vérifier si c'est égal à 'QUITTER'
  loading.value = true
  disableClose.value = true

  try {
    const success = await leaveGroup(props.uuid)
    if (success) {
      toast.add({
        title: 'Groupe quitté',
        icon: 'i-heroicons-check-circle',
        color: 'success',
        description: 'Vous ne faites plus partie de ce groupe.'
      })
      await updateGroups()
      open.value = false
    } else {
      throw new Error()
    }
  } catch (e) {
    toast.add({
      title: 'Erreur',
      icon: 'i-heroicons-x-circle',
      color: 'error',
      description: 'Impossible de quitter le groupe. Réessayez plus tard.'
    })
  } finally {
    loading.value = false
    disableClose.value = false
  }
}

const onClose = () => {
  open.value = false
}
</script>