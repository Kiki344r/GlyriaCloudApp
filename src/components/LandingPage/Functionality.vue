<template>
  <section id="fonctionnalites" class="relative bg-dark text-white py-32 px-6 overflow-hidden">

    <div class="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div class="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>

    <div class="relative z-10 text-center max-w-3xl mx-auto mb-20">
      <div class="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary-400 text-xs font-mono mb-4 uppercase tracking-widest">
        Full Stack Training
      </div>
      <h2 class="text-4xl md:text-5xl font-bold tracking-tight">
        L'écosystème <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500">ultime</span> pour Linux
      </h2>
      <p class="text-gray-400 mt-6 text-lg leading-relaxed">
        Nous avons supprimé les fioritures pour ne garder que l'essentiel :
        une infrastructure robuste pour une pratique sans limite.
      </p>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="f in features"
          :key="f.title"
          class="group relative"
      >
        <div class="absolute -inset-[1px] bg-gradient-to-br from-white/20 to-transparent rounded-2xl blur-[0.5px] transition-all duration-500 group-hover:from-primary/50 group-hover:to-purple-500/30" />

        <div class="relative h-full rounded-2xl bg-zinc-950/80 backdrop-blur-xl p-8 transition-all duration-300 group-hover:-translate-y-1">

          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] transition-all">
              <UIcon :name="f.icon" class="text-primary text-3xl" />
            </div>

            <div>
              <h3 class="text-xl font-bold group-hover:text-primary transition-colors">
                {{ f.title }}
              </h3>
              <p class="text-gray-400 mt-2 text-sm leading-relaxed">
                {{ f.description }}
              </p>
            </div>
          </div>

          <div class="my-6 h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

          <div class="flex flex-wrap gap-2">
            <span
                v-for="item in f.items"
                :key="item"
                class="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-gray-300 uppercase tracking-tight group-hover:border-white/10 group-hover:bg-white/10 transition-all"
            >
              {{ item }}
            </span>
          </div>

          <div class="mt-8 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
            En savoir plus <UIcon name="i-heroicons-arrow-right-20-solid" class="ml-2" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const features = [
  {
    title: "Instances Dédiées",
    icon: "i-heroicons-server-stack",
    description: "Chaque session lance un conteneur isolé pour une liberté totale sans risque pour ton OS.",
    items: ["Debian / Ubuntu", "Snapshot Instantané", "Accès Root"]
  },
  {
    title: "Parcours Guidé",
    icon: "i-heroicons-academic-cap",
    description: "Une progression logique : du premier 'ls' à la gestion complexe de clusters Kubernetes.",
    items: ["Lab Interactif", "Vérification en temps réel", "Hints intelligents"]
  },
  {
    title: "Certification",
    icon: "i-heroicons-trophy",
    description: "Valide tes acquis avec des examens chronométrés et reçois un badge vérifiable on-chain.",
    items: ["Mode Examen", "Score Technique", "Partage LinkedIn"]
  },
  {
    title: "Espaces Collaboratifs",
    icon: "i-heroicons-user-group",
    description: "Crée des classes, partage ton terminal avec un mentor ou travaille en binôme sur un bug.",
    items: ["Pair Programming", "Suivi Instructeur", "Shared Terminals"]
  },
  {
    title: "Analytics Avancés",
    icon: "i-heroicons-chart-bar",
    description: "Analyse ton temps de frappe, tes erreurs récurrentes et ton taux de réussite par module.",
    items: ["Heatmap de frappe", "Progression %", "Historique Bash"]
  },
  {
    title: "Infrastructure Secure",
    icon: "i-heroicons-shield-check",
    description: "Pratique le Pentest ou le Hardening dans un environnement sandboxé 100% sécurisé.",
    items: ["Sandboxing gVisor", "Réseau Isolé", "Reset 1-Click"]
  }
]
</script>