import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process';

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
            let downloaded = 0;
            let contentLength: number | undefined = 0;
            toast.add({
                title: "Mise à jour disponible !",
                description: `Version ${update.version} est disponible. Cliquez ici pour l'installer.`,
                duration: 0,
                actions: [{
                    icon: 'i-lucide-refresh-cw',
                    label: 'Mettre à jour',
                    color: 'neutral',
                    variant: 'outline',
                    onClick: async (e) => {

                        e?.stopPropagation()

                        const toastStatus = useToast().add({
                            title: "Téléchargement de la mise à jour...",
                            description: `Téléchargement en cours...`,
                            duration: 0,
                        })

                        await update.downloadAndInstall((event) => {
                            switch (event.event) {
                                case 'Started':
                                    useToast().update(toastStatus.id, {
                                        title: "Téléchargement de la mise à jour...",
                                        description: "Téléchargement de ${event.data.contentLength} bytes..."
                                    })
                                    contentLength = event.data.contentLength;
                                    console.log(`started downloading ${event.data.contentLength} bytes`);
                                    break;
                                case 'Progress':
                                    useToast().update(toastStatus.id, {
                                        title: "Téléchargement de la mise à jour...",
                                        description: `$\{downloaded} / $\{contentLength}`
                                    })
                                    downloaded += event.data.chunkLength;
                                    console.log(`downloaded ${downloaded} from ${contentLength}`);
                                    break;
                                case 'Finished':
                                    useToast().update(toastStatus.id, {
                                        title: "Téléchargement de la mise à jour terminer",
                                        description: `L'application va redémarrer`
                                    })
                                    console.log('download finished');
                                    break;
                            }
                        });

                        setTimeout(async () => {
                            console.log('update installed');
                            await relaunch();
                        }, 2000)
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