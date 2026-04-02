// composables/useAppDetection.ts
export const useAppDetection = () => {
    // Détecte si on est dans l'environnement Tauri
    const isDesktop = computed(() => {
        // @ts-ignore
        return typeof window !== 'undefined' && window?.__TAURI__ !== undefined
    })

    const isWeb = computed(() => !isDesktop.value)

    return {
        isDesktop,
        isWeb
    }
}