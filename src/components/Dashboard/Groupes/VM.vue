<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Machines virtuelles</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ vms.length }} VM(s) dans ce groupe.</p>
      </div>
      <ModalDefault
          v-model:open="createOpen"
          v-model:loading="createLoading"
          v-model:disable-close="createDisableClose"
          title="Ajouter une VM"
          description="Choisissez le type de VM à ajouter."
          :button="{ label: 'Ajouter une VM', icon: 'i-heroicons-plus' }"
          :zod-schema="createSchema"
          :zod-state="createState"
          @submit="onCreateVm"
          @close="onCloseCreate"
      >
        <!-- Type -->
        <UFormField label="Type" name="type">
          <div class="grid grid-cols-2 gap-3">
            <div
                v-for="t in vmTypes"
                :key="t.value"
                class="flex flex-col gap-1 px-4 py-3 rounded-lg border cursor-pointer transition-colors"
                :class="createState.type?.value === t.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'"
                @click="createState.type = t"
            >
              <div class="flex items-center gap-2">
                <UIcon :name="t.icon" class="size-4" />
                <p class="text-sm font-medium">{{ t.label }}</p>
              </div>
              <p class="text-xs text-gray-400">{{ t.description }}</p>
            </div>
          </div>
        </UFormField>

        <!-- Nom -->
        <UFormField label="Nom" name="name">
          <UInput v-model="createState.name" placeholder="Ex: Ubuntu-22.04" class="w-full" />
        </UFormField>

        <!-- Champs lycée -->
        <template v-if="createState.type?.value === 'LYCEE'">
          <UFormField label="Système d'exploitation" name="os">
            <div class="grid grid-cols-1 gap-2">
              <div
                  v-for="os in osList"
                  :key="os.value"
                  class="flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-colors"
                  :class="createState.os?.value === os.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'"
                  @click="!os.disabled && (createState.os = os)"
              >
                <div class="flex items-center gap-3">
                  <img :src="os.logo" class="size-5 object-contain" :alt="os.label" />
                  <div>
                    <p class="text-sm font-medium" :class="os.disabled ? 'text-gray-400' : ''">{{ os.label }}</p>
                    <p class="text-xs text-gray-400">{{ os.description }}</p>
                  </div>
                </div>
                <UBadge v-if="os.disabled" size="xs" variant="soft" color="neutral" label="Bientôt" />
                <UIcon v-else-if="createState.os?.value === os.value" name="i-heroicons-check-circle" class="size-4 text-primary-500" />
              </div>
            </div>
          </UFormField>
        </template>

        <!-- Champs local -->
        <template v-if="createState.type?.value === 'LOCAL'">
          <UFormField label="Adresse IP" name="ip">
            <UInput v-model="createState.ip" placeholder="Ex: 192.168.1.50" class="w-full" />
          </UFormField>
          <UFormField label="Port SSH" name="sshPort">
            <UInput v-model="createState.sshPort" type="number" placeholder="22" class="w-full" />
          </UFormField>
          <UFormField label="Port RDP (optionnel)" name="rdpPort">
            <UInput v-model="createState.rdpPort" type="number" placeholder="3389" class="w-full" />
          </UFormField>

          <UAlert
              color="warning"
              variant="soft"
              icon="i-heroicons-exclamation-triangle"
              title="VM locale"
              description="Cette VM n'est accessible que si votre PC est allumé et connecté au réseau du lycée. L'accès depuis l'extérieur du lycée ne sera pas possible."
          />
        </template>

      </ModalDefault>
    </div>

    <USeparator />

    <!-- Empty state -->
    <div v-if="vms.length === 0" class="text-center py-8">
      <p class="text-sm text-gray-400">Vous ne possedez pas de VM dans ce groupe.</p>
    </div>

    <!-- Liste des VMs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
          v-for="vm in vms"
          :key="vm.UUID"
          class="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      >
        <!-- Header card -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <UIcon
                  :name="vm.type === 'LYCEE' ? 'i-heroicons-server' : 'i-heroicons-computer-desktop'"
                  class="size-4 text-gray-500"
              />
            </div>
            <div>
              <p class="text-sm font-medium">{{ vm.name }}</p>
              <p class="text-xs text-gray-400">
                {{ vm.type === 'LYCEE' ? vm.os.label : vm.ip }}
              </p>
            </div>
          </div>
          <UBadge
              :color="vm.type === 'LYCEE' ? 'primary' : 'neutral'"
              variant="soft"
              size="xs"
              :label="vm.type === 'LYCEE' ? 'Lycée' : 'Local'"
          />
        </div>

        <!-- Infos -->
        <div class="flex flex-wrap gap-2">
          <template v-if="vm.type === 'LOCAL'">
            <UBadge variant="outline" color="neutral" size="xs" :label="`SSH :${vm.sshPort}`" />
            <UBadge v-if="vm.rdpPort" variant="outline" color="neutral" size="xs" :label="`RDP :${vm.rdpPort}`" />
            <UBadge variant="soft" color="warning" size="xs" label="Réseau lycée uniquement" />
          </template>
          <template v-else>
            <div class="flex items-center gap-1.5">
              <img :src="vm.os.logo" class="size-4 object-contain" :alt="vm.os.label" />
              <p class="text-xs text-gray-400">{{ vm.os.label }}</p>
            </div>
          </template>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          <UButton
              size="xs"
              variant="ghost"
              icon="i-heroicons-arrow-path-rounded-square"
              label="Proxies"
              @click="navigateTo(`/dashboard/groupes/${groupId}/vms/${vm.UUID}/proxies`)"
          />
          <div class="ml-auto">
            <ModalDefault
                v-model:open="deleteOpen"
                v-model:loading="deleteLoading"
                v-model:disable-close="deleteDisableClose"
                title="Supprimer la VM"
                :description="selectedVm ? `Voulez-vous vraiment supprimer « ${selectedVm.name} » ?` : ''"
                :button="{ label: 'Supprimer', icon: 'i-heroicons-trash', color: 'error', variant: 'ghost' }"
                :zod-schema="deleteSchema"
                :zod-state="deleteState"
                @click="selectedVm = vm"
                @submit="onDeleteVm"
                @close="deleteOpen = false"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface OsOption {
  value: string
  label: string
  description: string
  logo: string
  disabled: boolean
}

