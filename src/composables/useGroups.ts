export default function useGroups() {
  const { requestPost, requestGet, requestDelete } = useApi()
  const toast = useToast()

  const { groups } = useGroupsStore()

  const updateGroups = async () => {
    const newGroups = await getGroups()
    if (!newGroups) return false
    groups.length = 0
    groups.push(...newGroups)
    return true
  }

  const joinGroup = async (code: string) => {
    const { status, data } = await requestPost({
      version: 1,
      route: 'group/join',
      data: { code }
    }, true)

    console.log('Join group, status: ', status, ', data: ', data, '')

    if (!status || !data) return false

    if (data.success) {
      toast.add({
        title: 'Groupe rejoint',
        description: `Vous avez rejoint le groupe ${data.data.name}`,
        color: 'success'
      })
      return true
    } else return false
  }

  const leaveGroup = async (UUID: string) => {
    const { status, data } = await requestDelete({
      version: 1,
      route: 'group/leave',
      data: { groupId: UUID }
    }, true)
    if (!status || !data) return false
    return data.success
  }

  const getGroups = async () => {
    const { status, data } = await requestGet({
      version: 1,
      route: 'groups/get'
    }, false)
    if (!status || !data) return false
    return data.data as groupData[]
  }

  const getGroupById = async (UUID: string) => {
    const { status, data } = await requestGet({
      version: 1,
      route: 'groups/get',
      options: { groupId: UUID }
    }, false)
    if (!status || !data) return false
    return data.data as groupDataById
  }

  const getGroupsRef = (): Ref<groupData[]> => {
    const groupStore = useGroupsStore()
    return storeToRefs(groupStore).groups
  }

  return {
    joinGroup,
    leaveGroup,
    getGroups,
    getGroupById,
    getGroupsRef,
    updateGroups
  }
}
