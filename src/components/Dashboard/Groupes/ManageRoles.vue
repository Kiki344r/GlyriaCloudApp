<template>
  <div class="space-y-8">

    <!-- Rôle par défaut -->
    <div class="space-y-2">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Rôle par défaut</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">Rôle attribué automatiquement aux nouveaux membres.</p>
      <USelectMenu
          v-model="defaultRole"
          :items="roleOptions"
          class="w-64"
      />
    </div>

    <USeparator />

    <!-- Rôles -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Rôles</p>
        <ModalCreateRole
            v-model:open="createRoleOpen"
            v-model:loading="createRoleLoading"
            v-model:disable-close="createRoleDisableClose"
            :all-permissions="allPermissions"
            @submit="onCreateRole"
            @close="createRoleOpen = false"
        />
      </div>

      <div class="space-y-2">
        <div
            v-for="role in roles"
            :key="role.UUID"
            class="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <div class="flex items-center gap-3">
            <div class="size-2 rounded-full" />
            <div>
              <p class="text-sm font-medium">{{ role.name }}</p>
              <p class="text-xs text-gray-400">{{ role.permissions.length }} permission(s)</p>
            </div>
          </div>
          <ModalManageRole
              v-model:open="manageRoleOpen"
              v-model:loading="manageRoleLoading"
              v-model:disable-close="manageRoleDisableClose"
              :role="selectedRole"
              :members="membersOfRole"
              :all-permissions="allPermissions"
              @submit="onUpdateRole"
              @delete="onDeleteRole"
              @close="manageRoleOpen = false"
              @click="selectedRole = role; manageRoleOpen = true"
          />
        </div>
      </div>
    </div>

    <USeparator />

    {{selectedRole}}

    <!-- Membres -->
    <div class="space-y-3">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Membres</p>
      <UTable :data="memberRows" :columns="memberColumns">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar :alt="row.original.name" size="xs" />
            <span class="text-sm">{{ row.original.name }}</span>
          </div>
        </template>
        <template #role-cell="{ row }">
          <USelectMenu
              v-model="row.original.selectedRole"
              :items="roleOptions"
              size="xs"
              class="w-40"
              @update:model-value="onUpdateMemberRole(row.original, row.original.selectedRole)"
          />
        </template>
      </UTable>
    </div>

  </div>
</template>

<script setup lang="ts">
interface Permission {
  value: string
  label: string
  description: string
}

interface RoleOption {
  label: string
  value: string
}

const toast = useToast()
const route = useRoute()
const { getGroupById, createRole, updateRole, deleteRole, updateDefaultRole, updateMemberRole } = useGroups()

const groupId = route.params.groupId as string
const group = await getGroupById(groupId)
if (!group) throw createError({ statusCode: 404, statusMessage: 'Groupe introuvable' })

// -- Permissions disponibles --
const allPermissions: Permission[] = [
  { value: 'EXERCISES',        label: 'Exercices',          description: 'Accéder aux exercices du groupe' },
  { value: 'MANAGE_EXERCISES', label: 'Gérer les exercices', description: 'Créer et modifier les exercices' },
  { value: 'MANAGE_MEMBERS',   label: 'Gérer les membres',  description: 'Ajouter / retirer des membres' },
  { value: 'MANAGE_CODES',     label: 'Gérer les codes',    description: 'Créer et révoquer les codes d\'invitation' },
  { value: 'MANAGE_ROLES',     label: 'Gérer les rôles',    description: 'Créer et modifier les rôles' },
  { value: 'MANAGE_SETTINGS',  label: 'Gérer les paramètres', description: 'Modifier les paramètres du groupe' }
]
console.log("group", group)
// -- Données --
const roles = ref<groupRole[]>(
    group.group.roles as unknown as groupRole[]
)

const members = ref<groupMember[]>(
    group.group.members
)

const roleOptions = computed<RoleOption[]>(() =>
    roles.value.map(r => ({ label: r.name, value: r.UUID }))
)

