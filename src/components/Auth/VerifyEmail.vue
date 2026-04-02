<template>
  <div>
    <UPageCard
      title="Validation de l'email"
      description="Nous sommes en train de valider votre adresse email, cela peut prendre quelques secondes..."
    />
  </div>
</template>

<script setup lang="ts">
const { VerifyEmail } = useAuth()
const toast = useToast()

const router = useRouter()
const route = useRoute()
const token = route.query.token as string

const ValidateEmailStatus = await VerifyEmail({ token: token || '' })
if (!ValidateEmailStatus) {
  toast.add({
    title: 'Lien invalide',
    description: 'Le lien de validation de l\'email est expiré ou inexistant.',
    color: 'error'
  })
  router.push('/')
} else {
  router.push('/dashboard')
}
</script>
