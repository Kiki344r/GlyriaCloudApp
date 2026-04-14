export {}

declare global {
  interface accountData {
    firstName: string
    lastName: string
    email: string
    memberships: groupData[]
    UUID: string
  }
}
