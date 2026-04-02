import { defineStore } from 'pinia'

export const useGroupCodeStore = defineStore('groupCode', () => {
  const open = ref(false)
  const loading = ref(false)
  const disableClose = ref(false)

  return { open, loading, disableClose }
})
