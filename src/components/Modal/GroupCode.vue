<template>
  <ModalDefault
      v-model:open="store.open"
      v-model:loading="store.loading"
      v-model:disable-close="store.disableClose"
      title="Rejoindre un groupe"
      description="Saisissez le code d'invitation à 8 caractères fourni par votre formateur pour accéder à vos ressources."
      :button="{
      label: 'Rejoindre un groupe',
      color: 'primary',
      variant: 'outline',
      class: 'hidden'
    }"
      :zod-schema="zodSchema"
      :zod-state="zodState"
      @submit="onSubmit"
      @close="onClose"
  >
    <UFormField
        name="groupCode"
        :ui="{
        label: 'text-xs font-mono uppercase tracking-widest text-gray-500 mb-2',
        error: 'text-xs text-error-500 mt-2 font-medium'
      }"
        label="Code d'accès unique"
    >
      <UInput
          v-model="zodState.groupCode"
          placeholder="A1B2-C3D4"
          size="xl"
          icon="i-heroicons-key"
          autofocus
          :disabled="store.loading"
          class="font-mono uppercase tracking-widest"
          :ui="{
          base: 'bg-white/[0.03] border-white/10 focus:ring-primary-500/50 text-center text-lg',
        }"
      />
    </UFormField>

    <div class="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
      <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
      <p class="text-xs text-gray-400 leading-relaxed">
        Ce code est lié à votre compte et ne peut être utilisé qu'une seule fois. Contactez votre support en cas de code expiré.
      </p>
    </div>
  </ModalDefault>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { joinGroup, getGroupsRef, updateGroups } = useGroups()
const store = useGroupCodeStore()

// On récupère les groupes au montage
await updateGroups()
const groups = getGroupsRef()

const zodSchema = z.object({
  groupCode: z.string()
      .min(1, 'Le code est requis')
      .regex(/^[A-Z0-9-a-z]+$/, 'Le code doit être composé de lettres majuscules et de chiffres uniquement')
      .refine(code => /^[a-z-Z0-9]{4}-?[a-zA-Z0-9]{4}$/.test(code), 'Le code doit être au format XXXX-XXXX ou XXXXXXXX')

})

type Schema = z.output<typeof zodSchema>

const zodState = reactive({
  groupCode: undefined as string | undefined
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  store.loading = true
  store.disableClose = true

  try {
    const group = await joinGroup(event.data.groupCode)

    if (group) {
      await updateGroups()
      zodState.groupCode = undefined
      store.open = false
    }
  } catch (error) {
    console.error('Erreur lors de la jointure:', error)
  } finally {
    store.loading = false
    store.disableClose = false
  }
}

const onClose = () => {
  zodState.groupCode = undefined
  store.loading = false
  store.disableClose = false
}
</script>