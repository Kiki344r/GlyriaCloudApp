<template>
  <div class="min-h-screen bg-dark flex items-center justify-center p-6">
    <UPageCard
        class="w-full max-w-md shadow-2xl border border-white/5"
        :ui="{
        root: 'bg-dark',
        body: 'p-8 sm:p-10',
        header: 'border-b border-white/5 pb-6'
      }"
    >
      <UAuthForm
          :schema="schema"
          title="Réinitialisation"
          align="top"
          icon="i-heroicons-lock-closed"
          :fields="fields"
          :loading="resetPasswordLoading"
          :submit="{
          label: 'Mettre à jour le mot de passe',
          color: 'primary',
          class: 'w-full py-2.5 font-bold shadow-lg shadow-primary/20 cursor-pointer transition-all active:scale-[0.98]'
        }"
          :ui="{
          root: 'space-y-6',
          title: 'text-2xl font-bold tracking-tight text-white',
          description: 'text-gray-500 text-sm mt-2',
          input: 'bg-white/[0.03] border-white/10 focus:ring-primary-500/50',
          label: 'text-xs font-mono uppercase tracking-widest text-gray-500'
        }"
          @submit="onSubmit"
      >
        <template #description>
          <div class="space-y-1">
            <p>Saisissez votre nouveau mot de passe sécurisé.</p>
            <ULink
                to="/login"
                class="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-xs font-medium transition-colors"
            >
              <UIcon name="i-heroicons-arrow-left" class="w-3 h-3" />
              Retour à la connexion
            </ULink>
          </div>
        </template>

        <template #validation>
          <UAlert
              v-if="resetPasswordError"
              color="error"
              variant="subtle"
              icon="i-heroicons-exclamation-circle"
              :title="resetPasswordError"
              class="mb-6 border border-red-500/20"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const { ResetPassword, CheckPasswordCode } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const code = route.query.code as string
const resetPasswordError = ref('')
const resetPasswordLoading = ref(false)

// Vérification initiale du code
onMounted(async () => {
  const status = await CheckPasswordCode({ code: code || '' })
  if (!status) {
    toast.add({
      title: 'Lien invalide ou expiré',
      description: 'Veuillez refaire une demande de réinitialisation.',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
    router.push('/login')
  }
})

const schema = z.object({
  password: z.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
      .regex(/[A-Z]/, 'Doit contenir au moins une majuscule.')
      .regex(/[0-9]/, 'Doit contenir au moins un chiffre.'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  resetPasswordLoading.value = true
  resetPasswordError.value = ''

  try {
    const res = await ResetPassword({
      code: code,
      password: payload.data.password
    })

    if (res) {
      return router.push('/login')
    }
  } catch (err: any) {
    resetPasswordError.value = "Une erreur est survenue lors de la mise à jour."
  } finally {
    resetPasswordLoading.value = false
  }
}

const fields: AuthFormField[] = [
  {
    name: 'password',
    type: 'password',
    label: 'Nouveau mot de passe',
    placeholder: '••••••••',
    icon: 'i-heroicons-key',
    required: true
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirmation',
    placeholder: '••••••••',
    icon: 'i-heroicons-shield-check',
    required: true
  }
]
</script>