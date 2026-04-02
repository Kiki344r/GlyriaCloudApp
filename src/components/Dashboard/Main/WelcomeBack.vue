<template>
  <UCard class="relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="w-full h-full bg-gradient-to-br from-primary-500 via-transparent to-green-500" />
    </div>

    <div class="relative flex flex-col md:flex-row justify-between gap-6 p-4">
      <!-- LEFT -->
      <div class="flex flex-col gap-4">
        <!-- Badge -->
        <div class="flex items-center gap-2">
          <UBadge color="success" variant="soft" class="font-mono">
            SYSTEM DASHBOARD
          </UBadge>
          <span class="text-xs text-gray-400 font-mono">
            ● online
          </span>
        </div>

        <!-- Title -->
        <div>
          <h1 class="text-2xl font-bold leading-tight">
            Bon retour,
            <br>
            <span class="text-primary-500">
              {{ userInfo?.firstName || "inconnu" }}
            </span>
          </h1>

          <p class="text-gray-400 mt-1">
            {{ hasLesson ? "Ta prochaine leçon t’attend." : "Aucune leçon en cours." }}
          </p>
        </div>

        <!-- Actions -->
        <div v-if="hasLesson" class="flex items-center gap-3 mt-2">
          <UButton icon="i-heroicons-play" size="sm">
            Continuer
          </UButton>

          <UButton variant="ghost" size="sm">
            Voir le parcours
          </UButton>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="flex flex-col justify-center min-w-[220px]">
        <div class="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <template v-if="hasLesson">
            <p class="text-xs text-gray-400 font-mono mb-1">
              LEÇON EN COURS
            </p>

            <p class="font-semibold truncate">
              {{ lessonTitle }}
            </p>

            <div class="mt-3">
              <div class="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progression</span>
                <span>{{ lessonProgress }}%</span>
              </div>

              <UProgress v-model="lessonProgress" />
            </div>
          </template>

          <template v-else>
            <p class="text-xs text-gray-400 font-mono">
              AUCUNE LEÇON EN COURS
            </p>

            <p class="text-sm text-gray-500 mt-2">
              Lance une leçon pour commencer ton apprentissage.
            </p>
          </template>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { Account } = useAuth()
const userInfo = Account().cache()

/**
 * MOCK DATA (tu remplaceras par ton composable)
 */
const hasLesson = ref<boolean>(true)

const lessonTitle = ref<string>("Introduction à Linux & au terminal")
const lessonProgress = ref<number>(42)
</script>