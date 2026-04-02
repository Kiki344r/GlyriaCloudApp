<template>
  <section id="pourquoi-nous" class="relative bg-dark py-24 overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-4xl font-bold text-white mb-6 leading-tight">
            Pourquoi choisir <br />
            <span class="text-primary-400">Glyria Cloud ?</span>
          </h2>
          <p class="text-gray-400 text-lg leading-relaxed">
            Conçu pour les étudiants et professionnels, Glyria Cloud élimine la barrière de la configuration locale pour se concentrer sur l'essentiel : <span class="text-white">la maîtrise du shell.</span>
          </p>
        </div>

        <div class="space-y-6">
          <div v-for="(check, index) in checkmarks" :key="index" class="group flex gap-4">
            <div class="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <UIcon name="i-heroicons-check-circle-20-solid" class="text-primary-400" />
            </div>
            <div>
              <h4 class="text-white font-semibold">{{ check.title }}</h4>
              <p class="text-gray-500 text-sm mt-1">{{ check.desc }}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
          <div class="p-2 bg-white/5 rounded-lg text-xs font-mono text-gray-400">PARTENAIRE</div>
          <p class="text-sm text-gray-400 italic">
            Optimisé pour le <span class="text-white">Bac Pro CIEL</span>.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 grid-rows-2 gap-4 h-[450px]">

        <div class="relative group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 flex flex-col justify-end">
          <div class="absolute top-6 left-6 p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <UIcon name="i-solar-cpu-linear" class="text-3xl text-primary-400" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white tracking-tight">∞ VMs</p>
            <p class="text-gray-500 text-sm uppercase tracking-wider">Instances Illimitées</p>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div class="relative group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 flex flex-col justify-end">
          <div class="absolute top-6 left-6 p-3 rounded-2xl bg-secondary/10 border border-secondary/20">
            <UIcon name="i-typcn-flow-merge" class="text-3xl text-secondary-400" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white tracking-tight">100%</p>
            <p class="text-gray-500 text-sm uppercase tracking-wider">Disponibilité</p>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div class="relative group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 flex flex-col justify-end">
          <div class="absolute top-6 left-6 p-3 rounded-2xl bg-info/10 border border-info/20">
            <UIcon name="i-solar-code-2-bold" class="text-3xl text-info-400" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white tracking-tight">50+</p>
            <p class="text-gray-500 text-sm uppercase tracking-wider">Labs Pratiques</p>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-info/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div class="relative group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 flex flex-col justify-end">
          <div class="absolute top-6 left-6 p-3 rounded-2xl bg-success/10 border border-success/20">
            <UIcon name="i-mdi-source-branch" class="text-3xl text-success-400" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white tracking-tight">24/7</p>
            <p class="text-gray-500 text-sm uppercase tracking-wider">Accès Cloud</p>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const checkmarks = [
  {
    title: "Formation pratique",
    desc: "Apprenez en manipulant de vraies machines virtuelles Linux isolées."
  },
  {
    title: "Sécurité Enterprise",
    desc: "Vos environnements et votre progression sont protégés par l'authentification A2F."
  },
  {
    title: "Projet pédagogique",
    desc: "Contenu aligné sur les exigences métiers du Bac Pro CIEL."
  }
]
</script>