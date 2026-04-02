import { check } from '@tauri-apps/plugin-updater'

export default defineNuxtPlugin(async () => {
    const checkForUpdates = async () => {
        try {
            const update = await check()
            if (!update) return console.log("Application à jour !")

            console.log(`Mise à jour disponible : ${update.version}`)
            // Stocker dans un store Pinia pour afficher dans l'UI
            useUpdateStore().setAvailable(update)
        } catch (e) {
            console.error('Erreur updater:', e)
        }
    }

    // Vérif au démarrage
    await checkForUpdates()

    // Revérif toutes les heures
    setInterval(checkForUpdates, 1000 * 60 * 60)
})