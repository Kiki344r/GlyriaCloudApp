export {}

declare global {
  interface groupData {
    UUID: string
    name: string
    defaultRoleId: string
    ownerId: string
    owner: groupUserData
  }

  interface groupUserData {
    UUID: string
    firstName: string
    lastName: string
  }

  interface groupDataGlobal extends groupData {
    members: groupMember[]
    roles: {
      UUID: string
      name: string
      permissions: string[]
      members: string[]
    }[]
  }

  interface groupMember {
    user: groupUserData
    role: {
      UUID: string
      name: string
    }
  }

  interface groupRole {
    UUID: string
    name: string
    permissions: string[]
  }

  interface groupDataById {
    group: groupDataGlobal
    role: groupRole
  }


  interface groupCode {
    UUID: string
    code: string
    createdAt: string
  }

}
