<script setup lang="ts">
</script>
<template>
  <header class="fixed top-0 left-0 w-full h-16 bg-[#0B0F1A] border-b border-white/10 z-50 flex items-center shadow-2xl">
    <div class="max-w-7xl mx-auto w-full px-6 flex items-center justify-between text-white">

      <NuxtLink
          to="/"
          class="flex items-center gap-3 transition hover:opacity-80"
      >
        <img
            src="/glyria-logo.png"
            alt="Logo"
            class="h-10 w-10 rounded-xl border border-white/20"
        />
        <span class="text-xl font-bold tracking-tight">
          Glyria<span class="text-primary-400">Cloud</span>
        </span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8">
        <a href="#terminal" class="text-sm font-medium text-gray-400 hover:text-primary-400 transition-colors">Terminal</a>
        <a href="#fonctionnalites" class="text-sm font-medium text-gray-400 hover:text-primary-400 transition-colors">Fonctionnalités</a>
        <a href="#pourquoi-nous" class="text-sm font-medium text-gray-400 hover:text-primary-400 transition-colors">Pourquoi nous</a>
      </nav>

      <div class="flex items-center gap-4">
        <ButtonAccount />

      </div>

    </div>
  </header>

  <div class="h-16"></div>
</template>