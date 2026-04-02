<template>
  <div class="flex flex-col gap-8 p-8 min-h-screen bg-dark">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">
          Mes Groupes
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          Gérez vos collaborations et accédez à vos environnements partagés.
        </p>
      </div>

      <UButton
          v-if="groups.length > 0"
          icon="i-heroicons-plus-circle"
          label="Rejoindre un groupe"
          color="primary"
          @click="storeRef.open.value = true"
      />
    </div>

    <UCard
        v-if="groups.length === 0"
        class="bg-white/[0.02] border-dashed border-2 border-white/10"
    >
      <div class="py-12 flex flex-col items-center text-center">
        <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-600 mb-4" />
        <h3 class="text-xl font-semibold text-white">Aucun groupe rejoint</h3>
        <p class="text-gray-500 max-w-xs mt-2 mb-6">
          Vous n'avez pas encore de groupe. Demandez un code d'invitation pour commencer.
        </p>
        <UButton
            label="Rejoindre mon premier groupe"
            color="primary"
            variant="solid"
            @click="storeRef.open.value = true"
        />
      </div>
    </UCard>

    <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <UCard
          v-for="group in groups"
          :key="group.UUID"
          class="group hover:ring-2 hover:ring-primary/50 transition-all duration-300 bg-white/[0.03] border-white/5"
      >
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
              {{ group.name }}
            </h3>
            <UIcon name="i-heroicons-shield-check" class="text-primary-500/50 w-5 h-5" />
          </div>

          <div class="flex items-center gap-2 text-sm text-gray-400">
            <UAvatar
                :alt="group.owner.firstName"
                size="xs"
                class="bg-primary/20 text-primary-400"
            />
            <span>{{ group.owner.firstName }} {{ group.owner.lastName }}</span>
          </div>

          <div class="mt-4 pt-4 border-t border-white/5 flex justify-end">
            <ModalValidGroupLeave :uuid="group.UUID" />
          </div>
        </div>
      </UCard>

      <button
          @click="storeRef.open.value = true"
          class="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group"
      >
        <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <UIcon name="i-heroicons-plus" class="w-6 h-6 text-gray-400 group-hover:text-primary-400" />
        </div>
        <span class="text-sm font-medium text-gray-500 group-hover:text-primary-400">Rejoindre un autre groupe</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getGroupsRef } = useGroups()
const groups = getGroupsRef()

const store = useGroupCodeStore()
const storeRef = storeToRefs(store)
</script>