export {}

declare global {
  interface groupData {
    UUID: string
    name: string
    ownerId: string
    owner: {
      UUID: string
      firstName: string
      lastName: string
    }
  }

  interface groupUserData {
    firstName: string
    lastName: string
    UUID: string
  }

  interface groupDataGlobal extends groupData {
    members: groupMember[]
  }

  interface groupMember {
    user: groupUserData
    role: string
  }

  interface groupDataById {
    group: groupDataGlobal
    permissions: string[]
  }
}
