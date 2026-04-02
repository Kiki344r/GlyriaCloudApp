<script setup lang="ts">
</script>
<template>
  <section class="relative bg-dark overflow-hidden selection:bg-primary/30">
    <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
    <div class="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full" />

    <div class="relative max-w-7xl mx-auto px-6 min-h-screen flex items-center py-20">
      <div class="grid lg:grid-cols-2 gap-16 items-center w-full">

        <div class="flex flex-col gap-8">
          <div class="w-fit flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium uppercase tracking-wider text-primary-400">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Interactive Learning Platform
          </div>

          <h1 class="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
            Devenez pro Linux <br />
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400">
              sans une seule vidéo.
            </span>
          </h1>

          <p class="text-gray-400 text-xl leading-relaxed max-w-lg">
            Oubliez les tutoriels interminables. Accédez à un terminal instantané,
            relevez des défis concrets et progressez par l'action.
          </p>

          <div class="flex flex-wrap gap-4 mt-4">
            <UButton
                size="xl"
                color="primary"
                class="px-8 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              Lancer mon terminal
            </UButton>

            <UButton
                size="xl"
                variant="ghost"
                class="text-white hover:bg-white/5 border border-white/10"
                icon="i-heroicons-play-circle"
            >
              Démo live
            </UButton>
          </div>

          <div class="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-white/5">
            <div>
              <p class="text-2xl font-bold text-white">100%</p>
              <p class="text-sm text-gray-500 uppercase tracking-wide">Hands-on</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">0s</p>
              <p class="text-sm text-gray-500 uppercase tracking-wide">Setup Time</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">Inclus</p>
              <p class="text-sm text-gray-500 uppercase tracking-wide">Certificat</p>
            </div>
          </div>
        </div>

        <div class="relative group">
          <div class="absolute -top-6 -right-6 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl z-20 hidden md:block animate-bounce-slow">
            <p class="text-xs text-primary-300 font-mono">SSH session active</p>
          </div>

          <div class="relative bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl transform transition-all group-hover:rotate-1 group-hover:scale-[1.02]">

            <div class="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/10">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-[#FF5F56] rounded-full" />
                <div class="w-3 h-3 bg-[#FFBD2E] rounded-full" />
                <div class="w-3 h-3 bg-[#27C93F] rounded-full" />
              </div>
              <div class="text-[10px] text-gray-500 font-mono">bash — 80x24</div>
            </div>

            <div class="p-6 font-mono text-sm sm:text-base min-h-[300px]">
              <div class="space-y-3">
                <div class="flex gap-3">
                  <span class="text-primary-400">➜</span>
                  <span class="text-gray-300">apt install knowledge</span>
                </div>
                <div class="text-gray-500 italic">
                  Reading package lists... Done
                </div>
                <div class="flex gap-3">
                  <span class="text-primary-400">➜</span>
                  <span class="text-gray-300">ls -la /skills</span>
                </div>
                <div class="grid grid-cols-2 text-purple-400 opacity-80">
                  <span>drwxr-xr-x bash</span>
                  <span>drwxr-xr-x docker</span>
                  <span>drwxr-xr-x kernel</span>
                  <span>drwxr-xr-x networking</span>
                </div>
                <div class="flex gap-3 pt-2">
                  <span class="text-primary-400">➜</span>
                  <span class="text-white inline-flex animate-pulse items-center">
                    learning_mode --active
                    <span class="ml-1 w-2 h-5 bg-primary-500"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="absolute inset-0 -z-10 blur-[80px] bg-primary/30 rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>