<template>
  <div class="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden px-6">

    <!-- background glow -->
    <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/20 blur-[140px] rounded-full" />
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full" />

    <div class="relative w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">

      <!-- LEFT (branding) -->
      <div class="hidden lg:flex flex-col gap-6 text-white">

        <div class="flex items-center gap-2 text-sm text-gray-400">
          <span class="text-green-400">●</span>
          Secure Linux Training Platform
        </div>

        <h1 class="text-5xl font-semibold leading-tight">
          Reprends ton
          <span class="text-primary">apprentissage Linux</span>
          maintenant
        </h1>

        <p class="text-gray-400 text-lg max-w-md">
          Connecte-toi pour accéder à tes VMs, tes cours et ta progression en temps réel.
        </p>

        <!-- fake terminal -->
        <div class="bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-sm text-green-400">
          <p>user@glyria:~$ ssh login</p>
          <p class="text-white/60">authenticating...</p>
          <p class="text-white/60">access ready</p>
        </div>

      </div>

      <!-- RIGHT (form) -->
      <UPageCard class="w-full bg-dark/60 border border-white/10 backdrop-blur text-white p-6 rounded-2xl">

        <UAuthForm
            :schema="schema"
            title="Connexion"
            icon="i-lucide-user"
            :fields="fields"
            :submit="{
            label: 'Se connecter',
            color: 'primary',
            variant: 'solid',
            loading: loginLoading
          }"
            @submit="onSubmit"
        >

          <!-- description -->
          <template #description>
            <p class="text-gray-400">
              Pas de compte ?
              <ULink to="/register" class="text-primary font-medium">
                Créer un compte
              </ULink>
            </p>

            <ULink to="/" class="text-sm text-gray-500 hover:text-white">
              ← Retour à l’accueil
            </ULink>
          </template>

          <!-- validation -->
          <template #validation>
            <UAlert
                v-if="loginError"
                color="error"
                icon="i-lucide-alert-circle"
                :title="loginError"
                class="mt-2"
            />
          </template>

          <template #password-hint>
            <ModalForgotPassword />
          </template>

          <!-- footer -->
          <template #footer>
            <p class="text-xs text-gray-500">
              En vous connectant, vous acceptez les CGU.
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

const { Login } = useAuth()

const loginError = ref('')
const loginLoading = ref(false)

const schema = z.object({
  email: z.email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loginLoading.value = true
  loginError.value = ''

  const res = await Login(payload.data)

  if (!res) {
    loginError.value = "Identifiants invalides"
  }

  loginLoading.value = false
}

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'ton@email.com',
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
    name: 'remember',
    type: 'checkbox',
    label: 'Se souvenir de moi'
  }
]
</script>