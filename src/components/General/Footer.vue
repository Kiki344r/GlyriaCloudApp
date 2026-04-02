<template>
  <footer class="relative bg-[#0B0F1A] border-t border-white/5 pt-16 pb-8 px-6 overflow-hidden">
    <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

        <div class="lg:col-span-2 flex flex-col gap-6">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <LazyNuxtImg
                src="/glyria-logo.png"
                alt="Logo"
                class="h-10 w-10 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors"
            />
            <span class="text-xl font-bold text-white tracking-tight">
              Glyria<span class="text-primary-400">Cloud</span>
            </span>
          </NuxtLink>
          <p class="text-gray-500 text-sm leading-relaxed max-w-sm">
            Plateforme de formation Linux interactive. Apprenez l'administration système en conditions réelles, développée avec passion par des étudiants pour la communauté.
          </p>
          <a
              href="https://github.com/Kiki344r/GlyriaCloudFrontEnd"
              target="_blank"
              class="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            <UIcon name="i-simple-icons-github" />
            Open Source sur GitHub
          </a>
        </div>

        <div v-for="col in footerLinks" :key="col.label" class="flex flex-col gap-4">
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider">{{ col.label }}</h3>
          <ul class="flex flex-col gap-2">
            <li v-for="link in col.children" :key="link.label">
              <NuxtLink
                  :to="link.to"
                  :target="link.target"
                  class="text-gray-500 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-gray-600 font-mono">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500/40 animate-pulse"></span>
          © {{ currentYear }} Glyria Cloud — Projet pédagogique
        </div>

        <div class="flex gap-8">
          <NuxtLink to="/mentions-legales" class="hover:text-white transition-colors">Mentions légales</NuxtLink>
          <NuxtLink to="/cgu" class="hover:text-white transition-colors">CGU</NuxtLink>
          <span class="hidden md:inline text-gray-800">|</span>
          <span class="text-gray-500 italic">Built for Bac Pro CIEL</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

// J'ai retiré "Légal" car il est déjà présent dans le footer-bottom,
// ça permet d'aérer les colonnes du haut.
const footerLinks = [
  {
    label: 'Projet',
    children: [
      { label: 'À propos', to: '/a-propos' },
      { label: 'Contributeurs', to: '/equipe' },
      { label: 'GitHub', to: 'https://github.com/Kiki344r/GlyriaCloudFrontEnd', target: '_blank' }
    ]
  },
  {
    label: 'Apprentissage',
    children: [
      { label: 'Parcours Linux', to: '/formations' },
      { label: 'Labs interactifs', to: '/tutoriels' },
      { label: 'Certification', to: '/docs' }
    ]
  },
  {
    label: 'Support',
    children: [
      { label: 'Documentation', to: '/docs' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: 'mailto:contact@glyria.fr' }
    ]
  }
]
</script>