interface VmLocal {
  UUID: string
  name: string
  type: 'LOCAL'
  ip: string
  sshPort: number
  rdpPort?: number
}

interface VmLycee {
  UUID: string
  name: string
  type: 'LYCEE'
  os: OsOption
}

type Vm = VmLocal | VmLycee

const route   = useRoute()
const toast   = useToast()
const {getVMS, createVM} = useGroups()
const groupId = route.params.groupId as string

// -- OS disponibles --
const osList: OsOption[] = [
  {
    value:       'debian-12',
    label:       'Debian 12 Server',
    description: 'Debian Bookworm, sans interface graphique',
    logo:        'https://www.debian.org/logos/openlogo-nd-100.png',
    disabled:    false
  },
  {
    value:       'ubuntu-22',
    label:       'Ubuntu 22.04 Server',
    description: 'Ubuntu LTS, sans interface graphique',
    logo:        'https://assets.ubuntu.com/v1/29985a98-ubuntu-logo32.png',
    disabled:    true
  },
  {
    value:       'windows-server-2022',
    label:       'Windows Server 2022',
    description: 'Windows Server avec interface graphique',
    logo:        'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg',
    disabled:    true
  }
]

const vmTypes = [
  {
    value:       'LYCEE',
    label:       'Lycée',
    icon:        'i-heroicons-server',
    description: 'VM hébergée sur le Proxmox du lycée'
  },
  {
    value:       'LOCAL',
    label:       'Locale',
    icon:        'i-heroicons-computer-desktop',
    description: 'VM ou PC sur le réseau local du lycée'
  }
]

// -- Données statiques --
const vms = ref<Vm[]>([])
const fetchVMS = await getVMS(groupId)
vms.value = fetchVMS ?? []

// -- Créer --
const createOpen         = ref(false)
const createLoading      = ref(false)
const createDisableClose = ref(false)

const createSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  type: z.object({ label: z.string(), value: z.string() }).nullable()
}).refine(d => d.type !== null, { message: 'Le type est requis', path: ['type'] })

const createState = reactive<{
  name:    string
  type:    { label: string, value: string } | null
  os:      OsOption | null
  ip:      string
  sshPort: number | null
  rdpPort: number | null
}>({
  name:    '',
  type:    null,
  os:      null,
  ip:      '',
  sshPort: 22,
  rdpPort: null
})

function onCloseCreate() {
  createOpen.value    = false
  createState.name    = ''
  createState.type    = null
  createState.os      = null
  createState.ip      = ''
  createState.sshPort = 22
  createState.rdpPort = null
}

async function onCreateVm() {
  createLoading.value      = true
  createDisableClose.value = true

  if (createState.type?.value === 'LYCEE') {

    await createVM(groupId, {
      name: createState.name,
      vmType: 'LYCEE'
    })

    vms.value.push({
      UUID: crypto.randomUUID(),
      name: createState.name,
      type: 'LYCEE',
      os:   createState.os ?? osList[0]
    })
  } else {
    vms.value.push({
      UUID:    crypto.randomUUID(),
      name:    createState.name,
      type:    'LOCAL',
      ip:      createState.ip,
      sshPort: createState.sshPort ?? 22,
      rdpPort: createState.rdpPort ?? undefined
    })
  }

  toast.add({ title: 'VM ajoutée', color: 'success' })
  createLoading.value      = false
  createDisableClose.value = false
  onCloseCreate()
}

// -- Supprimer --
const deleteOpen         = ref(false)
const deleteLoading      = ref(false)
const deleteDisableClose = ref(false)
const selectedVm         = ref<Vm | null>(null)

const deleteSchema = z.object({})
const deleteState  = reactive({})

async function onDeleteVm() {
  if (!selectedVm.value) return
  deleteLoading.value      = true
  deleteDisableClose.value = true

  // TODO: appel API → await requestDelete(...)
  await new Promise(r => setTimeout(r, 500))

  vms.value = vms.value.filter(v => v.UUID !== selectedVm.value!.UUID)

  toast.add({ title: `« ${selectedVm.value.name} » supprimée`, color: 'success' })
  selectedVm.value         = null
  deleteLoading.value      = false
  deleteDisableClose.value = false
  deleteOpen.value         = false
}
</script>