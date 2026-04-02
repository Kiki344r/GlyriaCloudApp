import { defineStore } from 'pinia'

export const useGroupsStore = defineStore('groupsList', () => {
  const groups = ref<groupData[]>([])
  return { groups }
})
