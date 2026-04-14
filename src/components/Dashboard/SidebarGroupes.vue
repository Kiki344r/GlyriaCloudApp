<template>
  <UDashboardSidebar
      class="bg-dark border-r border-white/5 shadow-2xl shadow-black/50"
      resizable
      collapsible
      :min-size="10"
      :default-size="16"
      :max-size="20"
      :collapsed-size="0"
  >
    <template #header="{ collapsed }">
      <ULink
          v-if="!collapsed"
          to="/"
          class="flex items-center gap-3 px-2 py-1 transition-all duration-300 hover:opacity-80 group"
      >
        <div class="relative">
          <div
              class="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"/>
          <lazy-nuxt-img
              src="/glyria-logo.png"
              alt="Glyria Logo"
              class="relative h-9 w-9 rounded-xl border border-white/10"
          />
        </div>
        <div
            class="flex flex-col leading-none transition-opacity duration-300"
        >
          <span class="font-bold text-white text-lg tracking-tight">Glyria</span>
          <span class="text-[10px] text-primary-400 font-mono uppercase tracking-widest mt-0.5">Cloud OS</span>
        </div>
      </ULink>
      <div
          v-else
          class="flex flex-col justify-center items-center w-full">
        <ULink
            to="/"
            class="flex items-center transition-all duration-300 hover:opacity-80 group"
        >
          <div class="relative">
            <div
                class="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"/>
            <lazy-nuxt-img
                src="/glyria-logo.png"
                alt="Glyria Logo"
                class="relative rounded-xl border border-white/10"
            />
          </div>
          <div
              class="flex flex-col leading-none transition-opacity duration-300"
          >

          </div>
        </ULink>
      </div>
    </template>

    <template #default="{ collapsed }">
      <div :class="['flex flex-col w-auto gap-y-4 px-2 mt-4', { 'items-center': collapsed}]">
        <UNavigationMenu
            :collapsed="collapsed"
            :items="mainNavigation"
            orientation="vertical"
        />

        <USeparator v-if="!collapsed" class="my-2 opacity-20"/>

        <UNavigationMenu
            :collapsed="collapsed"
            :items="groupesNavigation"
            orientation="vertical"
            class="mt-auto pb-4"
        />

        <USeparator v-if="!collapsed" class="my-2 opacity-20"/>

        <UNavigationMenu
            :collapsed="collapsed"
            :items="secondaryNavigation"
            orientation="vertical"
            class="mt-auto pb-4"
        />
      </div>
    </template>

    <template #footer="{ collapsed }">
      <div :class="['flex border-t border-white/5 pt-4 w-full px-2', {'items-center justify-center': collapsed}]">
        <ButtonAccount :collapsed="collapsed" class="hover:bg-white/5 rounded-xl transition-colors"/>
      </div>
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const {getGroupsRef, getGroupById} = useGroups()
const groups = getGroupsRef()
const router = useRouter()
const toast = useToast()

const groupdId = useRoute().params.groupId as string
const group = await getGroupById(groupdId)
if (!group) {
  toast.add({
    title: 'Groupe introuvable',
    description: 'Le groupe que vous recherchez n\'existe pas.',
    color: 'error',
    icon: 'i-heroicons-x-circle'
  })
  throw router.push('/dashboard/groupes')
}

// On sépare les items pour plus de clarté
const mainNavigation = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Tableau de bord',
    icon: 'i-heroicons-squares-2x2',
    to: '/dashboard',
    exact: true
  },
  {
    label: 'Groupes',
    icon: 'i-heroicons-user-group',
    to: '/dashboard/groupes',
    defaultOpen: true,
    children: groups.value.map(group => ({
      label: group.name,
      to: `/dashboard/groupes/${group.UUID}`
    }))
  },
  {
    label: 'Paramètres',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/dashboard/settings',
    children: [
      { label: 'Général', to: '/dashboard/settings' },
      { label: 'Membres', to: '/dashboard/settings/members' },
      { label: 'Sécurité', to: '/dashboard/settings/security' },
      { label: 'Application', to: '/dashboard/settings/app' }
    ]
  }
])

const secondaryNavigation: NavigationMenuItem[] = [
  {
    label: 'Aide & Support',
    icon: 'i-heroicons-question-mark-circle',
    to: '/docs'
  },
  {
    label: 'État du réseau',
    icon: 'i-heroicons-signal',
    to: 'https://status.glyria.app',
    target: '_blank',
    // Petit point vert pour le status online
    slot: 'trailing',
    chip: {
      color: 'success',
    }
  }
]

const PERMISSION_ITEMS: Record<string, NavigationMenuItem> = {
  'EXERCISES': {
    label: 'Exercices',
    icon: 'i-heroicons-command-line',
    to: `/dashboard/groupes/${groupdId}/exercices`,
  },
  'MANAGE_EXERCISES': {
    label: 'Gérer les Exercices',
    icon: 'i-heroicons-cog-6-tooth',
    to: `/dashboard/groupes/${groupdId}/manage-exercices`,
  },
  'MANAGE_MEMBERS': {
    label: 'Gérer les Membres',
    icon: 'i-heroicons-users',
    to: `/dashboard/groupes/${groupdId}/manage-members`,
  },
  'MANAGE_CODES': {
    label: 'Gérer les Codes',
    icon: 'i-heroicons-key',
    to: `/dashboard/groupes/${groupdId}/manage-codes`,
  },
  'MANAGE_ROLES': {
    label: "Gérer les roles",
    icon: 'i-heroicons-shield-check',
    to: `/dashboard/groupes/${groupdId}/manage-roles`,
  },
  'MANAGE_SETTINGS': {
    label: 'Paramètres du Groupe',
    icon: 'i-heroicons-cog-6-tooth',
    to: `/dashboard/groupes/${groupdId}/settings`,
  },
}
const groupesNavigation = Object.keys(PERMISSION_ITEMS)
    .filter(key => group.role.permissions.includes(key))
    .map(key => PERMISSION_ITEMS[key]) as NavigationMenuItem[]

</script>