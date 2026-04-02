<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
      Applications
    </h1>
    <div>

      <div class="flex items-center justify-between mb-4">
        <h2>Démarrage automatique de l'application</h2>
        <USwitch :model-value="automaticStart" @update:model-value="toggleAutostart"/>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';

const automaticStart = ref(await isEnabled())

async function toggleAutostart(value: boolean) {
  if (value) {
    await enable();
  } else {
    await disable();
  }
  automaticStart.value = value;
}
</script>