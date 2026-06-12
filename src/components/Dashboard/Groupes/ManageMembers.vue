<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="space-y-1">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Membres</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ members.length }} membre(s) dans ce groupe.</p>
    </div>

    <USeparator />

    <!-- Table -->
    <UTable :data="members" :columns="columns">
      <template #name-cell="{ row }">
        <div class="flex items-center gap-2">
          <UAvatar :alt="`${row.original.user.firstName} ${row.original.user.lastName}`" size="xs" />
          <span class="text-sm">{{ row.original.user.firstName }} {{ row.original.user.lastName }}</span>
        </div>
      </template>

      <template #role-cell="{ row }">
        <UBadge variant="soft" color="neutral" size="sm">
          {{ row.original.role.name }}
        </UBadge>
      </template>

      <template #actions-cell="{ row }">
        <UButton
            size="xs"
            variant="ghost"
            color="error"
            icon="i-heroicons-user-minus"
            label="Kick"
            :loading="kickingUUID === row.original.user.UUID"
            @click="openKickConfirm(row.original)"
        />
      </template>
    </UTable>

    <!-- Empty state -->
    <div v-if="members.length === 0" class="text-center py-8">
      <p class="text-sm text-gray-400">Aucun membre dans ce groupe.</p>
    </div>

    <!-- Modal confirmation kick -->
    <UModal v-model:open="kickModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <p class="font-medium">Exclure un membre</p>
          </template>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            Voulez-vous vraiment exclure
            <span class="font-medium text-gray-900 dark:text-gray-100">
              {{ selectedMember?.user.firstName }} {{ selectedMember?.user.lastName }}
            </span>
            du groupe ? Cette action est irréversible.
          </p>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                  label="Annuler"
                  variant="ghost"
                  color="neutral"
                  @click="kickModalOpen = false"
              />
              <UButton
                  label="Exclure"
                  color="error"
                  :loading="kickLoading"
                  @click="confirmKick"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const { getGroupById, kickMember } = useGroups()

const groupId = route.params.groupId as string
const group = await getGroupById(groupId)
if (!group) throw createError({ statusCode: 404, statusMessage: 'Groupe introuvable' })

const members = ref<groupMember[]>(group.group.members)

const columns = [
  { id: 'name',    accessorKey: 'name',    header: 'Membre' },
  { id: 'role',    accessorKey: 'role',    header: 'Rôle' },
  { id: 'actions', accessorKey: 'actions', header: '' }
]

// -- Kick --
const kickModalOpen = ref(false)
const kickLoading = ref(false)
const kickingUUID = ref<string | null>(null)
const selectedMember = ref<groupMember | null>(null)

function openKickConfirm(member: groupMember) {
  selectedMember.value = member
  kickModalOpen.value = true
}

async function confirmKick() {
  if (!selectedMember.value) return
  kickLoading.value = true

  const res = await kickMember({
    groupId: groupId,
    userId: selectedMember.value.user.UUID
  })

  if (!res) {
    kickLoading.value = false
    kickModalOpen.value = false
    return
  }

  members.value = members.value.filter(m => m.user.UUID !== selectedMember.value!.user.UUID)

  kickLoading.value = false
  kickModalOpen.value = false

  toast.add({
    title: `${selectedMember.value.user.firstName} ${selectedMember.value.user.lastName} a été exclu du groupe.`,
    color: 'success'
  })

  selectedMember.value = null
}
</script>