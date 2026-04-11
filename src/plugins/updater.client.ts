import { check } from '@tauri-apps/plugin-updater'

export default defineNuxtPlugin(async () => {
    const checkForUpdates = async () => {
        try {
            const update = await check()
            console.log(update)
            if (!update) return console.log("Application à jour !")

            console.log(`Mise à jour disponible : ${update.version}`)
            // Stocker dans un store Pinia pour afficher dans l'UI
            useUpdateStore().setAvailable(update)

            const toast = useToast()
            toast.add({
                title: "Mise à jour disponible !",
                description: `Version ${update.version} est disponible. Cliquez ici pour l'installer.`,
                actions: [{
                    icon: 'i-lucide-refresh-cw',
                    label: 'Mettre à jour',
                    color: 'neutral',
                    variant: 'outline',
                    onClick: (e) => {
                        e?.stopPropagation()
                        useUpdateStore().install()
                    }
                }]
            })
        } catch (e) {
            console.error('Erreur updater:', e)
        }
    }

    // Vérif au démarrage
    await checkForUpdates()

    // Revérif toutes les heures
    setInterval(checkForUpdates, 1000 * 60 * 60)
})