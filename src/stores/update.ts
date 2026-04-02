import type { Update } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

export const useUpdateStore = defineStore('update', () => {
    const available = ref<Update | null>(null)
    const installing = ref(false)

    function setAvailable(update: Update) {
        available.value = update
    }

    async function install() {
        if (!available.value) return
        installing.value = true
        await available.value.downloadAndInstall()
        await relaunch()
    }

    return { available, installing, setAvailable, install }
})