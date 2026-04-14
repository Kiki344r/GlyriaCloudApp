export default function useGroups() {
  const { requestPost, requestGet, requestDelete, requestPatch } = useApi()
  const toast = useToast()
  const router = useRouter()

  const groupsStore = useGroupsStore()
  const {groups} = storeToRefs(groupsStore)

  const updateGroups = async () => {
    return await groupsStore.fetchGroups()
  }

  const joinGroup = async (code: string) => {
    const { status, data } = await requestPost({
      version: 1,
      route: 'group/join',
      data: { code }
    }, true)

    if (!status || !data) return false

    if (data.success) {
      toast.add({
        title: 'Groupe rejoint',
        description: `Vous avez rejoint le groupe ${data.data.name}`,
        color: 'success'
      })

      await updateGroups()

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

    await updateGroups()
    router.push('/dashboard/groupes')

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

  const createRole = async (data: { groupId: string, name: string, permissions: string[] }) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'group/role',
      data
    })
    if (!status || !res) return false
    return res.data
  }

  const updateRole = async (data: { groupId: string, name: string, permissions: string[], UUID: string }) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'group/update-role',
      data
    })
    if (!status || !res) return false
    return res.data
  }

  const deleteRole = async (data: {groupId: string, UUID: string}) => {
    const { status, data: res } = await requestDelete({
      version: 1,
      route: 'group/role',
      data
    })
    if (!status || !res) return false
    return res.data
  }

  const getGroupsRef = (): Ref<groupData[]> => {
    const groupStore = useGroupsStore()
    return storeToRefs(groupStore).groups
  }

  const updateDefaultRole = async (data: {groupId: string, roleId: string}) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'group/default-role',
      data
    })
    if (!status || !res) return false
    return res.data
  }

  const updateMemberRole = async (data: {groupId: string, userId: string, roleId: string}) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'group/member-role',
      data
    })
    if (!status || !res) return false
    return res.data
  }

  const getCodes = async (groupId: string) => {
    const { status, data } = await requestGet({
      version: 1,
      route: 'group/codes',
      options: { groupId }
    }, false)
    if (!status || !data) return false
    return data.data as groupCode[]
  }

  const createCode = async (groupId: string) => {
    const { status, data } = await requestPost({
      version: 1,
      route: 'group/code',
      data: { groupId }
    })
    if (!status || !data) return false
    return data.data as string
  }

  const deleteCode = async (data: {groupId: string, code: string}) => {
    const { status, data: res } = await requestDelete({
      version: 1,
      route: 'group/code',
      data
    })
    if (!status || !res) return false
    return res.data
  }

  return {
    joinGroup,
    leaveGroup,
    getGroups,
    getGroupById,
    getGroupsRef,
    updateGroups,
    createRole,
    updateRole,
    deleteRole,
    updateDefaultRole,
    updateMemberRole,
    getCodes,
    createCode,
    deleteCode,
  }
}
