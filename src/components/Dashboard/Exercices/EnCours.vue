<template>
  <div class="flex flex-col gap-8 p-8 min-h-screen bg-dark">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight italic">Terminal d'Apprentissage</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium font-mono">
          PROMPT > Liste des modules d'exercices disponibles...
        </p>
      </div>

      <div class="flex gap-4">
        <UChip color="primary" variant="ghost">
          <UBadge color="neutral" variant="outline" class="font-mono">850 XP</UBadge>
        </UChip>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <UCard
          v-for="module in modules"
          :key="module.id"
          class="group relative transition-all duration-300 bg-white/[0.02] border-white/5 hover:border-primary/50 hover:bg-white/[0.04] overflow-hidden"
      >
        <div
            class="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-500"
            :style="{ width: `${module.progress}%` }"
        />

        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <UIcon :name="module.icon" class="w-5 h-5 text-primary-400" />
              </div>
              <h3 class="font-bold text-white tracking-wide">{{ module.title }}</h3>
            </div>
            <UBadge
                :color="module.isDeployed ? 'success' : 'neutral'"
                variant="soft"
                size="xs"
                class="font-mono uppercase text-[9px]"
            >
              {{ module.isDeployed ? 'Instance Active' : 'Hors-ligne' }}
            </UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-xs text-gray-400 leading-relaxed min-h-[40px]">
            {{ module.description }}
          </p>

          <div class="grid grid-cols-2 gap-2 p-3 rounded-lg bg-black/20 border border-white/5 font-mono text-[10px]">
            <div class="flex flex-col">
              <span class="text-gray-600 uppercase">OS</span>
              <span class="text-gray-300">{{ module.os }}</span>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-gray-600 uppercase">Difficulté</span>
              <span :class="difficultyColor(module.difficulty)">{{ module.difficulty }}</span>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-[10px] font-mono">
              <span class="text-gray-500">Progression du module</span>
              <span class="text-primary-400">{{ module.progress }}%</span>
            </div>
            <UProgress :value="module.progress" color="primary" size="2xs" />
          </div>
        </div>

        <template #footer>
          <div class="flex gap-3">
            <UButton
                v-if="!module.isDeployed"
                label="Déployer l'exercice"
                icon="i-heroicons-rocket-launch"
                block
                color="primary"
                variant="solid"
                class="font-bold cursor-pointer transition-transform active:scale-95"
                @click="deployVM(module)"
            />
            <div v-else class="flex gap-2 w-full">
              <UButton
                  label="Reprendre"
                  icon="i-heroicons-play"
                  class="flex-1 font-bold cursor-pointer"
                  color="success"
                  @click="openTerminal(module)"
              />
              <UButton
                  icon="i-heroicons-stop"
                  color="error"
                  variant="ghost"
                  class="cursor-pointer"
                  @click="stopVM(module)"
              />
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const modules = ref([
  {
    id: 1,
    title: 'Introduction au Shell',
    description: 'Apprenez les commandes de base (ls, cd, mkdir) dans un environnement Linux sécurisé.',
    icon: 'i-heroicons-terminal',
    os: 'Ubuntu 22.04 LTS',
    difficulty: 'Débutant',
    progress: 100,
    isDeployed: false
  },
  {
    id: 2,
    title: 'Sécurité Réseau',
    description: 'Analyse de trames et configuration de pare-feu avec iptables.',
    icon: 'i-heroicons-shield-check',
    os: 'Debian 11',
    difficulty: 'Intermédiaire',
    progress: 35,
    isDeployed: true
  },
  {
    id: 3,
    title: 'Docker & Conteneurs',
    description: 'Déploiement de micro-services et orchestration de base.',
    icon: 'i-heroicons-cube',
    os: 'Alpine Linux',
    difficulty: 'Avancé',
    progress: 0,
    isDeployed: false
  }
])

const difficultyColor = (level: string) => {
  if (level === 'Débutant') return 'text-green-400'
  if (level === 'Intermédiaire') return 'text-yellow-400'
  return 'text-red-400'
}

const deployVM = (module: any) => {
  module.isDeployed = true
  // Logique d'appel API vers ton backend Proxmox/Docker
}

const openTerminal = (module: any) => {
  // Redirection vers la page terminal de cette VM
  useRouter().push(`/machines/${module.id}/terminal`)
}

const stopVM = (module: any) => {
  module.isDeployed = false
}
</script>