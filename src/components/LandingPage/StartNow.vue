<script setup lang="ts">
</script>
<template>
  <section id="commencer-maintenant" class="relative bg-dark py-32 px-6 overflow-hidden">

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-0" />

    <div class="relative z-10 max-w-5xl mx-auto">
      <div class="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-12 md:p-20 shadow-2xl">

        <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div class="relative flex flex-col items-center text-center gap-8">

          <div class="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-400 text-xs font-mono uppercase tracking-[0.2em]">
            Prêt pour le déploiement ?
          </div>

          <h2 class="text-4xl md:text-6xl font-black text-white leading-tight">
            Maîtrisez le terminal <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">dès aujourd'hui.</span>
          </h2>

          <p class="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Rejoignez des centaines d'étudiants et de passionnés. Créez votre instance Linux en
            <span class="text-white font-semibold italic">moins de 30 secondes.</span>
          </p>

          <div class="flex flex-col items-center gap-4 w-full">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <UButton
                  size="xl"
                  color="primary"
                  class="relative px-12 py-5 text-xl font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  to="/register"
              >
                Inscription gratuite
                <template #trailing>
                  <UIcon name="i-heroicons-rocket-20-solid" class="ml-2 animate-bounce-horizontal" />
                </template>
              </UButton>
            </div>

            <div class="flex items-center gap-6 mt-4">
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <UIcon name="i-heroicons-credit-card-slash-20-solid" class="text-red-400/70" />
                Sans carte bancaire
              </div>
              <div class="w-1 h-1 rounded-full bg-white/20" />
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <UIcon name="i-heroicons-bolt-20-solid" class="text-yellow-400/70" />
                Accès instantané
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes bounce-horizontal {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}
.animate-bounce-horizontal {
  animation: bounce-horizontal 1s infinite;
}
</style>