// Rôle par défaut → objet { label, value }
const defaultRole = ref<RoleOption | null>(
    roleOptions.value.find(r => r.value === group.group.defaultRoleId) || null
)

watch(defaultRole, async (newVal) => {
  if (!newVal) return
  const res = await updateDefaultRole({
    groupId: groupId,
    roleId: newVal.value
  })
  console.log(res)
  if (res) {
    toast.add({
      title: "Rôle par défaut modifié",
      description: `Le rôle par défaut du groupe ${group.group.name} a été changé par ${newVal.label}`,
      color: "success"
    })
  }
})

// -- Table membres --
const memberColumns = [
  { id: 'name', accessorKey: 'name', header: 'Membre' },
  { id: 'role', accessorKey: 'role', header: 'Rôle' }
]

const memberRows = computed(() =>
    members.value.map(m => ({
      ...m,
      name: `${m.user.firstName} ${m.user.lastName}`,
      role: m.role.name,
      selectedRole: roleOptions.value.find(r => r.value === m.role.UUID) || null
    }))
)

// -- Gérer un rôle --
const selectedRole = ref<groupRole | null>(null)
const manageRoleOpen = ref(false)
const manageRoleLoading = ref(false)
const manageRoleDisableClose = ref(false)

const membersOfRole = computed(() =>
    selectedRole.value
        ? members.value.filter(m => m.role.UUID === selectedRole.value!.UUID)
        : []
)

async function onUpdateMemberRole(member: groupMember, newRole: RoleOption) {
  console.log(`Mise à jour du rôle de ${member.user.firstName} ${member.user.lastName} ${member.user.UUID} vers ${newRole.label} ${newRole.value}`)
  const res = await updateMemberRole({
    groupId: groupId,
    userId: member.user.UUID,
    roleId: newRole.value
  })
  if (res) {
    toast.add({
      title: "Membre mise à jour",
      description: `Le rôle du membre a été mis à jour par ${newRole.label}.`,
      color: "success"
    })
  }
}

async function onUpdateRole(data: groupRole) {
  const idx = roles.value.findIndex(r => r.UUID === data.UUID)
  if (idx !== -1) roles.value[idx] = data
  manageRoleOpen.value = false
  const res = await updateRole({
    groupId: groupId,
    permissions: data.permissions,
    name: data.name,
    UUID: data.UUID
  })
  if (res) {
    toast.add({
      title: "Rôle mis à jour",
      description: "Le rôle a été mis à jour avec les nouvelles informations.",
      color: "success"
    })
  }
}

async function onDeleteRole(uuid: string) {

  if (members.value.find(m => m.role.UUID === uuid)) {
    toast.add({
      title: "Une erreur est survenue",
      description: "Vous ne pouvez pas supprimer un rôle qui est encore attribué à des membres. Veuillez d'abord réattribuer ou exclure ces membres.",
      color: "error"
    })
    return
  }

  roles.value = roles.value.filter(r => r.UUID !== uuid)
  manageRoleOpen.value = false
  const res = await deleteRole({
    groupId: groupId,
    UUID: uuid
  })
  if (res) {
    toast.add({
      title: "Rôle supprimé",
      description: "Le rôle a été supprimé du groupe.",
      color: "success"
    })
  }
}

// -- Créer un rôle --
const createRoleOpen = ref(false)
const createRoleLoading = ref(false)
const createRoleDisableClose = ref(false)

async function onCreateRole(data: { name: string, permissions: string[] }) {
  roles.value.push({
    UUID: crypto.randomUUID(),
    name: data.name,
    permissions: data.permissions
  })
  createRoleOpen.value = false
  const res = await createRole({
    groupId: groupId,
    name: data.name,
    permissions: data.permissions
  })
  if (res) {
    toast.add({
      title: "Rôle créé",
      description: "Le rôle a été créé et ajouté au groupe.",
      color: "success"
    })
  }
}
</script>