import { defineStore } from 'pinia'

export const useGroupsStore = defineStore('groupsList', () => {
  const groups = ref<groupData[]>([])

  const fetchGroups = async () => {
    const { getGroups } = useGroups()
    const data = await getGroups()
    if (!data) return false

    groups.value = data
    return true
  }

  return { groups, fetchGroups }
})
