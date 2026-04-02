<template>
  <div class="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden px-6">

    <!-- background glow -->
    <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/20 blur-[140px] rounded-full" />
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full" />

    <div class="relative w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">

      <!-- LEFT -->
      <div class="hidden lg:flex flex-col gap-6 text-white">

        <div class="flex items-center gap-2 text-sm text-gray-400">
          <span class="text-green-400">●</span>
          Create your Linux workspace
        </div>

        <h1 class="text-5xl font-semibold leading-tight">
          Commence ton
          <span class="text-primary">apprentissage Linux</span>
          aujourd’hui
        </h1>

        <p class="text-gray-400 text-lg max-w-md">
          Crée ton compte et accède à des VMs, cours interactifs et progression en temps réel.
        </p>

        <!-- fake system preview -->
        <div class="bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-sm text-green-400">
          <p>user@glyria:~$ useradd student</p>
          <p class="text-white/60">creating workspace...</p>
          <p class="text-white/60">environment ready</p>
        </div>

      </div>

      <!-- RIGHT -->
      <UPageCard class="w-full bg-dark/60 border border-white/10 backdrop-blur text-white p-6 rounded-2xl">

        <UAuthForm
            :schema="schema"
            title="Créer un compte"
            icon="i-lucide-user-plus"
            :fields="fields"
            :submit="{
            label: 'Créer un compte',
            color: 'primary',
            variant: 'solid',
            loading: registerLoading
          }"
            :ui="{
            wrapper: 'gap-4'
          }"
            @submit="onSubmit"
        >

          <!-- description -->
          <template #description>
            <p class="text-gray-400">
              Déjà un compte ?
              <ULink to="/login" class="text-primary font-medium">
                Se connecter
              </ULink>
            </p>

            <ULink to="/" class="text-sm text-gray-500 hover:text-white">
              ← Retour à l’accueil
            </ULink>
          </template>

          <!-- validation -->
          <template #validation>
            <UAlert
                v-if="registerError"
                color="error"
                icon="i-lucide-alert-circle"
                :title="registerError"
                class="mt-2"
            />
          </template>

          <!-- footer -->
          <template #footer>
            <p class="text-xs text-gray-500">
              En créant ton compte, tu acceptes les CGU.
            </p>
          </template>

        </UAuthForm>

      </UPageCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const { Register } = useAuth()

const registerError = ref('')
const registerLoading = ref(false)

const schema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum'),
  confirmPassword: z.string().min(8, '8 caractères minimum')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  registerLoading.value = true
  registerError.value = ''

  const res = await Register(payload.data)

  if (!res) {
    registerError.value = "Erreur lors de la création du compte"
  }

  registerLoading.value = false
}

const fields: AuthFormField[] = [
  {
    name: 'firstName',
    type: 'text',
    label: 'Prénom',
    placeholder: 'John',
    required: true
  },
  {
    name: 'lastName',
    type: 'text',
    label: 'Nom',
    placeholder: 'Doe',
    required: true
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'john@exemple.com',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Mot de passe',
    placeholder: '••••••••',
    required: true
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirmation',
    placeholder: '••••••••',
    required: true
  }
]
</script>