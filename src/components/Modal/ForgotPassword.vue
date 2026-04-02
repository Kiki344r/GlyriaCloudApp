<template>
  <ModalDefault
      v-model:open="open"
      v-model:loading="loading"
      v-model:disable-close="disableClose"
      title="Réinitialiser le mot de passe"
      description="Entrez votre email pour recevoir un lien sécurisé. Ce lien sera valide pendant 15 minutes."
      :button="{
      label: 'Mot de passe oublié ?',
      color: 'neutral',
      variant: 'ghost',
      class: 'text-xs hover:text-primary-400 p-0 h-auto font-medium transition-colors cursor-pointer'
    }"
      :zod-schema="zodSchema"
      :zod-state="zodState"
      @submit="onSubmit"
      @close="onClose"
  >
    <template #default>
      <div class="space-y-4">
        <UFormField
            label="Adresse e-mail"
            name="email"
            :ui="{ label: 'text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2' }"
        >
          <UInput
              v-model="zodState.email"
              type="email"
              placeholder="votre@email.com"
              icon="i-heroicons-envelope"
              size="lg"
              :ui="{
              base: 'bg-white/[0.03] border-white/10 focus:ring-primary-500/50',
            }"
          />
        </UFormField>

        <div class="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-gray-600 shrink-0" />
          <p class="text-[11px] text-gray-500 leading-relaxed">
            Par mesure de sécurité, si aucun compte n'est associé à cette adresse, aucun e-mail ne sera envoyé.
          </p>
        </div>
      </div>
    </template>
  </ModalDefault>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = ref(false)
const loading = ref(false)
const disableClose = ref(false)

const { ForgotPassword } = useAuth()
const toast = useToast()

const zodSchema = z.object({
  email: z.string().email('Veuillez saisir une adresse email valide.')
})

type Schema = z.output<typeof zodSchema>

const zodState = reactive({
  email: undefined as string | undefined
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  disableClose.value = true

  try {
    const status = await ForgotPassword({ email: event.data.email })

    if (status) {
      open.value = false
      zodState.email = undefined
    }
  } catch (error) {
    toast.add({
      title: 'Erreur',
      description: 'Une erreur est survenue. Veuillez réessayer.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
    disableClose.value = false
  }
}

const onClose = () => {
  zodState.email = undefined
}
</script>