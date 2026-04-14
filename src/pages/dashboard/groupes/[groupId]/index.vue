<template>
  <div class="p-8 flex flex-col gap-8 min-h-screen bg-dark">
    <div class="space-y-4">
      <div class="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
        <ULink to="/dashboard/groupes" class="hover:text-primary-400">Groupes</ULink>
        <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
        <span class="text-white">Détails du groupe</span>
      </div>

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold text-white tracking-tight">{{ groupData?.group.name || 'Chargement...' }}</h1>
            <UBadge variant="subtle" color="primary" size="xs" class="font-mono">ID: {{ groupdId.toString().slice(0, 8) }}</UBadge>
          </div>
          <p class="text-gray-500 text-sm max-w-2xl">
            {{ groupData?.group.description || 'Chargement...' }}
          </p>
        </div>

        <div class="flex gap-2">
          <UButton icon="i-heroicons-chat-bubble-left-right" color="neutral" variant="ghost" label="Chat" />
          <ModalValidGroupLeave :uuid="route.params.groupId as string" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 lg:col-span-8 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <UIcon name="i-heroicons-cpu-chip" class="text-primary-400" />
            Modules d'exercices (VMs)
          </h2>
          <span class="text-xs font-mono text-gray-500">{{ activeModules.length }} Instance(s) active(s)</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCard
              v-for="module in modules"
              :key="module.id"
              class="bg-white/[0.02] border-white/5 hover:border-primary-500/30 transition-all group"
          >
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-start">
                <div class="p-2 rounded-lg bg-primary/10 text-primary-400 group-hover:scale-110 transition-transform">
                  <UIcon :name="module.icon" class="w-6 h-6" />
                </div>
                <UBadge :color="module.isDeployed ? 'success' : 'neutral'" variant="soft" size="xs">
                  {{ module.isDeployed ? 'Running' : 'Offline' }}
                </UBadge>
              </div>

              <div>
                <h3 class="font-bold text-white group-hover:text-primary-400 transition-colors">{{ module.title }}</h3>
                <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ module.description }}</p>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                  <span class="text-gray-600">Progression</span>
                  <span class="text-white">{{ module.progress }}%</span>
                </div>
                <UProgress :modelValue="module.progress" size="2xs" color="primary" />
              </div>

              <UButton
                  :label="module.isDeployed ? 'Accéder au Terminal' : 'Déployer le module'"
                  :icon="module.isDeployed ? 'i-heroicons-command-line' : 'i-heroicons-rocket-launch'"
                  :color="module.isDeployed ? 'success' : 'primary'"
                  variant="subtle"
                  block
                  class="mt-2 font-bold cursor-pointer"
                  @click="module.isDeployed ? openTerminal(module.id) : deployModule(module.id)"
              />
            </div>
          </UCard>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4 space-y-8">
        <UCard class="bg-gradient-to-br from-primary-950/20 to-transparent border-primary-500/10">
          <template #header>
            <h3 class="text-sm font-bold text-white uppercase tracking-widest font-mono">Ma Progression</h3>
          </template>
          <div class="flex flex-col items-center gap-4 py-4">
            <div class="relative flex items-center justify-center">
              <span class="text-4xl font-black text-white italic">64%</span>
            </div>
            <p class="text-xs text-gray-500 text-center">Plus que 2 modules pour compléter ce cursus !</p>
          </div>
        </UCard>

        <div class="space-y-4">
          <h3 class="text-sm font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
            <UIcon name="i-heroicons-users" class="text-gray-500" />
            Membres ({{ members.length }})
          </h3>
          <div class="space-y-2">
            <div v-for="member in members" :key="member.id" class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div class="flex items-center gap-3">
                <UAvatar :alt="member.name" size="sm" />
                <div>
                  <p class="text-sm font-medium text-white">{{ member.name }}</p>
                  <p class="text-[10px] text-gray-600 font-mono">{{ member.role }}</p>
                </div>
              </div>
              <div v-if="member.online" class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-groupes'
})

const route = useRoute()
const groupdId = route.params.groupId as string
const { getGroupById } = useGroups() // Imaginons que tu aies cette méthode

const group = await getGroupById(groupdId)
const groupData = group ? group : null

const modules = ref([
  { id: 100, title: 'Bash Scripting Avançé', description: 'Automatisation de tâches complexes sous Linux.', icon: 'i-heroicons-code-bracket', progress: 100, isDeployed: false },
  { id: 101, title: 'Infiltration Réseau', description: 'Tests d\'intrusion sur serveurs vulnérables.', icon: 'i-heroicons-globe-alt', progress: 28, isDeployed: true },
  { id: 102, title: 'Analyse de Logs', description: 'Détection d\'anomalies avec ELK Stack.', icon: 'i-heroicons-document-magnifying-glass', progress: 0, isDeployed: false },
])
console.log(groupData)
const members = groupData ? groupData.group.members.map(user => ({
  id: user.user.UUID,
  name: user.user.firstName + ' ' + user.user.lastName,
  role: user.role.name,
  online: false,
})): []

const activeModules = computed(() => modules.value.filter(m => m.isDeployed))

const deployModule = (id: number) => {
  const m = modules.value.find(m => m.id === id)
  if (m) m.isDeployed = true
}

const openTerminal = (id: number) => {
  useRouter().push(`/dashboard/terminal/pve/${id}`)
}
</script>